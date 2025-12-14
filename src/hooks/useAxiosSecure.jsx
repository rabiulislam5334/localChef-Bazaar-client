import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  withCredentials: true,
});

export default function useAxiosSecure() {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const resInterceptor = axiosSecure.interceptors.response.use(
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
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
}
