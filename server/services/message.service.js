const Message = require("../models/Message");

const conversationService = require("./conversation.service");

const notificationService = require("./notification.service");

const pushService = require("./push.service");

const connectionManager = require("../websocket/connection.manager");

async function createMessage({
  conversationId,

  senderId,

  content = "",

  imageUrl = null,
}) {
  const conversation = await conversationService.getConversationById(
    conversationId,

    senderId,
  );

  const message = await Message.create({
    conversation: conversationId,

    sender: senderId,

    content,

    imageUrl,

    messageType: imageUrl ? "image" : "text",
  });

  await message.populate("sender", "name email");

  const participantIds = conversation.participants.map((participant) =>
    participant._id ? participant._id.toString() : participant.toString(),
  );

  const senderIdString = senderId.toString();

  /*
   * Everyone except sender.
   */
  const recipientIds = participantIds.filter(
    (participantId) => participantId !== senderIdString,
  );

  /*
   * Only users who are NOT currently
   * viewing this exact conversation
   * should receive notifications.
   */
  const notificationRecipientIds = recipientIds.filter(
    (recipientId) =>
      !connectionManager.isConversationActive(
        recipientId,

        conversationId,
      ),
  );

  const notificationContent =
    content || (imageUrl ? "Sent an image" : "New message");

  /*
   * Save persistent in-app notifications.
   */
  const notifications = await notificationService.createNotifications({
    recipientIds: notificationRecipientIds,

    conversationId,

    messageId: message._id,

    senderId,

    content: notificationContent,
  });

  /*
   * Send Firebase push notifications
   * to the same recipients.
   *
   * Push failure must not break the
   * message creation flow.
   */
  if (notificationRecipientIds.length > 0) {
    try {
      await pushService.sendPushNotifications(
        notificationRecipientIds,

        {
          type: "chat-message",

          title: message.sender?.name
            ? `${message.sender.name} sent you a message`
            : "New message",

          body: notificationContent,

          icon: "/notification-icon.png",

          badge: "/notification-icon.png",

          data: {
            conversationId: String(conversationId),

            messageId: String(message._id),

            senderId: String(senderId),

            senderName: message.sender?.name || "Unknown user",
          },
        },
      );
    } catch (error) {
      /*
       * Push notification failure should
       * never make the chat message fail.
       */
      console.error("Firebase push notification failed:", error);
    }
  }

  return {
    message,

    participantIds,

    notifications,
  };
}

async function getMessagesForConversation(conversationId, userId) {
  await conversationService.getConversationById(
    conversationId,

    userId,
  );

  return Message.find({
    conversation: conversationId,
  })
    .populate("sender", "name email")
    .sort({
      createdAt: 1,
    });
}

module.exports = {
  createMessage,

  getMessagesForConversation,
};
