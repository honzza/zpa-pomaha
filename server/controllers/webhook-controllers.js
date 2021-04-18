const axios = require("axios");
const HttpError = require("../models/http-error");
const WebHook = require("../models/web-hook");
const Activity = require("../models/activity");
const User = require("../models/user");
const utils = require("../utils/utils");
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

  try {
    await newWebhook.save();
    webhookLogger.info("Incoming webhook", {
      status: 201,
      webhook: newWebhook.toObject({ versionKey: false }),
    });
  } catch (err) {
    webhookLogger.error(err);
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
          // Process webhook activity event
          if (w.object_type === "activity") {
            let activity;
            let user;
            switch (w.aspect_type) {
              // Webhook type - CREATE
              case "create":
                // Find out if activity already exists
                activity = await Activity.findOne({ id: w.object_id });
                if (!activity) {
                  user = await User.findOne({ uid: w.owner_id });
                  // Refresh token
                  if (new Date() > user.expirationATC) {
                    try {
                      const tokens = await axios.post(
                        `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${user.refreshTC}`
                      );
                      user.shortlivedATC = tokens.data.access_token;
                      user.refreshTC = tokens.data.refresh_token;
                      user.expirationATC = tokens.data.expires_at * 1000;
                      user.save();
                    } catch (err) {
                      webhookLogger.error(err);
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
                    if (err.response.status === 404) {
                      webhookLogger.warn("Activity doesn't exist on Strava", {
                        type: "create",
                        status: 404,
                        webhook: w.toObject({ versionKey: false }),
                      });
                      await w.remove();
                      break;
                    } else {
                      webhookLogger.error(err);
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
                  activity = await Activity.create(newActivity);
                  if (activity) await w.remove();
                } else {
                  await w.remove();
                  webhookLogger.warn("Activity already exists in DB", {
                    type: "create",
                    status: 304,
                    webhook: w.toObject({ versionKey: false }),
                  });
                }
                break;

              // Webhook type - UPDATE
              case "update":
                if (w.updates.title || w.updates.type) {
                  activity = await Activity.findOne({ id: w.object_id });
                  if (activity) {
                    if (w.updates.title) activity.name = w.updates.title;
                    if (w.updates.type) activity.type = w.updates.type;
                    await activity.save();
                  } else {
                    webhookLogger.warn(
                      `Activity ${w.object_id} doesn't exist`,
                      {
                        type: "update",
                        status: 404,
                        webhook: w.toObject({ versionKey: false }),
                      }
                    );
                  }
                } else {
                  webhookLogger.warn("Nothing to update", {
                    type: "update",
                    status: 304,
                    webhook: w.toObject({ versionKey: false }),
                  });
                }
                await w.remove();
                break;

              // Webhook type - DELETE
              case "delete":
                activity = await Activity.findOneAndDelete({ id: w.object_id });
                if (!activity)
                  webhookLogger.warn(`Activity ${w.object_id} doesn't exist`, {
                    type: "delete",
                    status: 404,
                    webhook: w.toObject({ versionKey: false }),
                  });
                await w.remove();
                break;
            }
          }

          await utils.updateAthlete(w.owner_id);

          // Process webhook athlete event
          if (w.object_type === "athlete") {
            if (w.aspect_type === "update") {
              if (w.updates.authorized === false) {
                const activity = await Activity.deleteMany({
                  athlete_id: w.owner_id,
                });
                let user = await User.findOneAndDelete({ uid: w.owner_id });
                await w.remove();
                user ? (user = true) : (user = false);
                webhookLogger.info(
                  `user removed: ${user}, activities removed: ${activity.deletedCount}`,
                  {
                    type: "athlete update",
                    status: 200,
                    webhook: w.toObject({ versionKey: false }),
                  }
                );
              }
            }
          }
        });
      });
  } catch (err) {
    webhookLogger.error(err);
  }
};

exports.getWebhook = getWebhook;
exports.processWebhooks = processWebhooks;
exports.createSubscription = createSubscription;
