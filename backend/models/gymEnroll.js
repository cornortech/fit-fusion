const mongoose = require("mongoose");

const gymEnrollSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    status: { type: "String", default: "REQUESTED" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GymEnroll", gymEnrollSchema);
