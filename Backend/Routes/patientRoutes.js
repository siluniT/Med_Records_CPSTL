const express = require("express");
const router = express.Router();
const {
  createPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  getPatientCount,
} = require("../Controllers/patientController");

// Add new patient
router.post("/add", createPatient);

// Get all patients
router.get("/", getAllPatients);

// Get patient count
router.get("/count", getPatientCount);

// Get patient by id
router.get("/:id", getPatientById);

// Delete patient
router.delete("/delete/:id", deletePatient);

module.exports = router;
