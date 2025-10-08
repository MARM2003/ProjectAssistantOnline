import { useEffect, useState, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import TaskForm from "./TaskForm"; // your existing task form
import api from "../../api/api"
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"

export default function SingleProject({ projectId, setView, setSelectedProjectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [clients, setClients] = useState([]);
const [selectedClient, setSelectedClient] = useState("");
const [completion, setCompletion] = useState("");


  // Fetch project + tasks
  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`, {
        withCredentials: true,
      });
      setProject(res.data);
      console.log(res.data)
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch project");
      setLoading(false);
    }
  };


   const fetchClients = async () => {
    try {
      const res = await api.get("/projects/getClients");
      setClients(res.data);
      console.log("clients data",res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const fetchClentData = async () => {
    try {
      const res = await api.get(`/projects/getProjectAndClientData/${projectId}`);
      const { project, client } = res.data;

      if (project) setCompletion(project.completionPercent || 0);
      if (client) setSelectedClient(client._id);
    } catch (error) {
      console.error("Error fetching project/client data:", error);
    }
  };

  
  useEffect(() => {
    fetchProject();
    fetchClients();
    fetchClentData();
  }, [projectId]);




  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${projectId}`, { withCredentials: true });
      toast.success("Project deleted!");
      
    } catch (err) {
      console.error(err);
      toast.error("Error deleting project");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`, { withCredentials: true });
      toast.success("Task deleted!");
      fetchProject();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting task");
    }
  };


  const handleUpdate = async () => {
  try {
    if (!selectedClient || !completion) {
      alert("Please select client and enter completion percentage.");
      return;
    }

    await api.put("/projects/updateDetails", {
      clientId: selectedClient,
      projectId,
      completionPercent: completion,
    },
   { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });

    alert("Project details updated successfully!");
  } catch (error) {
    console.error("Error updating project details:", error);
    alert("Something went wrong.");
  }
};


  if (loading) return <p className="text-center py-10">Loading project...</p>;
  if (!project) return <p className="text-center py-10">Project not found.</p>;

  return (
    <>
      <ToastContainer />
      <div className="max-w-6xl mx-auto p-6">
        {/* Project Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <p className="text-gray-600 mt-2">{new Date(project.startDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })} to {new Date(project.endDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mt-4">
  <h2 className="text-lg font-semibold text-gray-800 mb-3">Project Details Update</h2>

  {/* Client Dropdown */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Select Client
    </label>
    <select
      value={selectedClient}
      onChange={(e) => setSelectedClient(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
    >
      <option value="">-- Select Client --</option>
      {clients.map((client) => (
        <option key={client._id} value={client._id}>
          {client.name}
        </option>
      ))}
    </select>
  </div>

  {/* Project Completion Input */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-600 mb-1">
      Project Completion (%)
    </label>
    <input
      type="number"
      min="0"
      max="100"
      value={completion}
      onChange={(e) => setCompletion(e.target.value)}
      placeholder="Enter completion percentage"
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <button
    
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
   onClick={handleUpdate}>
    Update Project
  </button>
</div>

          {(user?.role === "Admin" || user?.role === "ProjectManager") && (
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={() => {
                  setView("createProject");
                  setSelectedProjectId(project._id); 
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Task Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Tasks</h2>
            {(user?.role === "Admin" || user?.role === "ProjectManager") && (
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Add Task
              </button>
            )}
          </div>

          {project.tasks?.length > 0 ? (
            <ul className="space-y-3">
              {project.tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="">
                    <div className="flex justify-left">

                      <h3 className="text-lg font-semibold text-gray-700">{task.title}</h3>
                      <p
                        className={`inline-block mt-2 px-3 py-1 text-sm mx-3 rounded-full ${task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {task.status}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">{task.description}</p>
                      <p> 
                        Developer : {task.assignedTo.name} | {task.assignedTo.email}
                      </p>

                      <p className="text-gray-500">
                        Due Date: {new Date(task.dueDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </p>
                      <p>Priority: {task.priority}</p>
                    </div>
                  </div>

                  {(user?.role === "Admin" || user?.role === "ProjectManager") && (
                    <div className="flex gap-3 mt-3 md:mt-0">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setShowTaskForm(true);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tasks added yet.</p>
          )}
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
              <button
                onClick={() => setShowTaskForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <TaskForm
                projectId={projectId}
                defaultValues={editingTask}
                fetchTasks={fetchProject}
                onClose={() => setShowTaskForm(false)}
              />
            </div>
          </div>
        )}
      </div>

    </>
  );
}
