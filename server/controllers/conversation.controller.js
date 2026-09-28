const asyncHandler = require("../utils/asyncHandler");
const conversationService = require("../services/conversation.service");

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await conversationService.getUserConversations(
    req.user._id,
  );
  res.status(200).json({ success: true, data: conversations });
});

const getConversation = asyncHandler(async (req, res) => {
  const conversation = await conversationService.getConversationById(
    req.params.conversationId,
    req.user._id,
  );
  res.status(200).json({ success: true, data: conversation });
});

const createConversation = asyncHandler(async (req, res) => {
  const conversation = await conversationService.findOrCreateConversation(
    req.user._id,
    req.body.participantId,
  );
  res.status(200).json({ success: true, data: conversation });
});

const createGroup = asyncHandler(async (req, res) => {
  const { name, participantIds } = req.body;

  const conversation = await conversationService.createGroupConversation(
    req.user._id,
    name,
    participantIds,
  );

  res.status(201).json({ success: true, data: conversation });
});

module.exports = {
  getConversations,
  getConversation,
  createConversation,
  createGroup,
};
