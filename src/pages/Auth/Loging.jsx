import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Login() {
  const { signInUser } = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    signInUser(data.email, data.password)
      .then(() => {
        toast.success("Login Successful!");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        toast.error("Invalid Email or Password");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Welcome Back!</h2>
      <p className="text-center text-sm text-gray-500">Login to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="label">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="********"
            className="input input-bordered w-full"
            required
          />
        </div>

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm">
        Don’t have an account?{" "}
        <Link className="text-primary font-medium" to="/auth/register">
          Register
        </Link>
      </p>
    </div>
  );
}
