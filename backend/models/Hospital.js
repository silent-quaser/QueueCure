const mongoose = require("mongoose");

const hospitalSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Hospital",
    hospitalSchema
  );