const express = require("express");
const { createTask, getProjectTasks, updateTask, deleteTask ,getTaskById,getMyTasks,updateTaskStatus,getTaskSummary,getCriticalTasks ,getPerformanceMetrics } = require("../controllers/taskController");
const { authMiddleware, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.get("/getTasks",authMiddleware, getMyTasks)


router.post("/:projectId/tasks", authMiddleware, authorizeRoles("Admin", "ProjectManager"), createTask);

// Get all tasks of a project
router.get("/:projectId/tasks", authMiddleware, getProjectTasks);

// Get a single task by ID
router.get("/task/:taskId", authMiddleware, getTaskById);

router.put("/:taskId", authMiddleware, updateTask);


router.put("/:taskId/status", authMiddleware, updateTaskStatus);


router.delete("/:taskId", authMiddleware, authorizeRoles("Admin", "ProjectManager"), deleteTask);

router.get("/summary", authMiddleware, getTaskSummary);

router.get("/critical", authMiddleware, authorizeRoles("Admin"), getCriticalTasks);
router.get("/performance", authMiddleware, authorizeRoles("Admin"), getPerformanceMetrics);


module.exports = router;
