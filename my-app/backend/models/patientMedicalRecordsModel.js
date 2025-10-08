const db = require("../db");

// Convert empty string to NULL
const toNullable = (value, isNumber = false) => {
  if (value === "" || value === undefined || value === null) return null;
  return isNumber ? Number(value) : value;
};

// Format JS date to MySQL DATETIME
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

// Add medical record
const addMedicalRecord = (patientId, data, callback) => {
  const sql = `
    INSERT INTO patientmedicalrecords
    (patient_id, age, height, weight, bmi, waist, rbs, fbs, bp, visionLeft, visionRight,
     breastExamination, papSmear, alcoholConsumption, smokingHabits, treatmentPlan,
     smokingCessationAdvice, alcoholAbuseAdvice, patientHistory,
     familyHistoryFather, familyHistoryMother, familyHistorySiblings,otherPatientConditions, otherFatherConditions, otherMotherConditions, otherSiblingsConditions,
   currentProblems, visitDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    patientId,
    toNullable(data.age, true),
    toNullable(data.height, true),
    toNullable(data.weight, true),
    toNullable(data.bmi, true),
    toNullable(data.waist, true),
    toNullable(data.rbs, true),
    toNullable(data.fbs, true),
    toNullable(data.bp),
    toNullable(data.visionLeft),
    toNullable(data.visionRight),
    toNullable(data.breastExamination),
    toNullable(data.papSmear),
    toNullable(data.alcoholConsumption),
    toNullable(data.smokingHabits),
    toNullable(data.treatmentPlan),
    toNullable(data.smokingCessationAdvice),
    toNullable(data.alcoholAbuseAdvice),

    // Convert patientHistory, familyHistoryFather, familyHistoryMother, familyHistorySiblings to JSON
    data.patientHistory ? JSON.stringify(data.patientHistory) : null,
    data.familyHistoryFather ? JSON.stringify(data.familyHistoryFather) : null,
    data.familyHistoryMother ? JSON.stringify(data.familyHistoryMother) : null,
    data.familyHistorySiblings
      ? JSON.stringify(data.familyHistorySiblings)
      : null,

    toNullable(data.otherPatientConditions),
    toNullable(data.otherFatherConditions),
    toNullable(data.otherMotherConditions),
    toNullable(data.otherSiblingsConditions),
    toNullable(data.currentProblems),

    formatDateTime(data.visitDate || new Date()),
  ];

  db.query(sql, values, callback);
};

//get all medical records by patient id
const getMedicalRecordsByPatientId = (patientId, callback) => {
  const sql = `
    SELECT * FROM patientmedicalrecords
    WHERE patient_id = ?
    ORDER BY visitDate DESC
  `;
  db.query(sql, [patientId], callback);
};

//get all medical records
const getMedicalRecords = (callback) => {
  const sql = "SELECT * FROM patientmedicalrecords";
  db.query(sql, callback);
};

// Fetch latest medical record for a patient
const getLatestMedicalRecordByPatientId = (patientId, callback) => {
  const sql = `
     SELECT * 
    FROM patientmedicalrecords 
    WHERE patient_id = ? 
    ORDER BY visitDate DESC 
    LIMIT 1
  `;
  db.query(sql, [patientId], callback);
};

//get today patient count
const getTodayPatientCount = (callback) => {
  const sql = `
    SELECT COUNT(DISTINCT patient_id) AS count
    FROM patientmedicalrecords
    WHERE DATE(visitDate) = CURDATE()
  `;
  db.query(sql, callback);
};
// Monthly patient visit count (last 12 months)
const getMonthlyPatientStats = (callback) => {
  const sql = `
    SELECT 
      DATE_FORMAT(visitDate, '%b %Y') AS month, 
      COUNT(DISTINCT patient_id) AS count
    FROM patientmedicalrecords
    WHERE visitDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY month
    ORDER BY MIN(visitDate) ASC
  `;
  db.query(sql, callback);
};

// Yearly patient visit count (last 5 years)
const getYearlyPatientStats = (callback) => {
  const sql = `
    SELECT 
      YEAR(visitDate) AS year,
      COUNT(DISTINCT patient_id) AS count
    FROM patientmedicalrecords
    WHERE visitDate >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)
    GROUP BY year
    ORDER BY year ASC
  `;
  db.query(sql, callback);
};

module.exports = {
  addMedicalRecord,
  getMedicalRecords,
  getMedicalRecordsByPatientId,
  getLatestMedicalRecordByPatientId,
  getTodayPatientCount,
  getMonthlyPatientStats,
  getYearlyPatientStats,
};
