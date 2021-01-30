const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const webhookSchema = new Schema({
  object_type: { type: String },
  object_id: { type: Number },
  aspect_type: { type: String },
  updates: {
    title: { type: String },
    type: { type: String },
    private: { type: Boolean },
    authorized: { type: Boolean },
  },
  owner_id: { type: Number },
  subscription_id: { type: Number },
  event_time: { type: Number },
});

module.exports = mongoose.model("WebHook", webhookSchema);
