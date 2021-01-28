const axios = require("axios");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const updateAthletes = async (req, res, next) => {
  try {
    await User.find().exec((err, foundUser) => {
      foundUser.forEach(async (u) => {
        try {
          if (new Date() > u.expirationATC) {
            const resultsTokens = await axios.post(
              `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${u.refreshTC}`
            );
            u.shortlivedATC = resultsTokens.data.access_token;
            u.refreshTC = resultsTokens.data.refresh_token;
            u.expirationATC = resultsTokens.data.expires_at * 1000;
          }
          const resultsActivities = await axios.get(
            `https://www.strava.com/api/v3/athletes/${u.uid}/stats`,
            {
              headers: {
                Authorization: `Bearer ${u.shortlivedATC}`,
              },
            }
          );
          u.activity.ride.m = resultsActivities.data.ytd_ride_totals.distance;
          u.activity.ride.kc = (u.activity.ride.m / 1000) * process.env.RIDE_KC;
          u.activity.run.m = resultsActivities.data.ytd_run_totals.distance;
          u.activity.run.kc = (u.activity.run.m / 1000) * process.env.RUN_KC;
          u.activity.swim.m = resultsActivities.data.ytd_swim_totals.distance;
          u.activity.swim.kc = (u.activity.swim.m / 1000) * process.env.SWIM_KC;
          u.updatedAt = new Date();
        } catch (err) {
          return next(
            new HttpError(
              `Fetching data from Strava for user ${u.firstname} ${u.lastname} failed`
            ),
            500
          );
        }
        try {
          await u.save();
        } catch (err) {
          return next(new HttpError("Saving data to database failed", 500));
        }
      });
    });
    res.json({ message: "Athlete tokens and activities updated" });
  } catch (err) {
    return next(
      new HttpError(
        "Fetching user data from database failed, please try again later",
        500
      )
    );
  }
};

exports.updateAthletes = updateAthletes;
