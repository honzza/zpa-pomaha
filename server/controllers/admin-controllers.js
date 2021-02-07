const csv = require("csv-parser");
const fs = require("fs");

const getVersionHistory = async (req, res, next) => {
  const results = [];

  fs.createReadStream("version_history.csv")
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => results.push(data))
    .on("end", () => {
      res.json(results);
    });
};

exports.getVersionHistory = getVersionHistory;
