const { Router } = require("express");
const router = Router();
const passport = require("passport");

router.get(
  "/strava",
  passport.authenticate("strava", { scope: [process.env.SCOPE] })
);

router.get(
  "/strava/callback",
  passport.authenticate("strava", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/main");
  }
);

router.get("logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
