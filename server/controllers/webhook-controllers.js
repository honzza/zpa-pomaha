const axios = require("axios");
const HttpError = require("../models/http-error");
const WebHook = require("../models/web-hook");
const Activity = require("../models/activity");
const User = require("../models/user");

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
  } catch (err) {
    const error = new HttpError("Creating activity hook failed", 500);
    return next(error);
  }
  res.sendStatus(200);
  next();
};

const processWebhooks = async (req, res, next) => {
  try {
    await WebHook.find().exec((err, newWebhook) => {
      newWebhook.forEach(async (w) => {
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
                  console.error(err);
                }
                if (!activity) {
                  try {
                    user = await User.findOne({ uid: w.owner_id });
                  } catch (err) {
                    console.error(err);
                  }
                  // Refresh user token
                  if (new Date() > user.expirationATC) {
                    try {
                      const tokens = await axios.post(
                        `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${user.refreshTC}`
                      );
                      user.shortlivedATC = tokens.data.access_token;
                      user.refreshTC = tokens.data.refresh_token;
                      user.expirationATC = tokens.data.expires_at * 1000;
                    } catch (err) {
                      console.error(err);
                    }
                    try {
                      user.save();
                    } catch (err) {
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
                    console.error(err);
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
                    console.error(err);
                  }
                }
                break;
              case "update":
                console.log("update");
                break;
              // Webhook type - DELETE
              case "delete":
                try {
                  activity = await Activity.findOneAndDelete({
                    id: w.object_id,
                  });
                  if (activity) await w.remove();
                } catch (err) {
                  console.error(err);
                }
                break;
            }
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};

exports.getWebhook = getWebhook;
exports.processWebhooks = processWebhooks;
exports.createSubscription = createSubscription;
