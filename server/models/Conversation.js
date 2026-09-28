const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: {
        validator: (arr) => arr.length >= 2,
        message: "A conversation must have at least 2 participants",
      },
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

conversationSchema.index(
  { "participants.0": 1, "participants.1": 1 },
  {
    unique: true,
    partialFilterExpression: { isGroup: false },
    name: "unique_direct_conversation",
  },
);

module.exports = mongoose.model("Conversation", conversationSchema);
