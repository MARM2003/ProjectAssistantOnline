// pages/Dashboard.jsx
import { useState ,useContext,useEffect} from "react";
import Sidebar from "../components/Sidebar";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import SingelProject from "../components/SingleProjectandTask"
import { AuthContext } from "../context/AuthContext";
import AssignedTasks from "../components/AssignedTasks";
import Notifications from "../components/NotificationList";
import AdminDash from "../components/AdminDash"
import ClientDashboard from "../components/ClientDash";
export default function Dashboard() {

  const {user}=useContext(AuthContext)
  const [view, setView] = useState("dashboard"); 

  const [selectedProjectId, setSelectedProjectId] = useState(null);

 const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setView("singleProject"); 
  };

  useEffect(() => {
   
    if (user?.role === "Admin") {
      setView("dashboard");
    } else if (user?.role === "ProjectManager") {
      setView("allProjects");
    } else if(user?.role==="Developer"){
      setView("assignedTasks"); 
    }else if(user?.role==="Viewer"){
      setView("clientdash")
    }
  }, [user]);

  return (
    <div className="flex">
      <Sidebar onSelect={setView} setSelectedProjectId={setSelectedProjectId}/>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {view === "dashboard" && user?.role==="Admin" &&  <AdminDash/>}
        {view === "createProject" && <ProjectForm  setView={setView} projectId={selectedProjectId} setSelectedProjectId={setSelectedProjectId}/>}
        {view === "allProjects" && <ProjectList onProjectSelect={handleProjectSelect}/>}
        {view === "singleProject" && selectedProjectId  && ( <SingelProject projectId={selectedProjectId} setView={setView} setSelectedProjectId={setSelectedProjectId}/>)}
        {view ==="notifications" && <Notifications/>}
        {view ==="assignedTasks" && <AssignedTasks/>}
        {view ==="clientdash" && <ClientDashboard/>}
      </div>
    </div>
  );
}

