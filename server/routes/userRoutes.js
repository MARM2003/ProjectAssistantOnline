const express = require("express");
const router = express.Router();
const { getDevelopers } = require("../controllers/usercontroller");
const { authMiddleware, authorizeRoles } = require("../middlewares/auth");

router.get("/", authMiddleware, authorizeRoles("Admin", "ProjectManager"), getDevelopers);

module.exports = router;
