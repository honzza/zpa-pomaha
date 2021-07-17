const User = require("../models/user");
const Activity = require("../models/activity");

//---------- UPDATE ATHLETES STATS IN THE DATABASE ----------

const updateAthlete = async (userUid) => {
  try {
    let u = await User.findOne({ uid: userUid });
    u.activity.ride.m = 0;
    u.activity.run.m = 0;
    u.activity.swim.m = 0;
    u.activity.nski.m = 0;
    u.activity.walk.m = 0;
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
          if ((a.type === "Walk" || a.type === "Hike") && a.distance >= 5000) {
            u.activity.walk.m += a.distance;
          }
          u.numactivities++;
        });
        u.activity.ride.kc = (u.activity.ride.m / 1000) * process.env.RIDE_KC;
        u.activity.run.kc = (u.activity.run.m / 1000) * process.env.RUN_KC;
        u.activity.swim.kc = (u.activity.swim.m / 1000) * process.env.SWIM_KC;
        u.activity.nski.kc = (u.activity.nski.m / 1000) * process.env.NSKI_KC;
        u.activity.walk.kc = 0;
        u.updatedAt = new Date();
        await u.save();
      }
    );
  } catch (err) {
    console.error(err);
  }
};

exports.updateAthlete = updateAthlete;
