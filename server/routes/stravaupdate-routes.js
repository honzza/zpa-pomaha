const router = require("express").Router();
const stravaupdateControllers = require("../controllers/stravaupdate-controllers");
const webhookControllers = require("../controllers/webhook-controllers");
const { ensureAuth } = require("../middleware/auth");

router.get(
  "/",
  ensureAuth,
  webhookControllers.processWebhooks,
  stravaupdateControllers.updateAthletes
);
router.post("/webhook", webhookControllers.getWebhook);
router.get("/webhook", webhookControllers.createSubscription);

module.exports = router;
