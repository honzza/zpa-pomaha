const router = require("express").Router();
const usersControllers = require("../controllers/users-controllers");
const {
  deleteActivities,
  uploadActivities,
} = require("../utils/activities-utils");

router.get("/:clubId", usersControllers.getUsers);
router.get("/activities/delete/:uid", deleteActivities);
router.get("/activities/upload/:uid", uploadActivities);

module.exports = router;
