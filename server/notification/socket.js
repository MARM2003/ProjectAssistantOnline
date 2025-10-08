const jwt = require("jsonwebtoken");
let io;
const onlineUsers = {};

const setupSocket = (server) => {
  io = require("socket.io")(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    
    socket.on("registerUserWithToken", (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        onlineUsers[decoded._id] = socket.id;
      } catch (err) {
        console.error("Invalid token for socket registration");
      }
    });

    socket.on("disconnect", () => {
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) delete onlineUsers[userId];
      }
      // console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocket, io: () => io, onlineUsers };
