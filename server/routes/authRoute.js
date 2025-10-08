

const express = require("express");
const { registerUser, loginUser, refreshAccessToken } = require("../controllers/authcontrol");

const router = express.Router();

// POST /api/register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

module.exports = router;
