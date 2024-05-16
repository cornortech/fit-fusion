const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    time: {type:Number, required: true},
    price: { type: Number, required: true },
    services: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);
