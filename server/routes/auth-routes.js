const { Router } = require("express");
const router = Router();
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get(
  "/strava",
  ensureGuest,
  passport.authenticate("strava", { scope: [process.env.SCOPE] })
);

router.get(
  "/strava/callback",
  ensureGuest,
  passport.authenticate("strava", {
    failureRedirect: "/error",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/main");
  }
);

router.get("/logout", ensureAuth, (req, res) => {
  req.logout();
  req.flash("message", "You have successfully logged out");
  res.redirect("/logout");
});

module.exports = router;
