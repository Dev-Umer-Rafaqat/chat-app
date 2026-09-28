const asyncHandler = require("../utils/asyncHandler");
const messageService = require("../services/message.service");

const getMessages = asyncHandler(async (req, res) => {
  const messages = await messageService.getMessagesForConversation(
    req.params.conversationId,
    req.user._id,
  );
  res.status(200).json({ success: true, data: messages });
});

module.exports = { getMessages };
