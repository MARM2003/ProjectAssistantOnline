const express = require("express");
const {  getUserAllNotifications,markAsRead} = require("../controllers/notifications");
const { authMiddleware, authorizeRoles } = require("../middlewares/auth");
const router=express.Router();

// Routes
router.get("/", authMiddleware, getUserAllNotifications);
router.put("/:id/read", authMiddleware, markAsRead);

module.exports=router;