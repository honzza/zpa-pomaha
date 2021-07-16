const router = require("express").Router();
const activitiesControllers = require("../controllers/activities-controllers");

router.get("/:activityType/:clubId", activitiesControllers.getActivityByType);

module.exports = router;
