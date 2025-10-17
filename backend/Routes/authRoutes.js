const express = require("express");
const router = express.Router();
const { login, register } = require("../Controllers/authController");

// user loging routes
router.post("/login", login);

//user register route
router.post("/register", register);

module.exports = router;
