import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
  baseURL: "https://local-chef-bazaar-server-seven.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
