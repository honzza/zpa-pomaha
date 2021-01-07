const { Router } = require("express");
const router = Router();
const stravaupdateControllers = require("../controllers/stravaupdate-controllers");

router.get("/", stravaupdateControllers.updateAthletes);

module.exports = router;
