// backend/routes/staffRoutes.js
const express = require("express");
const router = express.Router();
const {
    addStaff,
    getAllStaff,
    getStaffById,
    deleteStaffById,
    updateStaffById,
    getStaffCount,
  } = require("../Controllers/staffController");


// Add new staff
router.post("/add",addStaff);

// Get all staff
router.get("/", getAllStaff);

// Get staff count
router.get("/count", getStaffCount);

// Get staff by id
router.get("/:id", getStaffById);

// Delete staff
router.delete("/:id", deleteStaffById);

// Update staff
router.put("/update/:id", updateStaffById);

module.exports = router;
