const express = require("express");
const conversationController = require("../controllers/conversation.controller");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createConversationSchema,
} = require("../validators/conversation.validator");

const router = express.Router();

router.use(protect);

router.get("/", conversationController.getConversations);
router.post(
  "/",
  validate(createConversationSchema),
  conversationController.createConversation,
);
router.post("/group", conversationController.createGroup);
router.get("/:conversationId", conversationController.getConversation);

module.exports = router;
