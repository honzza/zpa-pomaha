const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  uid: { type: Number, required: true },
  shortlivedATC: { type: String, required: true },
  expirationATC: { type: Date, required: true },
  refreshTC: { type: String, required: true },
  scope: { type: String, required: true },
  activity: {
    ride: { type: Number, required: false },
    run: { type: Number, required: false },
    swim: { type: Number, required: false },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
