const axios = require("axios");
const Activity = require("../models/activity");
const User = require("../models/user");
const { updateAthlete } = require("./athlete-utils");

// ---------- BULK ACTIVITY DOWNLOAD FROM STRAVA ----------

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

// ---------- ADMIN - UPLOAD ACTIVITIES ----------

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

// ---------- ADMIN - DELETE ACTIVITIES ----------

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

exports.getActivities = getActivities;
exports.uploadActivities = uploadActivities;
exports.deleteActivities = deleteActivities;
