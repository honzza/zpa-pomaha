const winston = require("winston");
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
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = new winston.createLogger({
  transports: [new winston.transports.MongoDB(options.mongo)],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;
