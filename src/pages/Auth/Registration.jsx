import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const handleRegistration = async (data) => {
    try {
      // 1️⃣ create firebase user
      await registerUser(data.email, data.password);

      // 2️⃣ upload image to imgbb
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imageUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_KEY
      }`;
      const imgRes = await axios.post(imageUrl, formData);

      const photoURL = imgRes.data.data.display_url;

      // 3️⃣ update firebase profile
      await updateUserProfile(data.name, photoURL);

      // 4️⃣ save user in database
      const userInfo = {
        name: data.name,
        email: data.email,
        imageUrl: photoURL,
        role: "user",
        status: "active",
      };

      await axiosSecure.post("/users", userInfo);

      toast.success("Registration successful!");
      navigate(location.state || "/");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-sm shadow-2xl">
      <h3 className="text-3xl text-center">Register</h3>

      <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
        <label className="label">Name</label>
        <input {...register("name", { required: true })} className="input" />
        {errors.name && <p className="text-red-500">Name required</p>}

        <label className="label">Photo</label>
        <input
          type="file"
          {...register("photo", { required: true })}
          className="file-input"
        />

        <label className="label">Email</label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="input"
        />

        <label className="label">Password</label>
        <input
          type="password"
          {...register("password", { required: true, minLength: 6 })}
          className="input"
        />

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
