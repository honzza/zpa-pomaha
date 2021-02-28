module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({
        authenticated: false,
        //  message: "User has not been authenticated",
      });
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      return next();
    }
  },
};
