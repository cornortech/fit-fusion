// routes/package.js
const express = require("express");
const router = express.Router();
const Package = require("../models/package");
const User = require("../models/user");
const stripe = require("../config/stripe");
const { default: mongoose } = require("mongoose");

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { user, package_id } = req.body;


    // Ensure package_id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(package_id)) {
      console.log("Invalid package_id format");
      throw new Error("Invalid package ID format");
    }

    const packageExist = await Package.findById(package_id);
    const userExist = await User.findById(user._id);

    if (!packageExist) {
      console.log("Package not found");
      throw new Error("Package not found");
    }

    if (!userExist) {
      console.log("User not found");
      throw new Error("User not found");
    }

    const totalAmount = packageExist.price;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to cents
      currency: "usd",
      metadata: {
        userId: user._id,
        userEmail: user.email,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res
      .status(200)
      .json({ message: paymentIntent.client_secret, success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;