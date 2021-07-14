const Activity = require("../models/activity");
const util = require("./update-athlete");

const deleteActivities = async (req, res, next) => {
  let result;
  try {
    result = await Activity.deleteMany({ athlete_id: req.params.uid });
  } catch (err) {
    console.error(err);
  }
  await util.updateAthlete(req.params.uid);
  res.json(result);
};

exports.deleteActivities = deleteActivities;
