// controllers/taskController.js
const Task =require("../models/task.js");
const Project = require("../models/project.js");
const Notification = require("../models/notifications.js");
const { io, onlineUsers } = require("../notification/socket.js"); // Import io & onlineUsers
// Create Task and assign to project
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const taskData = req.body;

    // 1️⃣ Create new task
    const newTask = await Task.create(taskData);

    // 2️⃣ Push task _id into Project.tasks[]
    await Project.findByIdAndUpdate(
      projectId,
      { $push: { tasks: newTask._id } },
      { new: true }
    );

    //sending notification
    // 3️⃣ Send notification to assigned user
    if (newTask.assignedTo) {
      const message = `🆕 You have been assigned a new task: "${newTask.title}"`;
      const notification = await Notification.create({
        message,
        userId: newTask.assignedTo,
        type: "task-assignment",
      });

      const receiverSocketId = onlineUsers[newTask.assignedTo];
      if (receiverSocketId) {
        io().to(receiverSocketId).emit("receiveNotification", notification);
      }
    }

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Error creating task" });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });

    //sending notifications
     // Send notification to assigned user
    if (updatedTask.assignedTo) {
      const message = `✏️ Task "${updatedTask.title}" has been updated`;
      const notification = await Notification.create({
        message,
        userId: updatedTask.assignedTo,
        type: "task-update",
      });

      const receiverSocketId = onlineUsers[updatedTask.assignedTo];
      if (receiverSocketId) {
        io().to(receiverSocketId).emit("receiveNotification", notification);
      }
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Error updating task" });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1️⃣ Delete from Task collection
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    // 2️⃣ Remove task reference from Project.tasks[]
    await Project.updateMany(
      { tasks: taskId },
      { $pull: { tasks: taskId } }
    );


    //sending notifications

    // Send notification to assigned user
    if (deletedTask.assignedTo) {
      const message = `🗑 Task "${deletedTask.title}" has been deleted`;
      const notification = await Notification.create({
        message,
        userId: deletedTask.assignedTo,
        type: "task-delete",
      });

      const receiverSocketId = onlineUsers[deletedTask.assignedTo];
      if (receiverSocketId) {
        io().to(receiverSocketId).emit("receiveNotification", notification);
      }
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Error deleting task" });
  }
};

// Get all tasks of a project
 const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Populate tasks from the project
    const project = await Project.findById(projectId).populate("tasks");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project.tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Get single task by ID
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("assignedTo", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Error fetching task" });
  }
};




const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ assignedTo: userId });

    const tasksWithProjects = await Promise.all(
      tasks.map(async (task) => {
        const project = await Project.findOne({ tasks: task._id }, { name: 1, description: 1 });
        return { ...task.toObject(), project: project || null };
      })
    );

    res.json(tasksWithProjects);
  } catch (err) {
    await Log.create({ type: "error", message: err.message, userId: req.user._id });
    res.status(500).json({ error: err.message });
  }
};


// const updateTaskStatus = async (req, res) => {
//   try {
    
//     const { taskId } = req.params;
// const { status } = req.body;
//     const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

//     if (!task) return res.status(404).json({ error: "Task not found" });


//     //sending notifications
    
//     // if (task.assignedTo) {
//     //   const message = `🔄 Task "${task.title}" status updated to "${status}"`;
//     //   const notification = await Notification.create({
//     //     message,
//     //     userId: task.assignedTo,
//     //     type: "status-update",
//     //   });

//     //   const receiverSocketId = onlineUsers[task.assignedTo];
//     //   if (receiverSocketId) {
//     //     io().to(receiverSocketId).emit("receiveNotification", notification);
//     //   }
//     // }
//     // Send notification to assigned user
//     if (task.assignedTo) {
//       const message = `🔄 Task "${task.title}" status updated to "${status}"`;

//       const notification = await Notification.create({
//         message,
//         userId: task.assignedTo,
//         type: "status-update",
//         readStatus: false,
//         timestamp: new Date(),
//       });

//       const receiverSocketId = onlineUsers[task.assignedTo];
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("receiveNotification", notification);
//       }
//     }


//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    console.log("arrived for task status update",taskId,status)
    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Send notification
    if (task.assignedTo) {
      const message = `🔄 Task "${task.title}" status updated to "${status}"`;
      const notification = await Notification.create({
        message,
        userId: task.assignedTo,
        readStatus: false,
        timestamp: new Date(),
        type: "status-update",  
      });

      const receiverSocketId = onlineUsers[task.assignedTo];
      if (receiverSocketId) {
        io().to(receiverSocketId).emit("receiveNotification", notification);

        // io().to(receiverSocketId).emit("receiveNotification", notification);
      }
    }

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
};


// const getLogs = async (req, res) => {
//   try {
//     let logs;
//     if (req.user.role === "admin") {
//       logs = await Log.find().populate("userId", "name email");
//     } else {
//       logs = await Log.find({ userId: req.user._id });
//     }
//     res.json(logs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// GET /api/tasks/summary
const getTaskSummary = async (req, res) => {
  try {
    // Aggregate tasks by status and count
    const summary = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Map to frontend-friendly format
    const statusMap = {
      Pending: "#facc15",
      "In Progress": "#3b82f6",
      Completed: "#22c55e",
    };

    const formattedSummary = summary.map((item) => ({
      label: item._id,
      value: item.count,
      color: statusMap[item._id] || "#cccccc",
    }));

    res.json(formattedSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};




const getCriticalTasks = async (req, res) => {
  try {
    // Set time range for today → tomorrow end
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999); // End of tomorrow

    // Fetch tasks with Medium/High priority and due within next 2 days
    const tasks = await Task.find({
      priority: { $in: ["High", "Medium"] },
      dueDate: { $gte: today, $lte: tomorrow },
    }).sort({ dueDate: 1 }); // Sort by earliest deadline

    res.status(200).json(tasks);
    // console.log("Critical tasks:", tasks);
  } catch (error) {
    console.error("Error fetching critical tasks:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getPerformanceMetrics = async (req, res) => {
  try {
    const tasks = await Task.find();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;

    const tasksCompletedOnTime = tasks.filter(
      t =>
        t.status === "Completed" &&
        new Date(t.updatedAt) <= new Date(t.dueDate)
    ).length;

    const tasksWithAssignee = tasks.filter(t => t.assignedTo).length;

    // Handle division by zero
    const performanceMetrics = [
      {
        name: "Tasks Completed",
        value: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      {
        name: "On-time Delivery",
        value: completedTasks
          ? Math.round((tasksCompletedOnTime / completedTasks) * 100)
          : 0,
      },
      {
        name: "Collaboration",
        value: totalTasks
          ? Math.round((tasksWithAssignee / totalTasks) * 100)
          : 0,
      },
    ];

    res.status(200).json(performanceMetrics);
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports={createTask,getProjectTasks,updateTask,deleteTask,getTaskById,getMyTasks,updateTaskStatus,getTaskSummary,getCriticalTasks,getPerformanceMetrics}