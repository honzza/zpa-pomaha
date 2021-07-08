const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  club_id: { type: Number },
  app_title: { type: String },
});

module.exports = mongoose.model("Config", configSchema);
