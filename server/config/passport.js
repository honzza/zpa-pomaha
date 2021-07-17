const StravaStrategy = require("passport-strava").Strategy;
const User = require("../models/user");
const axios = require("axios");
const Config = require("../models/app-config");
const { getActivities } = require("../utils/activities-utils");
const { updateAthlete } = require("../utils/athlete-utils");

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
          clubs: [],
        };
        // Check if logging athlete is member of a club of any application in DB
        let userClubsArray;
        try {
          let clubMember = await axios.get(
            "https://www.strava.com/api/v3/athlete/clubs",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          let config = await Config.find();

          userClubsArray = clubMember.data.map((x) => x.id);
          let appClubsArray = config.map((x) => x.club_id);
          let intersection = userClubsArray.filter((x) =>
            appClubsArray.includes(x)
          );
          if (!intersection.length) {
            await axios.post(
              `https://www.strava.com/oauth/deauthorize?access_token=${accessToken}`
            );
            return done(null, false, {
              message:
                "Je nám líto, ale tato aplikace je pouze pro členy vybraných sportovních klubů Strava",
            });
          }
        } catch (err) {
          console.error(err);
        }

        // Check if logging athlete already exists
        try {
          let user = await User.findOne({ uid: profile.id });
          if (user) {
            // Update user's clubs
            user.clubs = userClubsArray;
            await user.save();
            done(null, user);
          } else {
            newUser.clubs = userClubsArray;
            user = await User.create(newUser);
            // Get athlete activity history
            await getActivities(accessToken);
            await updateAthlete(user.uid);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
};
