import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import useAxios from "../hooks/useAxios";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const axiosInstance = useAxios();

  const registerUser = async (email, password) => {
    setAuthLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const signInUser = async (email, password) => {
    setAuthLoading(true);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const signInGoogle = async () => {
    setAuthLoading(true);
    try {
      return await signInWithPopup(auth, googleProvider);
    } finally {
      setAuthLoading(false);
    }
  };

  const logOut = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      setAuthLoading(false);
    }
  };

  const updateUserProfile = async (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // Consistent backend login with idToken
  const backendLogin = async (idToken) => {
    await axiosInstance.post(
      "/auth/firebase-login",
      { idToken },
      { withCredentials: true }
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          await backendLogin(idToken);
        } catch (err) {
          console.error("Backend login failed:", err);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosInstance]);

  const authInfo = {
    user,
    loading,
    authLoading,
    registerUser,
    signInUser,
    signInGoogle,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
