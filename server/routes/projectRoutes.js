

const express = require("express");
const { createProject, getAllProjects, updateProject, deleteProject ,getProjectById,getProgress,getClients,updateProjectDetails, getProjectAndClientData,getClientProject} = require("../controllers/projectController");
const { authMiddleware, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("Admin", "ProjectManager"), createProject);
router.get("/", authMiddleware, getAllProjects);
router.get("/progress",authMiddleware, authorizeRoles("Admin") ,getProgress)
router.get("/getClients", authMiddleware, authorizeRoles("Admin", "ProjectManager"), getClients);

router.put("/updateDetails",authMiddleware, authorizeRoles("Admin", "ProjectManager"),updateProjectDetails);

router.get("/getProjectAndClientData/:projectId",authMiddleware, authorizeRoles("Admin", "ProjectManager"), getProjectAndClientData);
router.get("/clientProject",authMiddleware, getClientProject);

router.get("/:id", authMiddleware, getProjectById);
router.put("/:id", authMiddleware, authorizeRoles("Admin", "ProjectManager"), updateProject);
router.delete("/:id", authMiddleware, authorizeRoles("Admin", "ProjectManager"), deleteProject);


module.exports = router;
