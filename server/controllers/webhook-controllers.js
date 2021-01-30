const HttpError = require("../models/http-error");
const WebHook = require("../models/web-hook");

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
};

exports.getWebhook = getWebhook;
