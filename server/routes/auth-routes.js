const { Router } = require("express");
const router = Router();
const passport = require("passport");

router.get(
  "/strava",
  passport.authenticate("strava", { scope: [process.env.SCOPE] })
);

router.get(
  "/strava/callback",
  passport.authenticate("strava", {
    failureRedirect: "/error",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/main");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("message", "You have successfully logged out");
  res.redirect("/");
});

module.exports = router;
