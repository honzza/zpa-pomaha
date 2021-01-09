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
          u.activity.ride = resultsActivities.data.ytd_ride_totals.distance;
          u.activity.run = resultsActivities.data.ytd_run_totals.distance;
          u.activity.swim = resultsActivities.data.ytd_swim_totals.distance;
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

  // setTimeout(async () => {
  //   let users;
  //   try {
  //     users = await User.find();
  //   } catch (err) {
  //     return next(
  //       new HttpError("Fetching user data failed, please try again later", 500)
  //     );
  //   }
  //   if (users.length === 0) {
  //     return next(new HttpError("Could not find any user", 404));
  //   }
  //   const result = users.map((u) => u.toObject({ getters: true }));
  //   res.json({ result });
  //   console.log("timeout");
  // }, 5000);

  // if (new Date() - process.env.LAST_UPDATE < process.env.UPD_INTERVAL) {
  //   update strava tokens and activities
  //   process.env.LAST_UPDATE = new Date()
  // } else {
  //   console.log("No update needed, displaying data");
  // }
};

exports.updateAthletes = updateAthletes;
