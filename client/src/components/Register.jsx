import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
 import { useNavigate } from 'react-router-dom';
import api from "../../api/api";

export default function Register() {


  const navigate=useNavigate();
  const { register, handleSubmit, watch, formState: { errors } ,reset} = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/register", data);
      if(res.status===201){
        setMessage(res.data.message);
        toast.success("Register Successfully")
        reset();
        setTimeout(()=>{
          navigate("/login")
        },2500)
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
   <>
   <ToastContainer/>
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <label className="block mb-2">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}

        <label className="block mb-2">Email</label>
        <input
          {...register("email", { 
            required: "Email is required", 
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
          })}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

        <label className="block mb-2">Password</label>
        <div className="relative">
          <input
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
            type={showPassword ? "text" : "password"}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

        <label className="block mb-2">Role</label>
        <select
          {...register("role", { required: "Role is required" })}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="Admin">Admin</option>
          <option value="ProjectManager">Project Manager</option>
          <option value="Developer">Developer</option>
          <option value="Viewer">Viewer</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm mb-2">{errors.role.message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
   </>
  );
}
