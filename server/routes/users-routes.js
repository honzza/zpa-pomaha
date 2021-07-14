const router = require("express").Router();
const usersControllers = require("../controllers/users-controllers");
const util1 = require("../utils/delete-activities");
const util2 = require("../utils/upload-activities");

router.get("/", usersControllers.getUsers);
router.get("/activities/delete/:uid", util1.deleteActivities);
router.get("/activities/upload/:uid", util2.uploadActivities);

module.exports = router;
