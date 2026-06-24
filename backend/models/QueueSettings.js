const mongoose = require("mongoose");

const queueSettingsSchema = new mongoose.Schema(
  {
    averageConsultationTime: {
      type: Number,
      default: 10,
    },

    currentToken: {
      type: Number,
      default: 0,
    },

    lastTokenIssued: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "QueueSettings",
  queueSettingsSchema
);