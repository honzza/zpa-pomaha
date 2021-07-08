const router = require("express").Router();
const adminControllers = require("../controllers/admin-controllers");

router.get("/", adminControllers.getVersionHistory);
router.get("/config", adminControllers.getConfig);

module.exports = router;
