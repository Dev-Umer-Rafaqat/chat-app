const FcmInstallation = require("../models/FcmInstallation");

async function saveInstallation(userId, installationId) {
  if (!installationId) {
    throw new Error("Firebase Installation ID is required.");
  }

  return FcmInstallation.findOneAndUpdate(
    {
      installationId,
    },

    {
      user: userId,

      installationId,
    },

    {
      new: true,

      upsert: true,

      setDefaultsOnInsert: true,
    },
  );
}

async function removeInstallation(userId, installationId) {
  return FcmInstallation.deleteOne({
    user: userId,

    installationId,
  });
}

async function getUserInstallations(userId) {
  return FcmInstallation.find({
    user: userId,
  });
}

async function removeInstallationById(installationId) {
  return FcmInstallation.deleteOne({
    installationId,
  });
}

module.exports = {
  saveInstallation,

  removeInstallation,

  getUserInstallations,

  removeInstallationById,
};
