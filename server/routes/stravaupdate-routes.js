const router = require("express").Router();
const stravaupdateControllers = require("../controllers/stravaupdate-controllers");
const webhookControllers = require("../controllers/webhook-controllers");
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, stravaupdateControllers.updateAthletes);
router.post("/webhook", webhookControllers.getWebhook);

module.exports = router;
