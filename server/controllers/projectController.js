// controllers/projectController.js
const  Project =require("../models/project.js");
const  Task = require("../models/task.js");
const User= require("../models/user.js")
const mongoose =require("../dbconnection/connect.js")
  const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const project = new Project({ name, description, startDate, endDate });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("tasks");
    // Developer: show only tasks assigned to them
    if (req.user.role === "Developer") {
      projects.forEach(p => {
        p.tasks = p.tasks.filter(t => t.assignedTo?.toString() === req.user._id.toString());
      });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    // Optionally delete all tasks under this project
    // await Task.deleteMany({ project: req.params.id });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: "tasks",
        populate: { path: "assignedTo", select: "name email" }
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProgress = async(req,res)=>{
  
   try {
    const projects = await Project.find();

    const projectProgress = await Promise.all(
      projects.map(async (project) => {
        const taskIds = Array.isArray(project.tasks) ? project.tasks : [];

        // Convert taskIds to ObjectId
        const objectIds = taskIds.map((id) => new mongoose.Types.ObjectId(id));

        const tasks = await Task.find({ _id: { $in: objectIds } });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === "Completed").length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          _id: project._id,
          name: project.name,
          progress,
        };
      })
    );

    res.status(200).json(projectProgress);
    // console.log('project progress',projectProgress)
  } catch (error) {
    console.error("Error fetching project progress:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }


 
}


const getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "Viewer" }).select("name email _id");
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateProjectDetails = async (req, res) => {
  try {
    const { clientId, projectId, completionPercent } = req.body;

    // 1️⃣ Update user collection → set projectId for this client
    await User.findByIdAndUpdate(clientId, { projectId }, { new: true });

    // 2️⃣ Update project collection → set completionPercent
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { completionPercent },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project details updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project details:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🧩 Get client + project data for pre-filling fields
const getProjectAndClientData = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Find user linked to this project
    const client = await User.findOne({ projectId });

    res.status(200).json({
      project,
      client,
    });
  } catch (error) {
    console.error("Error fetching project/client data:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

const getClientProject = async (req, res) => {
  try {
    // 1️⃣ Get user from middleware
    const user = req.user;

    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.projectId) return res.status(404).json({ message: "No project assigned" });

    // 2️⃣ Fetch project from Project collection
    // const project = await Project.findById(user.projectId.toString());
    const project = await Project.findOne({ _id: user.projectId });

    if (!project) return res.status(404).json({ message: "Project not found" });

    // 3️⃣ Return project details
    res.status(200).json({
      project: {
        name: project.name,
        description: project.description,
        completionPercent: project.completionPercent,
      },
    });
  } catch (error) {
    console.error("Error fetching client project:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports= {createProject,getAllProjects,updateProject,deleteProject,getProjectById,getProgress,getClients,updateProjectDetails,getProjectAndClientData,getClientProject}

            