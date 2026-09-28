const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const AppError = require("../utils/AppError");

async function getUserConversations(userId) {
  return Conversation.find({ participants: userId })
    .populate("participants", "name email")
    .sort({ updatedAt: -1 });
}

async function getConversationById(conversationId, userId) {
  const conversation = await Conversation.findById(conversationId).populate(
    "participants",
    "name email",
  );

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  const isParticipant = conversation.participants.some((p) =>
    p._id.equals(userId),
  );
  if (!isParticipant) {
    throw new AppError("Not authorized to view this conversation", 403);
  }

  return conversation;
}

async function findOrCreateConversation(userId, otherUserId) {
  if (userId.toString() === otherUserId.toString()) {
    throw new AppError("Cannot start a conversation with yourself", 400);
  }

  // Sort so [A, B] and [B, A] always produce the same stored order —
  // this is what makes the unique index in the model actually work.
  const participants = [userId, otherUserId]
    .map((id) => new mongoose.Types.ObjectId(id))
    .sort((a, b) => a.toString().localeCompare(b.toString()));

  let conversation = await Conversation.findOne({ participants });

  if (!conversation) {
    conversation = await Conversation.create({ participants });
  }

  return Conversation.populate(conversation, {
    path: "participants",
    select: "name email",
  });
}

async function createGroupConversation(ownerId, name, participantIds = []) {
  const participants = [
    ...new Set([
      ownerId.toString(),
      ...participantIds.map((id) => id.toString()),
    ]),
  ];

  if (participants.length < 2) {
    throw new AppError("A group requires at least two members", 400);
  }

  return Conversation.create({
    name: name?.trim() || "New Group",
    participants,
    isGroup: true,
  });
}

module.exports = {
  getUserConversations,
  getConversationById,
  findOrCreateConversation,
  createGroupConversation,
};
