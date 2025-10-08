

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/api";

export default function TaskForm({ onClose, defaultValues, projectId, fetchTasks }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      priority: "Low",
      status: "Pending",
      dueDate: "",
    },
  });

  const [users, setUsers] = useState([]);

  // Reset form when editing
  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        dueDate: defaultValues.dueDate
          ? defaultValues.dueDate.split("T")[0] // format ISO -> yyyy-mm-dd
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Low",
        status: "Pending",
        dueDate: "",
      });
    }
  }, [defaultValues, reset]);

  // Fetch developers for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setUsers(res.data.filter(user => user.role === "Developer"));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (defaultValues?._id) {
        // Update existing task
        await api.put(`/tasks/${defaultValues._id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
      } else {
        // Create new task
        await api.post(`/tasks/${projectId}/tasks`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
      }
      fetchTasks(); // refresh task list
      onClose();
      reset();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {defaultValues ? "Update Task" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <input {...register("title")} placeholder="Task Title" className="border p-2 rounded"/>
          <textarea {...register("description")} placeholder="Task Description" className="border p-2 rounded"/>
          <select {...register("assignedTo")} className="border p-2 rounded">
            <option value="">Select Developer</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
          <select {...register("priority")} className="border p-2 rounded">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select {...register("status")} className="border p-2 rounded">
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <input type="date" {...register("dueDate")} className="border p-2 rounded"/>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              {defaultValues ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
