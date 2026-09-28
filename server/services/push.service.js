const { firebaseMessaging } = require("../config/firebase");

const fcmInstallationService = require("./fcmInstallation.service");

function createPushMessage(installationId, payload) {
  return {
    token: installationId,

    data: {
      type: String(payload.type || "chat-message"),

      title: String(payload.title || "New message"),

      body: String(payload.body || "You have a new message."),

      icon: String(payload.icon || "/notification-icon.png"),

      badge: String(payload.badge || "/notification-icon.png"),

      conversationId: String(payload.data?.conversationId || ""),

      messageId: String(payload.data?.messageId || ""),

      senderId: String(payload.data?.senderId || ""),

      senderName: String(payload.data?.senderName || "Unknown user"),
    },

    webpush: {
      headers: {
        Urgency: "high",
      },
    },
  };
}

async function sendPushNotification(userId, payload) {
  const installations =
    await fcmInstallationService.getUserInstallations(userId);

  if (installations.length === 0) {
    return {
      successCount: 0,
      failureCount: 0,
    };
  }

  const messages = installations.map((installation) =>
    createPushMessage(installation.installationId, payload),
  );

  /*
   * Firebase Admin supports batches of up to
   * 500 messages per sendEach() call.
   */
  const results = [];

  for (let start = 0; start < messages.length; start += 500) {
    const batch = messages.slice(start, start + 500);

    const batchResponse = await firebaseMessaging.sendEach(batch);

    results.push(batchResponse);

    /*
     * Remove FIDs that Firebase says are no
     * longer registered.
     */
    const failedIndexes = batchResponse.responses
      .map((response, index) => ({
        response,
        index,
      }))
      .filter(
        ({ response }) =>
          !response.success &&
          [
            "messaging/installation-id-not-registered",
            "messaging/registration-token-not-registered",
          ].includes(response.error?.code),
      )
      .map(({ index }) => index);

    await Promise.all(
      failedIndexes.map((index) =>
        fcmInstallationService.removeInstallationById(batch[index].token),
      ),
    );
  }

  return results;
}

async function sendPushNotifications(userIds, payload) {
  if (!userIds?.length) {
    return;
  }

  /*
   * Push failures should not break the
   * chat message itself.
   */
  const results = await Promise.allSettled(
    userIds.map((userId) => sendPushNotification(userId, payload)),
  );

  return results;
}

module.exports = {
  sendPushNotification,

  sendPushNotifications,
};
