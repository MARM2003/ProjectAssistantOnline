


const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    completionPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, 
    },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
