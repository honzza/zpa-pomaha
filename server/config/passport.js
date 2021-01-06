const StravaStrategy = require("passport-strava").Strategy;
const User = require("../models/user");

module.exports = function (passport) {
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
          shortlivedATC: accessToken,
          expirationATC: Date.now(),
          refreshTC: refreshToken,
          scope: process.env.SCOPE,
          activity: { ride: 0, run: 0, swim: 0 },
          createdAt: Date.now(),
        };
        try {
          let user = await User.findOne({ uid: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) =>
    User.findById(id, (err, user) => done(err, user))
  );
};
