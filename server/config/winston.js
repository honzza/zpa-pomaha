const { createLogger, transports, format } = require("winston");
const { combine, metadata } = format;
require("winston-mongodb");

// define the custom settings for each transport (file, console, mongodb)
const options = {
  mongo: {
    db: process.env.MONGODB_URI,
    handleExceptions: true,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    capped: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
const userLogger = createLogger({
  format: combine(
    metadata({ fillExcept: ["message", "timestamp", "level", "label"] })
  ),
  transports: [
    new transports.MongoDB({
      ...options.mongo,
      collection: "loguseraccess",
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

const webhookLogger = createLogger({
  format: combine(
    metadata({ fillExcept: ["message", "timestamp", "level", "label"] })
  ),
  transports: [
    new transports.MongoDB({
      ...options.mongo,
      collection: "logwebhook",
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = { userLogger, webhookLogger };
