const  mongoose =require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "ProjectManager", "Developer", "Viewer"],
    default: "Viewer",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project", // references another user (e.g., client)
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports= User;
