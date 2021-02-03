const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  displayname: { type: String, required: false },
  uid: { type: Number, required: true },
  avatar: { type: String, required: false },
  shortlivedATC: { type: String, required: true },
  expirationATC: { type: Date, required: true },
  refreshTC: { type: String, required: true },
  scope: { type: String, required: true },
  activity: {
    ride: {
      m: { type: Number, required: false },
      kc: { type: Number, required: false },
    },
    run: {
      m: { type: Number, required: false },
      kc: { type: Number, required: false },
    },
    swim: {
      m: { type: Number, required: false },
      kc: { type: Number, required: false },
    },
    nski: {
      m: { type: Number, required: false },
      kc: { type: Number, required: false },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  active: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);
