const HttpError = require("../models/http-error");
const User = require("../models/user");
const activityTypes = ["ride", "run", "swim"];

const getActivityByType = async (req, res, next) => {
  const activityParam = req.params.activityType;
  if (!activityTypes.includes(activityParam)) {
    return next(new HttpError("Activity does not exist", 404));
  }
  let activities;
  try {
    const nestedKey = `activity.${activityParam}`;
    const query = { [nestedKey]: { $gt: 0 } };
    activities = await User.find(query);
  } catch (err) {
    return next(
      new HttpError(
        "Fetching activity data failed, please try again later",
        500
      )
    );
  }
  if (activities.length === 0) {
    return next(new HttpError("Could not find anyone with this activity", 404));
  }
  const result = activities.map((a) => {
    return {
      firstname: a.firstname,
      lastname: a.lastname,
      [activityParam]: a.activity[activityParam],
    };
  });
  res.json(result);
};

exports.getActivityByType = getActivityByType;
