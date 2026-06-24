const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
  type: Number,
  default: null,
},

gender: {
  type: String,
  default: "",
},

phoneNumber: {
  type: String,
  default: "",
},

    doctorName: {
      type: String,
      required: true,
      default: "Dr. Kumar",
    },

    specialization: {
  type: String,
  default: "",
},

hospital: {
  type: String,
  default: "",
},

symptoms: {
  type: String,
  default: "",
},

    priority: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "serving",
        "completed",
      ],
      default: "waiting",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    servedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    consultationDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Patient",
  patientSchema
);