import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TaskForm from "./TaskForm";
import api from "../../api/api";
import { ToastContainer, toast } from "react-toastify";


export default function ProjectList({  onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);


  const fetchProjects = async () => {
  try {
    const res = await api.get("/projects", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setProjects(res.data);
    // console.log(res.data  )
  } catch (err) {
    console.error("Error fetching projects:", err);
  }
};

  

const deleteProject=async(id)=>{
  const projectId=id;

try {
  
   await api.delete(`/projects/${projectId}`,{
    headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials:true,

   })
   toast.success("Project Deleted Successfully")
   fetchProjects();


} catch (error) {
  console.error("error deleting project", error)
  
}

}



  return (
    <>
    <ToastContainer/>
    <div>
      <h2 className="text-xl font-bold mb-4">All Projects</h2>
      { projects.map((p) => (
        <div key={p._id} className="bg-white p-4 mb-4 rounded shadow">
          {/* <h2>ID: {p._id}</h2> */}
          <div className="flex justify-between ">
            <h3 className="font-semibold text-lg">{p.name}</h3>
           
          </div>
          <div className="flex justify-end mx-2">
             

             {(user.role === "Admin" || user.role === "ProjectManager") && (
              <button onClick={() => deleteProject(p._id)} className="bg-red-500 text-white p-1 rounded mx-2 cursor-pointer">
                Delete Project
              </button>
            )}
          </div>
         

          <div className="flex justify-end mt-3 cursor ">
           <button
  onClick={() => onProjectSelect(p._id)}
  className="text-blue-600 underline bg-transparent p-0 cursor-pointer"
>
  More details
</button>
          </div>
        </div>
      ))}

    
    </div>
    </>
  );
}
