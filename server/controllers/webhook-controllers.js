const HttpError = require("../models/http-error");
const WebHook = require("../models/web-hook");

const createSubscription = async (req, res, next) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = proces.env.VERIFY_TOKEN;
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
  res.status(200).json({ webhook: newWebhook });
  // res.status(200).send('EVENT_RECEIVED');
};

exports.getWebhook = getWebhook;
exports.createSubscription = createSubscription;
