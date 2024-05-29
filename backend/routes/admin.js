const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const router = express.Router();

router.post("/create", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new Admin({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json(newUser._doc);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
});
router.get("/", async (req, res) => {
  try {
    const adminList = await Admin.find({
      isSuperAdmin: false,
    });
    res.status(200).json(adminList);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch admin list . Please try again." });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const adminExist = await Admin.findById(req.params.id);
    if (!adminExist) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json("Admin deleted successfully");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch admin list . Please try again." });
  }
});

module.exports = router;