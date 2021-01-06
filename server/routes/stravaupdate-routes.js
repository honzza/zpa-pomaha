const { Router } = require("express");
const router = Router();
const stravaupdateControllers = require("../controllers/stravaupdate-controllers");

router.get("/", stravaupdateControllers.getAthleteStats);

module.exports = router;
