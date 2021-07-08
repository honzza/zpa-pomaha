const axios = require("axios");
const User = require("../models/user");
const Activity = require("../models/activity");

const getActivities = async (accessToken) => {
  let page = 1;
  let activityHistory;
  // Set epoch (JS months start from 0)
  const yearStart = new Date().getFullYear() - 1;
  const epoch =
    new Date(
      yearStart,
      process.env.MONTH_START,
      process.env.DAY_START
    ).valueOf() / 1000;
  try {
    do {
      activityHistory = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities?after=${epoch}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      activityHistory.data.forEach(async (ah) => {
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
        await Activity.create(newActivity);
      });
      page++;
    } while (activityHistory.data.length);
  } catch (err) {
    console.error(err);
  }
};

const updateAthlete = async (userUid, userClubs) => {
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
        u.clubs = userClubs;
        u.updatedAt = new Date();
        await u.save();
      }
    );
  } catch (err) {
    console.error(err);
  }
};

const deleteActivities = async (req, res, next) => {
  let result;
  try {
    result = await Activity.deleteMany({ athlete_id: req.params.uid });
  } catch (err) {
    console.error(err);
  }
  await updateAthlete(req.params.uid);
  res.json(result);
};

const uploadActivities = async (req, res, next) => {
  let user = await User.findOne({ uid: req.params.uid });
  // Refresh token
  if (new Date() > user.expirationATC) {
    try {
      const tokens = await axios.post(
        `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${user.refreshTC}`
      );
      user.shortlivedATC = tokens.data.access_token;
      user.refreshTC = tokens.data.refresh_token;
      user.expirationATC = tokens.data.expires_at * 1000;
      user.save();
    } catch (err) {}
  }
  await getActivities(user.shortlivedATC);
  await updateAthlete(req.params.uid);
  res.json("Aktivity byly staženy ze Stravy, je nutné načíst stránku znovu");
};

exports.getActivities = getActivities;
exports.updateAthlete = updateAthlete;
exports.deleteActivities = deleteActivities;
exports.uploadActivities = uploadActivities;
