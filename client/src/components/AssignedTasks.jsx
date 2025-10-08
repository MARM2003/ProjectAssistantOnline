import React, { useEffect, useState } from "react";
import api from "../../api/api"

export default function AssignedTasks() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("accesstoken");

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await api.get("/tasks/getTasks");
        setTasks(tasksRes.data);

        
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}/status`,{status:newStatus});
      const updatedTask = res.data;
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    } catch (error) {
      console.error(error);
      console.error("Error updating task:", error.response?.data || error.message);
    }
  };

  return (
   
    <>
        <div className="p-6">
  <h1 className="text-2xl font-bold mb-6">👨‍💻 Developer Dashboard</h1>

  {/* Tasks Section */}
  <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
  <div className="space-y-4">
    {tasks.length === 0 ? (
      <p className="text-gray-500">No tasks assigned.</p>
    ) : (
      tasks.map((task) => (
        <div key={task._id} className="p-4 bg-white shadow rounded">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <p>{task.description}</p>
          {task.project && (
            <p className="text-sm text-gray-600">
              📌 Project: {task.project.name} – {task.project.description}
            </p>
          )}

          <p className="text-sm text-gray-500">
            Current Status:{" "}
            <span className="font-medium text-blue-600">{task.status}</span>
          </p>

          {/* Dropdown + Button */}
          <div className="flex items-center gap-2 mt-2">
            <select
              value={task.newStatus || task.status}
              onChange={(e) => {
                setTasks((prev) =>
                  prev.map((t) =>
                    t._id === task._id ? { ...t, newStatus: e.target.value } : t
                  )
                );
              }}
              className="p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={() =>
                handleStatusChange(task._id, task.newStatus || task.status)
              }
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Change
            </button>
          </div>
        </div>
      ))
    )}
  </div>

  
</div>

    </>
  );
}
