import React, { useEffect, useState,useContext } from "react";
import api from "../../api/api"
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";


const socket = io("http://localhost:5000"); // your backend

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const token=localStorage.getItem("accessToken")
  const{user}=useContext(AuthContext);
  

  const fetchNotifications = async () => {
  try {
    const res = await api.get("/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
      },
    });
    setNotifications(res.data);

    console.log("all notifications",res.data);
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

  
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, readStatus: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

 


  useEffect(() => {
  fetchNotifications();

  socket.emit("registerUserWithToken", localStorage.getItem("accessToken"));

  socket.on("receiveNotification", (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  });

  return () => {
    socket.off("receiveNotification");
  };
}, []); 


  return (
    <div className="max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          
          {notifications.map((n) => (
  <div
    key={n._id}
    className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded shadow bg-gray-300 ${
      n.readStatus ? "bg-gray-100" : "bg-blue-50"
    }`}
  >
    <div className="flex-1">
      <p className="text-gray-800 font-medium">{n.message}</p>
      <p className="text-sm text-gray-500 mt-1">
        Type: <span className="capitalize">{n.type}</span>
      </p>
      {(user?.role === "Admin" || user?.role === "ProjectManager") && (
 <p className="text-sm text-gray-500 mt-1">
        For: <span className="font-medium">{n.userId?.name || "System"}</span> ({n.userId?.role || "N/A"})
      </p>
      )}
     
      <p className="text-xs text-offwhite-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
     <p className="text-xs text-blue-400 mt-1 text-bold">
  {n.readStatus ? "Seen" : "Delivered"}
</p>

    </div>

   {user?.role === "ProjectManager" && n?.type === "status-update" && !n.readStatus && (
  <button
    onClick={() => markAsRead(n._id)}
    className="mt-2 md:mt-0 ml-0 md:ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
  >
    Mark as Read
  </button>
)}
 {user?.role === "Developer" && n?.type === "task-assignment" && !n.readStatus && (
  <button
    onClick={() => markAsRead(n._id)}
    className="mt-2 md:mt-0 ml-0 md:ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
  >
    Mark as Read
  </button>
)}

   
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default NotificationList;
