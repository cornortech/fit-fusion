const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Admin = require("../models/admin");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });

    let data = null;

    if (!user && !admin) {
      return res
        .status(400)
        .json({ message: "This email is not registered in fitFusion" });
    }

    data = user?._doc ?? admin?._doc;


    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials. Try again." });
    }

    res.status(200).json({ ...data, isAdmin: admin ? true : false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.Try again later." });
  }
});
router.post("/register", async (req, res) => {
  const { username, email, password, contact } = req.body;
  console.log("password: ", req.body);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      contact,
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

module.exports = router;
