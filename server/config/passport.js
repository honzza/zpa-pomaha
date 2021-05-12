const StravaStrategy = require("passport-strava").Strategy;
const User = require("../models/user");
const axios = require("axios");
const utils = require("../utils/utils");

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
            walk: { m: 0, kc: 0 },
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
            await axios.post(
              `https://www.strava.com/oauth/deauthorize?access_token=${accessToken}`
            );
            return done(null, false, {
              message:
                "Je nám líto, ale tato aplikace je pouze pro členy sportovního klubu ZPA",
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
            await utils.getActivities(accessToken);
            await utils.updateAthlete(user.uid);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
};
