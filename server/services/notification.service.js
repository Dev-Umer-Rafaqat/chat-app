const Notification = require("../models/Notification");

async function createNotifications({
  recipientIds,
  conversationId,
  messageId,
  senderId,
  content,
}) {
  const notifications = recipientIds.map((recipientId) => ({
    recipient: recipientId,
    conversation: conversationId,
    message: messageId,
    sender: senderId,
    content,
  }));

  if (notifications.length === 0) {
    return [];
  }

  return Notification.insertMany(notifications);
}

async function getNotifications(userId) {
  return Notification.find({
    recipient: userId,
    read: false,
  })
    .populate("sender", "name email")
    .populate("conversation", "name isGroup")
    .populate("message", "content imageUrl createdAt")
    .sort({ createdAt: -1 });
}

async function getNotificationCount(userId) {
  return Notification.countDocuments({
    recipient: userId,
    read: false,
  });
}

async function deleteConversationNotifications(userId, conversationId) {
  return Notification.deleteMany({
    recipient: userId,
    conversation: conversationId,
  });
}

module.exports = {
  createNotifications,
  getNotifications,
  getNotificationCount,
  deleteConversationNotifications,
};
