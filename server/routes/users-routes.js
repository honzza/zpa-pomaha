const router = require("express").Router();
const usersControllers = require("../controllers/users-controllers");
const utils = require("../utils/utils");

router.get("/", usersControllers.getUsers);
router.get("/activities/delete/:uid", utils.deleteActivities);
router.get("/activities/upload/:uid", utils.uploadActivities);

module.exports = router;
