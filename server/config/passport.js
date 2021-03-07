const StravaStrategy = require("passport-strava").Strategy;
const User = require("../models/user");
const Activity = require("../models/activity");
const axios = require("axios");

module.exports = function (passport) {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) =>
    User.findById(id, (err, user) => done(err, user))
  );

  passport.use(
    new StravaStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/strava/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          uid: profile.id,
          firstname: profile.name.first,
          lastname: profile.name.last,
          displayname: profile.displayName,
          avatar: profile.avatar,
          shortlivedATC: accessToken,
          expirationATC: Date.now(),
          refreshTC: refreshToken,
          scope: process.env.SCOPE,
          activity: {
            ride: { m: 0, kc: 0 },
            run: { m: 0, kc: 0 },
            swim: { m: 0, kc: 0 },
            nski: { m: 0, kc: 0 },
          },
          active: true,
          numactivities: 0,
          validactivities: 0,
        };
        // Check if logging athlete is member of selected club
        try {
          let clubMember = await axios.get(
            "https://www.strava.com/api/v3/athlete/clubs",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (!clubMember.data.find((v) => v.id == process.env.CLUB_ID)) {
            try {
              let user = await User.findOne({ uid: profile.id });
              if (user) await user.remove();
            } catch (err) {
              console.error(err);
            }
            return done(null, false, {
              message:
                "Sorry, this application is only for the members of the ZPA club",
            });
          }
        } catch (err) {
          console.error(err);
        }

        // Check if logging athlete already exists
        try {
          let user = await User.findOne({ uid: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);

            // Get athlete activity history
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
            do {
              try {
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
              } catch (err) {
                console.error(err);
              }
              page++;
            } while (activityHistory.data.length);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
};
