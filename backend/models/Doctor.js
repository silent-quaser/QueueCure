const mongoose = require("mongoose");

const doctorSchema =
  new mongoose.Schema(
    {
      doctorName: {
        type: String,
        required: true,
      },

      specialization: {
        type: String,
        required: true,
      },

      experience: {
        type: Number,
        required: true,
      },

      rating: {
        type: Number,
        default: 4.5,
      },

      availability: {
        type: String,
        enum: [
          "Available",
          "Busy",
          "Offline",
        ],
        default: "Available",
      },

      currentQueue: {
        type: Number,
        default: 0,
      },

      averageConsultationTime: {
        type: Number,
        default: 7,
      },

      hospital: {
        type: String,
        required: true,
      },

      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Doctor",
    doctorSchema
  );