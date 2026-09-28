const mongoose = require("mongoose");

const fcmInstallationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    installationId: {
      type: String,

      required: true,

      unique: true,

      index: true,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("FcmInstallation", fcmInstallationSchema);
