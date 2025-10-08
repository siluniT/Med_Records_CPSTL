const db = require("../db");

// Convert empty string to NULL
const toNullable = (value, isNumber = false) => {
  if (value === "" || value === undefined || value === null) return null;
  return isNumber ? Number(value) : value;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return null;
  const dt = new Date(dateStr);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const min = String(dt.getMinutes()).padStart(2, "0");
  const ss = String(dt.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

// Add a new patient
const addPatient = (patientData, callback) => {
  const sql = `
    INSERT INTO patients 
    (registrationNo, name, epfNo, contactNo, gender, dateOfBirth, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    toNullable(patientData.registrationNo),
    toNullable(patientData.name),
    toNullable(patientData.epfNo),
    toNullable(patientData.contactNo),
    toNullable(patientData.gender),
    toNullable(patientData.dateOfBirth),
    toNullable(patientData.status || "active"),
  ];

  db.query(sql, values, callback);
};

// Get all patients
const getPatients = (callback) => {
  const sql = "SELECT * FROM patients ORDER BY id DESC";
  db.query(sql, callback);
};

// Get patient by ID
const getPatientById = (id, callback) => {
  const sql = "SELECT * FROM patients WHERE id = ?";
  db.query(sql, [id], callback);
};

//delete patient by id
const deletePatient = (id, callback) => {
  const sql = "DELETE FROM patients WHERE id = ?";
  db.query(sql, [id], callback);
};

// Count patients
const getPatientCount = (callback) => {
  const sql = "SELECT COUNT(*) as count FROM patients";
  db.query(sql, callback);
};

module.exports = {
  addPatient,
  getPatients,
  getPatientById,
  deletePatient,
  getPatientCount,
};
