import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
});

export default function useAxiosSecure() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const reqI = axiosSecure.interceptors.request.use((config) => {
      // Prefer cookie-based auth if backend sets httpOnly cookie.
      // But if you store token on client, send it:
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });

    const resI = axiosSecure.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          logOut?.().finally(() => navigate("/auth/login"));
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqI);
      axiosSecure.interceptors.response.eject(resI);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
}
