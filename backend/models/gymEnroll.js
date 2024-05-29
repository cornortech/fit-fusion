const mongoose = require("mongoose");

const gymEnrollSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    order_intent_secret: { type: String },
    status: { type: "String", default: "REQUESTED" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GymEnroll", gymEnrollSchema);
