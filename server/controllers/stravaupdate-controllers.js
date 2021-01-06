const axios = require("axios");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// Get updated activities data from Strava
function getActivities(u, next) {
  axios
    .get(`https://www.strava.com/api/v3/athletes/${u.uid}/stats`, {
      headers: {
        Authorization: `Bearer ${u.shortlivedATC}`,
      },
    })
    .then((results) => {
      u.activity.ride = results.data.ytd_ride_totals.distance;
      u.activity.run = results.data.ytd_run_totals.distance;
      u.activity.swim = results.data.ytd_swim_totals.distance;
    })
    .catch((error) => {
      return next(
        new HttpError(
          `Fetching activities from Strava for user ${u.firstname} ${u.lastname} failed.`,
          500
        )
      );
    })
    .then(() => {
      try {
        u.save();
      } catch (error) {
        return next(new HttpError("Saving data to database failed.", 500));
      }
    });
}

// Get every document from DB and update tokens and activities
const getAthleteStats = async (req, res, next) => {
  try {
    const users = User.find().then((foundUser) => {
      foundUser.forEach(async (u) => {
        if (new Date() > u.expirationATC) {
          axios
            .post(
              `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${u.refreshTC}`
            )
            .then((results) => {
              u.shortlivedATC = results.data.access_token;
              u.refreshTC = results.data.refresh_token;
              u.expirationATC = results.data.expires_at * 1000;
            })
            .catch((error) => {
              return next(
                new HttpError(
                  `Fetching tokens from Strava for user ${u.firstname} ${u.lastname} failed.`,
                  500
                )
              );
            })
            .then(() => getActivities(u, next));
        } else {
          getActivities(u, next);
        }
      });
    });
  } catch (error) {
    return next(
      new HttpError(
        "Fetching user data from database failed, please try again later.",
        500
      )
    );
  }
  res.send("done");
};

//if (users.length === 0) {
//  return next(new HttpError("Could not find any user.", 404));
//res.json({ userArray: users.toObject() });

exports.getAthleteStats = getAthleteStats;
