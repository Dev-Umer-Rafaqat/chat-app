const fcmInstallationService = require("../services/fcmInstallation.service");

async function registerInstallation(req, res, next) {
  try {
    const { installationId } = req.body;

    if (!installationId) {
      return res.status(400).json({
        success: false,

        message: "Firebase Installation ID is required.",
      });
    }

    await fcmInstallationService.saveInstallation(
      req.user._id,

      installationId,
    );

    return res.status(201).json({
      success: true,

      message: "Firebase push installation registered successfully.",
    });
  } catch (error) {
    next(error);
  }
}

async function unregisterInstallation(req, res, next) {
  try {
    const { installationId } = req.body;

    if (!installationId) {
      return res.status(400).json({
        success: false,

        message: "Firebase Installation ID is required.",
      });
    }

    await fcmInstallationService.removeInstallation(
      req.user._id,

      installationId,
    );

    return res.json({
      success: true,

      message: "Firebase push installation removed successfully.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerInstallation,

  unregisterInstallation,
};
