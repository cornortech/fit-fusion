const express = require("express");
const GymEnroll = require("../models/gymEnroll");
const User = require("../models/user");
const router = express.Router();

router.post("/enroll", async (req, res) => {
  const { userId, package, order_intent_secret } = req.body;
  try {
    const newEnroll = new GymEnroll({
      userId,
      package,
      status:"APPROVED",
      order_intent_secret,
    });
    await newEnroll.save();
    res
      .status(201)
      .json({ message: "Enrollment request submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/enroll/status/:order_intent_secret", async (req, res) => {
  try {
    const { order_intent_secret } = req.params;
    const enroll = await GymEnroll.findOne({ order_intent_secret });
    if (enroll) {
      res.status(200).json({ message: true });
    } else {
      res.status(200).json({ message: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await GymEnroll.find()
      .populate("userId", "username email contact")
      .populate("package", "name")
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/user/status/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const enrollments = await GymEnroll.findOne({
      userId,
      status: {
        $ne: "CANCELLED",
      },
    }).populate("package", "name");
    if (!enrollments) {
      throw new Error("User has not enrolled any package");
    }
    return res.json({
      status: enrollments.status,
      package: enrollments.package.name,
      enrollId: enrollments._id,
    });
  } catch (error) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
});
router.post("/cancel", async (req, res) => {
  const { enrollId } = req.body;
  try {
    const enrollments = await GymEnroll.findById(enrollId).populate(
      "package",
      "name"
    );
    if (!enrollments) {
      throw new Error("You have not enrolled in any package yet!");
    }
    console.log(enrollments);
    await GymEnroll.findByIdAndUpdate(enrollId, {
      $set: {
        status: "CANCELLED",
      },
    });

    return res.status(200).json("Package has been cancelled successfully");
  } catch (error) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
});

module.exports = router;
