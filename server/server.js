const express = require("express");
const app = express();
const dotenv = require("dotenv");
const session = require("express-session");
const morgan = require("morgan");
const passport = require("passport");
const HttpError = require("./models/http-error");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

// Config
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 5000;
require("./config/passport")(passport);
const connectDB = require("./config/db");

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser("keyboard cat"));
app.use(flash());

// Sessions
app.use(
  session({
    secret: "zetpik pomaha",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
    // store - doplnit
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes definition
app.use("/auth", require("./routes/auth-routes"));
app.use("/main", require("./routes/users-routes"));
app.use("/strava", require("./routes/stravaupdate-routes"));
app.use("/activity", require("./routes/activities-routes"));
app.use("/error", (req, res) => {
  res.json({ error: req.flash("error")[0] });
});

// Unknown route error
app.use((req, res, next) => {
  return next(new HttpError("Could not find this route", 404));
});

// Error handler
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An uknown error occurred!" });
});

// Database connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
