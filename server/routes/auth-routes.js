const router = require("express").Router();
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { userLogger } = require("../config/winston");

router.get("/login/success", (req, res) => {
  if (req.user) {
    userLogger.info("login", { user: req.user.displayname });
    res.json({
      success: true,
      message:
        "Přihlášení proběhlo úspěšně, vítejte v aplikaci ZPA pomáhá sportem!",
      user: req.user,
    });
  } else {
    let msg = JSON.stringify(req.flash());
    msg = JSON.parse(msg);
    Object.keys(msg).length > 0 ? (msg = msg.error[0]) : (msg = undefined);
    res.status(401).json({
      success: false,
      message: msg,
    });
  }
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
    successRedirect: `${process.env.CLIENT_PATH}/dashboard`,
    failureRedirect: `${process.env.CLIENT_PATH}/login`,
    failureFlash: true,
  })
);

router.get("/logout", ensureAuth, (req, res) => {
  req.logout();
  req.flash("error", "Došlo k odhlášení z aplikace");
  res.redirect(`${process.env.CLIENT_PATH}/login`);
});

module.exports = router;
