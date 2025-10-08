const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  readStatus: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ["task-assignment", "deadline", "status-update","task-update"], required: true }
});

module.exports = mongoose.model("Notification", notificationSchema);
