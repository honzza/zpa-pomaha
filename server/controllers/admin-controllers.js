const csv = require("csv-parser");
const fs = require("fs");
const Config = require("../models/app-config");

const getVersionHistory = async (req, res, next) => {
  const results = [];

  fs.createReadStream("version_history.csv")
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
    });
};

const getConfig = async (req, res, next) => {
  let config = await Config.find({ club_id: { $in: req.user.clubs } });
  res.json(config);
};

exports.getVersionHistory = getVersionHistory;
exports.getConfig = getConfig;
