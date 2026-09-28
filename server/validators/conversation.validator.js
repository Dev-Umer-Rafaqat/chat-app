const Joi = require("joi");

const createConversationSchema = Joi.object({
  participantId: Joi.string().hex().length(24).required(),
});

module.exports = { createConversationSchema };
