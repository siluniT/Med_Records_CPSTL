const db = require("../db");

const Staff = {
  create: (staffData, callback) => {
    const sql = `INSERT INTO staff 
      (id, epfNumber, name, designation, experience, gender, profileImage, contactNo, primarySpecialization, secondarySpecialization, medicalLicenseNumber, licenseExpiryDate, qualifications, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      staffData.id,
      staffData.epfNumber,
      staffData.name,
      staffData.designation,
      staffData.experience === "" ? null : parseInt(staffData.experience, 10),
      staffData.gender || "Male",
      staffData.profileImage || null,
      staffData.contactNo,
      staffData.primarySpecialization || null,
      staffData.secondarySpecialization || null,
      staffData.medicalLicenseNumber || null,
      staffData.licenseExpiryDate || null,
      staffData.qualifications || null,
      staffData.status || "Active",
    ];

    db.query(sql, params, callback);
  },
  //get all staff
  getAll: (callback) => {
    db.query("SELECT * FROM staff", callback);
  },
  //get staff by id
  getById: (id, callback) => {
    db.query("SELECT * FROM staff WHERE id = ?", [id], callback);
  },
  //delete staff by id
  deleteById: (id, callback) => {
    db.query("DELETE FROM staff WHERE id = ?", [id], callback);
  },
  //update staff by id
  updateById: (id, staffData, callback) => {
    const sql = `UPDATE staff SET
    epfNumber = ?,
    name = ?,
    designation = ?,
    experience = ?,
    gender = ?,
    profileImage = ?,
    contactNo = ?,
    primarySpecialization = ?,
    secondarySpecialization = ?,
    medicalLicenseNumber = ?,
    licenseExpiryDate = ?,
    qualifications = ?,
    status = ?
    WHERE id = ?`;

    const params = [
      staffData.epfNumber,
      staffData.name,
      staffData.designation,
      staffData.experience === "" ? null : parseInt(staffData.experience, 10),
      staffData.gender || "Male",
      staffData.profileImage || null,
      staffData.contactNo,
      staffData.primarySpecialization || null,
      staffData.secondarySpecialization || null,
      staffData.medicalLicenseNumber || null,
      staffData.licenseExpiryDate || null,
      staffData.qualifications || null,
      staffData.status || "Active",
      id,
    ];

    db.query(sql, params, callback);
  },
  //get staff count
  getCount: (callback) => {
    const sql = "SELECT COUNT(*) AS count FROM staff";
    db.query(sql, callback);
  },
};

module.exports = Staff;
