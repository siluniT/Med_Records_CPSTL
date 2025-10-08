const patientModel = require("../Models/patientModel");

// Create new patient
const createPatient = (req, res) => {
  patientModel.addPatient(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({
      message: "Patient added successfully",
      patientId: result.insertId,
    });
  });
};

// Get all patients
const getAllPatients = (req, res) => {
  patientModel.getPatients((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get patient by ID
const getPatientById = (req, res) => {
  const id = req.params.id;
  patientModel.getPatientById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "Patient not found" });
    res.json(results[0]);
  });
};

// Delete patient
const deletePatient = (req, res) => {
  const id = req.params.id;
  patientModel.deletePatient(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      // No patient with this ID
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  });
};

// Count patients
const getPatientCount = (req, res) => {
  patientModel.getPatientCount((err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ count: results[0].count });
  });
};
module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  getPatientCount,
};
