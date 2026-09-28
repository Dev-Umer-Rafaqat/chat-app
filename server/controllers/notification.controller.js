const notificationService = require("../services/notification.service");

async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.getNotifications(
      req.user._id,
    );

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}

async function getNotificationCount(req, res, next) {
  try {
    const count = await notificationService.getNotificationCount(req.user._id);

    res.json({
      success: true,
      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteConversationNotifications(req, res, next) {
  try {
    const { conversationId } = req.params;

    await notificationService.deleteConversationNotifications(
      req.user._id,
      conversationId,
    );

    res.json({
      success: true,
      message: "Conversation notifications removed successfully.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  getNotificationCount,
  deleteConversationNotifications,
};
