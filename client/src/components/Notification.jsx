// import React, { useContext, useEffect, useState } from "react";
// import { NotificationContext } from "../context/NotificationProvider";
// import api from "../../api/api";

// export default function Notifications({ userId }) {
//   const { notifications, setNotifications } = useContext(NotificationContext);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (userId) {
//       api.get(`/notifications/${userId}`)
//         .then(res => setNotifications(res.data))
//         .finally(() => setLoading(false));
//     }
//   }, [userId]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="fixed top-16 right-6 w-80 bg-white shadow-lg rounded-lg p-4 space-y-2">
//       <h2 className="font-bold text-lg">🔔 Notifications</h2>
//       {notifications.length === 0 ? (
//         <p className="text-gray-500">No notifications</p>
//       ) : (
//         notifications.map((n) => (
//           <div
//             key={n._id}
//             className={`p-2 rounded ${n.readStatus ? "bg-gray-100" : "bg-blue-100"}`}
//           >
//             <p className="text-sm">{n.message}</p>
//             <p className="text-xs text-gray-500">
//               {new Date(n.timestamp).toLocaleTimeString()}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
