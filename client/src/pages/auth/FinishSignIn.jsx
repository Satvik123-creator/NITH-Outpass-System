import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  firebaseAuth,
} from "../../firebase";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function FinishSignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuth();

  useEffect(() => {
    const finish = async () => {
      try {
        if (!isSignInWithEmailLink(firebaseAuth, window.location.href)) {
          setLoading(false);
          return;
        }
        let email = localStorage.getItem("emailForSignIn");
        if (!email) {
          email = window.prompt("Please provide your email for confirmation");
        }
        const result = await signInWithEmailLink(
          firebaseAuth,
          email,
          window.location.href
        );
        const idToken = await result.user.getIdToken();
        // send to backend to create/lookup user and mint app token
        const res = await axios.post(`${API_URL}/auth/firebase-callback`, {
          idToken,
        });
        // store token and user as usual; update global auth state so Navbar updates
        setUser(res.data.user, res.data.accessToken);
        toast.success("Signup/Login successful");
        navigate("/student/dashboard");
      } catch (err) {
        console.error("FinishSignIn error:", err);
        toast.error(err.response?.data?.message || "Sign-in failed");
        setLoading(false);
      }
    };
    finish();
  }, []);

  if (loading) return <div className="p-6">Completing sign-in...</div>;
  return <div className="p-6">Sign-in not detected.</div>;
}
