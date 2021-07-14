const axios = require("axios");
const User = require("../models/user");
const util1 = require("./get-activities");
const util2 = require("./update-athlete");

const uploadActivities = async (req, res, next) => {
  let user = await User.findOne({ uid: req.params.uid });
  // Refresh token
  if (new Date() > user.expirationATC) {
    try {
      const tokens = await axios.post(
        `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${user.refreshTC}`
      );
      user.shortlivedATC = tokens.data.access_token;
      user.refreshTC = tokens.data.refresh_token;
      user.expirationATC = tokens.data.expires_at * 1000;
      user.save();
    } catch (err) {}
  }
  await util1.getActivities(user.shortlivedATC);
  await util2.updateAthlete(req.params.uid);
  res.json("Aktivity byly staženy ze Stravy, je nutné načíst stránku znovu");
};

exports.uploadActivities = uploadActivities;
