const router = require("express").Router();
const adminControllers = require("../controllers/admin-controllers");

router.get("/", adminControllers.getVersionHistory);

module.exports = router;
