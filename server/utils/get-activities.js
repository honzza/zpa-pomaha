const axios = require("axios");
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

exports.getActivities = getActivities;
