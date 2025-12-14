import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router"; // Link, useNavigate must be imported from 'react-router-dom' (assuming)
import axios from "axios"; // Kept for imgbb external API call
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios"; // ⬅️ 1. useAxios import করা হয়েছে

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { registerUser, updateUserProfile } = useAuth();
  const axiosInstance = useAxios(); // ⬅️ 2. axiosInstance তৈরি করা হয়েছে
  const navigate = useNavigate();

  const handleRegistration = async (data) => {
    try {
      // 1️⃣ create firebase user
      const result = await registerUser(data.email, data.password);

      // 2️⃣ upload image to imgbb
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData
      );

      const photoURL = imgRes.data.data.display_url;

      // 3️⃣ update firebase profile
      // Assuming updateUserProfile signature is (name, photoURL)
      await updateUserProfile({
        displayName: data.name,
        photoURL: photoURL,
      });

      // 4️⃣ get firebase idToken
      const idToken = await result.user.getIdToken();

      // 5️⃣ login to backend (IMPORTANT) ⬅️ 3. এই অংশটি ফিক্স করা হয়েছে
      await axiosInstance.post(
        "/auth/firebase-login", // 404 ফিক্স করার জন্য শুধু relative path ব্যবহার করা হয়েছে
        {
          idToken,
          name: data.name,
          imageUrl: photoURL,
        },
        { withCredentials: true }
      );

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="card bg-base-100 max-w-sm mx-auto shadow-2xl">
      <h3 className="text-3xl text-center mt-4">Register</h3>

      <form onSubmit={handleSubmit(handleRegistration)} className="card-body">
        <label>Name</label>
        <input
          {...register("name", { required: "Name required" })}
          className="input"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <label>Photo</label>
        <input
          type="file"
          {...register("photo", { required: "Photo required" })}
        />
        {errors.photo && <p className="text-red-500">{errors.photo.message}</p>}

        <label>Email</label>
        <input
          type="email"
          {...register("email", { required: "Email required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label>Password</label>
        <input
          type="password"
          {...register("password", {
            required: "Password required",
            minLength: { value: 6, message: "Min 6 characters" },
          })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button className="btn btn-neutral mt-4">Register</button>

        <p className="text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
