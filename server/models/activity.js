const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  athlete_id: { type: Number },
  name: { type: String },
  distance: { type: Number },
  moving_time: { type: Number },
  elapsed_time: { type: Number },
  total_elevation_gain: { type: Number },
  type: { type: String },
  id: { type: Number },
  start_date_local: { type: Date },
  start_latlng: { type: Array },
  average_speed: { type: Number },
  max_speed: { type: Number },
  average_heartrate: { type: Number },
  max_heartrate: { type: Number },
  elev_high: { type: Number },
  elev_low: { type: Number },
});

module.exports = mongoose.model("Activity", activitySchema);
