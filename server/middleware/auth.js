module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect(`${process.env.CLIENT_PATH}/login`);
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect(`${process.env.CLIENT_PATH}/dashboard`);
    } else {
      return next();
    }
  },
};
