import { useEffect } from "react";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";

export default function ProjectForm({ setView, projectId, setSelectedProjectId }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (projectId) {
      api
        .get(`/projects/${projectId}`, { withCredentials: true })
        .then((res) => {
          reset({
            ...res.data,
            startDate: res.data.startDate?.split("T")[0] || "",
            endDate: res.data.endDate?.split("T")[0] || "",
          });
        })
        .catch((err) => console.error(err));
    } else {
      reset({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [projectId, reset]);

  const onSubmit = async (data) => {
    try {
      if (projectId) {
        await api.put(`/projects/${projectId}`, data, {
          withCredentials: true,
        });
        toast.success("Project updated!");
        reset();
        setSelectedProjectId(null);
      } else {
        await api.post(`/projects`, data, { withCredentials: true });
        toast.success("Project created!");
        reset();
      }
      setTimeout(() => setView("allProjects"), 1200);
    } catch (err) {
      console.error(err);
      toast.warn("Error saving project");
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold">
          {projectId ? "Edit Project" : "Create Project"}
        </h2>

        {/* Project Name */}
        <div>
          <input
            type="text"
            placeholder="Project Name"
            {...register("name", { required: "Project name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            placeholder="Description"
            {...register("description")}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Start Date */}
        <div>
          <input
            type="date"
            {...register("startDate")}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <input
            type="date"
            {...register("endDate")}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {projectId ? "Update Project" : "Create Project"}
        </button>
      </form>
    </>
  );
}
