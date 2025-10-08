

const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  dueDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
