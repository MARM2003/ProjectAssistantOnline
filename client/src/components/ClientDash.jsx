import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ClientDashboard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
const token =localStorage.getItem("accessToken")
  useEffect(() => {
    const fetchProject = async () => {
      try {
       
        const res = await api.get("/projects/clientProject"); 
        setProject(res.data.project);
        console.log("project",res.data.project)
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [token]);

  if (loading) return <p className="p-4 text-gray-600">Loading project...</p>;
  if (!project) return <p className="p-4 text-gray-600">No project assigned yet.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      <h2 className="text-lg font-semibold text-gray-700 mb-2">Project Progress</h2>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-6">
        <div
          className="bg-blue-600 h-6 rounded-full text-white text-center font-medium"
          style={{ width: `${project.completionPercent}%` }}
        >
          {project.completionPercent}%
        </div>
      </div>

      {project.completionPercent === 100 && (
        <p className="mt-4 text-green-600 font-semibold">🎉 Project Completed!</p>
      )}
    </div>
  );
};

export default ClientDashboard;
