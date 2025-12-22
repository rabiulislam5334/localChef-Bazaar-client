// import axios from "axios";
// import { useEffect } from "react";
// import { useNavigate } from "react-router";
// import useAuth from "./useAuth";

// const axiosSecure = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
//   withCredentials: true,
// });

// export default function useAxiosSecure() {
//   const { logOut } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const resInterceptor = axiosSecure.interceptors.response.use(
//       (res) => res,
//       (err) => {
//         const status = err?.response?.status;
//         if (status === 401 || status === 403) {
//           logOut?.().finally(() => navigate("/"));
//         }
//         return Promise.reject(err);
//       }
//     );

//     return () => {
//       axiosSecure.interceptors.response.eject(resInterceptor);
//     };
//   }, [logOut, navigate]);

//   return axiosSecure;
// }
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  withCredentials: true,
});

export default function useAxiosSecure() {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    /* 🔐 REQUEST INTERCEPTOR — attach token */
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    /* 🚫 RESPONSE INTERCEPTOR */
    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
}
