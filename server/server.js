const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

const morgan = require("morgan");
const flash = require("connect-flash");

const { ensureAuth, ensureGuest } = require("./middleware/auth");
const HttpError = require("./models/http-error");

// Config
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
require("./config/passport")(passport);

// Set response headers
app.use(
  cors({
    origin: process.env.CLIENT_PATH,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Sessions
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(
  cookieSession({
    name: "session",
    secret: process.env.COOKIE_KEY,
    maxAge: 86400000,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(flash());

// Routes definition
app.use("/auth", require("./routes/auth-routes"));
app.use("/api/user", ensureAuth, require("./routes/users-routes"));
app.use("/api/update", ensureAuth, require("./routes/stravaupdate-routes"));
app.use("/api/activity", ensureAuth, require("./routes/activities-routes"));

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
