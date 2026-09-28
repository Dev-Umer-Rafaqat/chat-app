const express = require("express");

const notificationController = require("../controllers/notification.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/", notificationController.getNotifications);

router.get("/count", notificationController.getNotificationCount);

router.delete(
  "/conversation/:conversationId",
  notificationController.deleteConversationNotifications,
);

module.exports = router;
