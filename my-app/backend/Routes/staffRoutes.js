// backend/routes/staffRoutes.js
const express = require("express");
const router = express.Router();
const staffController = require("../Controllers/staffController");

// Add new staff
router.post("/add", staffController.addStaff);

// Get all staff
router.get("/", staffController.getAllStaff);

// Get staff count
router.get("/count", staffController.getStaffCount);

// Get staff by id
router.get("/:id", staffController.getStaffById);

// Delete staff
router.delete("/:id", staffController.deleteStaffById);

// Update staff
router.put("/update/:id", staffController.updateStaffById);

module.exports = router;
