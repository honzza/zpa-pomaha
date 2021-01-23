const router = require("express").Router();
const activitiesControllers = require("../controllers/activities-controllers");

router.get("/:activityType", activitiesControllers.getActivityByType);

module.exports = router;
