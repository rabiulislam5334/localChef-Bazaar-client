import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const res = await axiosSecure.get("/users/me");
        setProfile(res.data);
        reset({
          name: res.data?.name || "",
          address: res.data?.address || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [user, axiosSecure, reset]);

  const onSubmit = async (data) => {
    try {
      await axiosSecure.patch("/users/me", {
        name: data.name,
        address: data.address,
      });

      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const sendRequest = async (type) => {
    try {
      await axiosSecure.post("/requests", {
        userName: profile.name,
        userEmail: profile.email,
        requestType: type,
      });
      toast.success(`Requested to be ${type}`);
    } catch (err) {
      toast.error("Request already sent or failed");
    }
  };

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex gap-4 items-center">
          <img
            src={
              profile.imageUrl ||
              profile.photoURL ||
              "https://via.placeholder.com/80"
            }
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-lg">{profile.name}</div>
            <div className="text-sm text-gray-500">{profile.email}</div>
            <div className="text-sm text-gray-500">Role: {profile.role}</div>
            <div className="text-sm text-gray-500">
              Status: {profile.status}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
          <input
            {...register("name")}
            className="input input-bordered w-full"
          />
          <input
            {...register("address")}
            className="input input-bordered w-full"
          />
          <button className="btn btn-primary">Update Profile</button>
        </form>
      </div>

      {profile.role === "user" && (
        <div className="mt-4 flex gap-2">
          <button onClick={() => sendRequest("chef")} className="btn">
            Be a Chef
          </button>
          <button
            onClick={() => sendRequest("admin")}
            className="btn btn-ghost"
          >
            Be an Admin
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
