const express = require("express");
const Notification = require("../models/notifications.js");
const router = express.Router();

// Fetch user notifications


// Controller: Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { readStatus: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserAllNotifications = async (req, res) => {


  try {
    let notifications;
    if (req.user.role === "Admin" || req.user.role === "ProjectManager") {
      // Fetch all notifications
      notifications = await Notification.find().sort({ timestamp: -1 }).populate("userId", "name email role");
    } else {
      // Fetch only user's notifications
      notifications = await Notification.find({ userId: req.user._id }).sort({ timestamp: -1 });
    }

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }



};

 






module.exports = {markAsRead,getUserAllNotifications};
