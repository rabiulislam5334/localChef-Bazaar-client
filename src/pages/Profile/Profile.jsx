import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import {
  User,
  MapPin,
  BadgeCheck,
  Camera,
  Send,
  ShieldCheck,
} from "lucide-react";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user, setUser, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // 🔹 Load profile from DB
  const loadProfile = async () => {
    try {
      const res = await axiosSecure.get("/users/me");
      if (res.data) {
        setProfile(res.data);
        reset({
          name: res.data.name || user?.displayName || "",
          address: res.data.address || "",
          photoURL: res.data.imageUrl || user?.photoURL || "",
        });
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  };

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  // 🔹 Update profile
  const onUpdateProfile = async (data) => {
    const toastId = toast.loading("Updating profile...");

    try {
      // 1️⃣ Update Firebase Auth
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photoURL,
      });

      // 2️⃣ Update DB
      const res = await axiosSecure.patch("/users/me", {
        name: data.name,
        address: data.address,
        imageUrl: data.photoURL,
      });

      if (res.data?.success) {
        // 3️⃣ Update Context user (Navbar / Dashboard sync)
        setUser((prev) => ({
          ...prev,
          displayName: data.name,
          photoURL: data.photoURL,
        }));

        toast.success("Profile updated successfully!", { id: toastId });
        loadProfile();
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Profile update failed", { id: toastId });
    }
  };

  // 🔹 Role Request
  const handleRoleRequest = (type) => {
    Swal.fire({
      title: `Apply for ${type.toUpperCase()}?`,
      text: "Admin will review your request.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#422ad5",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, Send!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.post("/requests", {
            userName: profile?.name || user?.displayName,
            userEmail: profile?.email || user?.email,
            requestType: type,
            requestStatus: "pending",
            requestTime: new Date(),
          });

          Swal.fire(
            "Sent!",
            `Your request to be a ${type} is pending.`,
            "success"
          );
        } catch {
          Swal.fire("Error", "Request already exists.", "error");
        }
      }
    });
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-[#422ad5]"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-0 px-2">
      <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#422ad5] to-[#7b61ff]" />

        <div className="px-8 pb-10">
          {/* Avatar */}
          <div className="relative flex items-end -mt-16 gap-6 mb-10">
            <img
              src={
                profile.imageUrl ||
                user?.photoURL ||
                "https://i.ibb.co/2kRkYwL/default-avatar.png"
              }
              className="w-32 h-32 rounded-3xl object-cover ring-8 ring-white shadow-lg"
              alt="Profile"
            />
            <div>
              <h2 className="text-3xl font-black flex items-center gap-2">
                {profile.name}
                <BadgeCheck className="text-[#422ad5]" />
              </h2>
              <p className="text-xs uppercase font-bold text-gray-500">
                {profile.role} • {profile.status}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <form
              onSubmit={handleSubmit(onUpdateProfile)}
              className="space-y-5"
            >
              <h3 className="font-bold text-xs uppercase border-b pb-2">
                Edit Profile
              </h3>

              <div>
                <label className="text-xs font-bold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-300" />
                  <input
                    {...register("name", { required: true })}
                    className="input pl-10 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold">Photo URL</label>
                <div className="relative">
                  <Camera className="absolute left-3 top-3 text-gray-300" />
                  <input
                    {...register("photoURL")}
                    className="input pl-10 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-300" />
                  <input
                    {...register("address")}
                    className="input pl-10 w-full"
                  />
                </div>
              </div>

              <button className="btn w-full bg-[#422ad5] text-white">
                Update Profile
              </button>
            </form>

            {/* Role Actions */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase border-b pb-2">
                Account Actions
              </h3>

              {profile.role === "user" && (
                <>
                  <button
                    onClick={() => handleRoleRequest("chef")}
                    className="btn w-full"
                  >
                    <Send size={16} /> Be a Chef
                  </button>
                  <button
                    onClick={() => handleRoleRequest("admin")}
                    className="btn w-full btn-outline"
                  >
                    <ShieldCheck size={16} /> Be an Admin
                  </button>
                </>
              )}

              {profile.role === "admin" && (
                <p className="text-green-600 font-bold">
                  You have full admin access
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
