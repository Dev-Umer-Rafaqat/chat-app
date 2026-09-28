const messageService = require("../services/message.service");
const conversationService = require("../services/conversation.service");
const connectionManager = require("./connection.manager");
const handleGroupEvent = require("./group.handler");

function send(ws, payload) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

async function handleMessage(ws, senderId, raw) {
  let parsed;

  try {
    parsed = JSON.parse(raw.toString("utf8"));
  } catch {
    return send(ws, {
      type: "error",
      data: {
        message: "Invalid JSON",
      },
    });
  }

  const { type, conversationId, data = {} } = parsed;

  /*
   * Admin-only group management (group:create | group:update | group:delete).
   * Authorization is enforced inside the handler from the database.
   */
  if (typeof type === "string" && type.startsWith("group:")) {
    return handleGroupEvent(ws, senderId, { type, conversationId, data });
  }

  /*
   * User opened a conversation.
   *
   * Tell the server:
   * "This is the conversation I am currently viewing."
   */
  if (type === "conversation:open") {
    if (!conversationId) {
      return send(ws, {
        type: "error",
        data: {
          message: "conversationId is required",
        },
      });
    }

    try {
      /*
       * This also verifies that the current user
       * actually belongs to this conversation.
       */
      await conversationService.getConversationById(conversationId, senderId);

      connectionManager.setActiveConversation(senderId, conversationId);

      return;
    } catch (err) {
      return send(ws, {
        type: "error",
        data: {
          message: err.message || "Unable to open conversation",
        },
      });
    }
  }

  /*
   * User closed the currently active conversation.
   */
  if (type === "conversation:close") {
    connectionManager.clearActiveConversation(senderId, conversationId);

    return;
  }

  /*
   * Only these events are allowed below.
   */
  if (type !== "message" && type !== "image") {
    return send(ws, {
      type: "error",
      data: {
        message: `Unknown event type: ${type}`,
      },
    });
  }

  const content = data?.content?.trim() || "";

  const imageUrl = type === "image" ? data.imageUrl : null;

  if (!conversationId || (!content && !imageUrl)) {
    return send(ws, {
      type: "error",
      data: {
        message: "conversationId and message data are required",
      },
    });
  }

  if (content.length > 2000) {
    return send(ws, {
      type: "error",
      data: {
        message: "Message too long",
      },
    });
  }

  try {
    const { message, participantIds, notifications } =
      await messageService.createMessage({
        conversationId,
        senderId,
        content,
        imageUrl,
      });

    /*
     * Send message to every participant.
     */
    const outgoingMessage = {
      type: "message",
      conversationId,
      data: message,
    };

    participantIds.forEach((participantId) => {
      send(connectionManager.getConnection(participantId), outgoingMessage);
    });

    /*
     * Send notifications only to users
     * for whom a notification was actually created.
     */
    notifications.forEach((notification) => {
      const recipientId = notification.recipient.toString();

      send(connectionManager.getConnection(recipientId), {
        type: "notification",

        data: {
          id: notification._id,

          conversationId: notification.conversation.toString(),

          messageId: notification.message.toString(),

          sender: message.sender,

          content: notification.content,

          createdAt: notification.createdAt,
        },
      });
    });
  } catch (err) {
    send(ws, {
      type: "error",
      data: {
        message: err.message || "Failed to send message",
      },
    });
  }
}

module.exports = handleMessage;
