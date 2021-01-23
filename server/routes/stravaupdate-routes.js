const router = require("express").Router();
const stravaupdateControllers = require("../controllers/stravaupdate-controllers");

router.get("/", stravaupdateControllers.updateAthletes);

module.exports = router;
