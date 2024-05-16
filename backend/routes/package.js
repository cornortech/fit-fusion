// routes/package.js
const express = require("express");
const router = express.Router();
const Package = require("../models/package");

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  // Implement your logic to verify if the user is an admin
  // This might involve checking a user role in the request
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Access denied. Admins only.");
  }
}

// POST route to create a gym package
router.post("/", async (req, res) => {
  try {
    const { name, price, time, services } = req.body;
    const newPackage = new Package({
      name,
      price,
      time,
      services,
    });
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const packages = await Package.find({});
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/:packageId", async (req, res) => {
  try {
    const packageExist = await Package.findById(req.params.packageId);
    if (!packageExist) {
      return res.status(404).json({ message: "Package not found" });
    }
    await Package.findByIdAndDelete(req.params.packageId);
    res.status(200).json("successfully deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
