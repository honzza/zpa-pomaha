const axios = require("axios");
const HttpError = require("../models/http-error");
const WebHook = require("../models/web-hook");
const Activity = require("../models/activity");
const User = require("../models/user");
const { webhookLogger } = require("../config/winston");

const createSubscription = async (req, res, next) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  // Parses the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.json({ "hub.challenge": challenge });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

const getWebhook = async (req, res, next) => {
  const {
    object_type,
    object_id,
    aspect_type,
    updates,
    owner_id,
    subscription_id,
    event_time,
  } = req.body;

  const newWebhook = new WebHook({
    object_type,
    object_id,
    aspect_type,
    updates,
    owner_id,
    subscription_id,
    event_time,
  });

  const webhookLog =
    object_type +
    "-" +
    object_id +
    "-uid:" +
    owner_id +
    "-" +
    aspect_type +
    "-upd:" +
    JSON.stringify(updates) +
    "-tm:" +
    event_time;

  try {
    await newWebhook.save();
    webhookLogger.info("IN-" + webhookLog);
    console.info({
      message: "Incoming webhook",
      status: 201,
      webhook: newWebhook,
    });
  } catch (err) {
    webhookLogger.error(err);
    console.error(err);
  }
  res.sendStatus(200);
  next();
};

const processWebhooks = async (req, res, next) => {
  try {
    await WebHook.find()
      .sort({ event_time: 1 })
      .exec((err, newWebhook) => {
        newWebhook.forEach(async (w) => {
          const webhookLog =
            w.object_type +
            "-" +
            w.object_id +
            "-uid:" +
            w.owner_id +
            "-" +
            w.aspect_type +
            "-upd:" +
            JSON.stringify(w.updates) +
            "-tm:" +
            w.event_time;
          try {
            // Process webhook activity event
            if (w.object_type === "activity") {
              let activity;
              let user;
              switch (w.aspect_type) {
                // Webhook type - CREATE
                case "create":
                  // Find out if activity already exists
                  try {
                    activity = await Activity.findOne({
                      id: w.object_id,
                    });
                  } catch (err) {
                    webhookLogger.error(err);
                    console.error(err);
                  }
                  if (!activity) {
                    try {
                      user = await User.findOne({ uid: w.owner_id });
                    } catch (err) {
                      webhookLogger.error(err);
                      console.error(err);
                    }
                    // Refresh user token (TD: if user not found - unhandled exeption)
                    if (new Date() > user.expirationATC) {
                      try {
                        const tokens = await axios.post(
                          `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${user.refreshTC}`
                        );
                        user.shortlivedATC = tokens.data.access_token;
                        user.refreshTC = tokens.data.refresh_token;
                        user.expirationATC = tokens.data.expires_at * 1000;
                      } catch (err) {
                        webhookLogger.error(err);
                        console.error(err);
                      }
                      try {
                        user.save();
                      } catch (err) {
                        webhookLogger.error(err);
                        console.error(err);
                      }
                    }
                    // Get new activity with token up-to-date
                    try {
                      activity = await axios.get(
                        `https://www.strava.com/api/v3/activities/${w.object_id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${user.shortlivedATC}`,
                          },
                        }
                      );
                    } catch (err) {
                      webhookLogger.error(err);
                      console.error(err);
                      if (err.response.status === 404) {
                        try {
                          await w.remove();
                          webhookLogger.info("NF404-" + webhookLog);
                          console.warn({
                            message: "CREATE: Activity doesn't exist on Strava",
                            status: 404,
                            webhook: newWebhook,
                          });
                        } catch (err) {
                          webhookLogger.error(err);
                          console.error(err);
                        }
                        break;
                      }
                    }
                    const ah = activity.data;
                    const newActivity = {
                      athlete_id: ah.athlete.id,
                      name: ah.name,
                      distance: ah.distance,
                      moving_time: ah.moving_time,
                      elapsed_time: ah.elapsed_time,
                      total_elevation_gain: ah.total_elevation_gain,
                      type: ah.type,
                      id: ah.id,
                      start_date_local: ah.start_date_local,
                      start_latlng: ah.start_latlng,
                      average_speed: ah.average_speed,
                      max_speed: ah.max_speed,
                      average_heartrate: ah.average_heartrate,
                      max_heartrate: ah.max_heartrate,
                      elev_high: ah.elev_high,
                      elev_low: ah.elev_low,
                    };
                    try {
                      activity = await Activity.create(newActivity);
                      if (activity) await w.remove();
                    } catch (err) {
                      webhookLogger.error(err);
                      console.error(err);
                    }
                  } else {
                    try {
                      await w.remove();
                      webhookLogger.info("DUPL-" + webhookLog);
                      console.warn({
                        message: "CREATE: Activity already exists",
                        status: 304,
                        webhook: newWebhook,
                      });
                    } catch (err) {
                      webhookLogger.error(err);
                      console.error(err);
                    }
                  }
                  break;

                // Webhook type - UPDATE
                case "update":
                  if (w.updates.title || w.updates.type) {
                    try {
                      activity = await Activity.findOne({
                        id: w.object_id,
                      });
                    } catch (err) {
                      webhookLogger.error(err);
                      console.error(err);
                    }
                    if (activity) {
                      if (w.updates.title) activity.name = w.updates.title;
                      if (w.updates.type) activity.type = w.updates.type;
                      try {
                        await activity.save();
                      } catch (err) {
                        webhookLogger.error(err);
                        console.error(err);
                      }
                    } else {
                      webhookLogger.error(
                        `UPDATE: Activity ${w.object_id} doesn't exist`
                      );
                      console.warn({
                        message: `UPDATE: Activity ${w.object_id} doesn't exist`,
                        status: 404,
                        webhook: newWebhook,
                      });
                    }
                  } else {
                    webhookLogger.info("NOUPD-" + webhookLog);
                    console.warn({
                      message: "UPDATE: Nothing to update",
                      status: 304,
                      webhook: newWebhook,
                    });
                  }
                  try {
                    await w.remove();
                  } catch (err) {
                    webhookLogger.error(err);
                    console.error(err);
                  }
                  break;

                // Webhook type - DELETE
                case "delete":
                  try {
                    activity = await Activity.findOneAndDelete({
                      id: w.object_id,
                    });
                    if (!activity) {
                      webhookLogger.error(
                        `DELETE: Activity ${w.object_id} doesn't exist`
                      );
                      console.warn({
                        message: `DELETE: Activity ${w.object_id} doesn't exist`,
                        status: 404,
                        webhook: newWebhook,
                      });
                    }
                    await w.remove();
                  } catch (err) {
                    webhookLogger.error(err);
                    console.error(err);
                  }
                  break;
              }
            }
          } catch (err) {
            webhookLogger.error(err);
            console.error(err);
          }
        });
      });
  } catch (err) {
    webhookLogger.error(err);
    console.error(err);
  }
};

exports.getWebhook = getWebhook;
exports.processWebhooks = processWebhooks;
exports.createSubscription = createSubscription;
