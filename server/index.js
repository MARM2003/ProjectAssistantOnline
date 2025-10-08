require("dotenv").config();
const express = require("express")
const cors=require("cors")
const mongoose=require("./dbconnection/connect")
const { json } = require("body-parser");
const authRoutes =require( "./routes/authRoute.js");
const projectRoutes =require( "./routes/projectRoutes.js");
const taskRoutes =require( "./routes/taskRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");

const { setupSocket } = require("./notification/socket.js");

const app=express();



app.use(
  cors({
    origin: "https://project-assistant-online-front.vercel.app/", 
     methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
  })
);
app.use(express.json())
app.use("/api",authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api/users", userRoutes);

app.use("/api/notifications", notificationRoutes);

app.get("/",(req,res)=>{
    res.send("backend working")
})

const server =app.listen(process.env.PORT,()=>{
    console.log("Server is running on" ,process.env.PORT)
})

setupSocket(server);

