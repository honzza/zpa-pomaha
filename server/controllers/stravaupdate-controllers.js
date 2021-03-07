const HttpError = require("../models/http-error");
const User = require("../models/user");
const Activity = require("../models/activity");

const updateAthletes = async (req, res, next) => {
  try {
    await User.find().exec((err, foundUser) => {
      foundUser.forEach(async (u) => {
        u.activity.ride.m = 0;
        u.activity.run.m = 0;
        u.activity.swim.m = 0;
        u.activity.nski.m = 0;
        u.validactivities = 0;
        u.numactivities = 0;
        await Activity.find({ athlete_id: u.uid }).exec(
          async (err, foundActivity) => {
            foundActivity.forEach((a) => {
              if (a.type === "Ride") {
                u.activity.ride.m += a.distance;
                u.validactivities++;
              }
              if (a.type === "Run") {
                u.activity.run.m += a.distance;
                u.validactivities++;
              }
              if (a.type === "Swim") {
                u.activity.swim.m += a.distance;
                u.validactivities++;
              }
              if (a.type === "NordicSki" || a.type === "BackcountrySki") {
                u.activity.nski.m += a.distance;
                u.validactivities++;
              }
              u.numactivities++;
            });
            u.activity.ride.kc =
              (u.activity.ride.m / 1000) * process.env.RIDE_KC;
            u.activity.run.kc = (u.activity.run.m / 1000) * process.env.RUN_KC;
            u.activity.swim.kc =
              (u.activity.swim.m / 1000) * process.env.SWIM_KC;
            u.activity.nski.kc =
              (u.activity.nski.m / 1000) * process.env.NSKI_KC;
            u.updatedAt = new Date();

            await u.save();
          }
        );
      });
    });
    res.json({ message: "Athlete stats updated" });
  } catch (err) {
    return next(new HttpError("Updating athlete stats failed", 500));
  }
};

exports.updateAthletes = updateAthletes;
