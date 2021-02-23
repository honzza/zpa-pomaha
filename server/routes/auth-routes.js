const router = require("express").Router();
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const winston = require("../config/winston");

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  if (req.user) {
    winston.info(req.user.displayname);
    res.json({
      success: true,
      message: "User has successfully authenticated",
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
});

// when login failed, send failed msg
router.get("/login/failed", ensureGuest, (req, res) => {
  res.status(401).json({
    success: false,
    message: "User failed to authenticate",
  });
});

router.get(
  "/strava",
  ensureGuest,
  passport.authenticate("strava", { scope: [process.env.SCOPE] })
);

router.get(
  "/strava/callback",
  ensureGuest,
  passport.authenticate("strava", {
    successRedirect: `${process.env.CLIENT_PATH}`,
    failureRedirect: "/auth/login/failed",
    failureFlash: true,
  })
);

router.get("/logout", ensureAuth, (req, res) => {
  req.logout();
  req.flash("message", "You have successfully logged out");
  res.redirect(`${process.env.CLIENT_PATH}/login`);
});

module.exports = router;
