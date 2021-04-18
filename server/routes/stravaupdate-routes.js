const router = require("express").Router();
const webhookControllers = require("../controllers/webhook-controllers");

router.post(
  "/webhook",
  webhookControllers.getWebhook,
  webhookControllers.processWebhooks
);
router.get("/webhook", webhookControllers.createSubscription);

module.exports = router;
