const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
//const session = require("express-session");
const morgan = require("morgan");
const passport = require("passport");
const HttpError = require("./models/http-error");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const { ensureAuth, ensureGuest } = require("./middleware/auth");

// Config
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 5000;
require("./config/passport")(passport);
const connectDB = require("./config/db");

// Set response headers
app.use(
  cors({
    origin: process.env.CLIENT_PATH,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sessions
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(cookieParser());

app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes definition

app.use("/auth", require("./routes/auth-routes"));
app.use("/user", ensureAuth, require("./routes/users-routes"));
app.use("/update", ensureAuth, require("./routes/stravaupdate-routes"));
app.use("/activity", ensureAuth, require("./routes/activities-routes"));

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
