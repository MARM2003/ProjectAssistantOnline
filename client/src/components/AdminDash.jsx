import React ,{useEffect,useState}from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import api from "../../api/api.js";

const Dashboard = ( ) => {

  const [taskSummary, setTaskSummary] = useState([]);
  const [projectProgress, setProjectProgress] = useState([]);
   const [tasks, setTasks] = useState([]);
  const [performanceMetrics,setPerformanceMetrics]=useState([])

  
   useEffect(() => {

    const fetchMetrics = async () => {
    try {
      const res = await api.get("/tasks/performance");
      setPerformanceMetrics(res.data);
      console.log("Metrics:", res.data);
    } catch (err) {
      console.error("Error fetching performance metrics:", err);
    }
  };


    const fetchSummary = async () => {
      try {
        const res = await api.get("/tasks/summary");
        setTaskSummary(res.data);
        // console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProgress = async () => {
    try {
      const res = await api.get("/projects/progress");
      setProjectProgress(res.data);
      // console.log("progress",res.data)
    } catch (error) {
      console.error("Error fetching project progress:", error);
    }
  };

  const fetchCriticalTasks = async () => {
      try {
        const res = await api.get("/tasks/critical");
        setTasks(res.data);
        console.log("set critical tasks",res.data)
      } catch (err) {
        console.error("Error fetching critical tasks:", err);
      }
    };

    
  fetchCriticalTasks();
  fetchSummary();
  fetchProgress();
  fetchMetrics();
  }, []);


  

  const COLORS = ["#22c55e", "#3b82f6", "#facc15"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Dashboard</h1>

      {/* Task Status Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {taskSummary.map((t) => (
          <div key={t.label} className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{t.label}</p>
              <p className="text-2xl font-semibold">{t.value}</p>
            </div>
            <div className={`w-3 h-12 rounded-full`} style={{ backgroundColor: t.color }}></div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Progress Bar Chart */}
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Project Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={projectProgress}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
       


        {/* Performance Metrics Pie Chart */}
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Performance Metrics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={performanceMetrics}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {performanceMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

     

       <div className="bg-white p-4 shadow rounded-xl mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">🔥 Critical Tasks</h2>
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task._id} className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-gray-800">{task.title}</p>
              <p className="text-xs text-gray-500">
                Deadline: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                task.priority === "High"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {task.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Dashboard;
