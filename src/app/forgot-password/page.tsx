"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) return toast.error("Please enter your email");
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgot-password", { email });
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8F5E9] px-4 py-8">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-4" style={{ padding: "10px" }}>
        <h2 className="text-xl font-bold text-center text-[#388E3C]">Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 bg-white/40 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] px-4 h-12 w-full text-m"
          style={{ padding: "10px" }}
        />
        <button
          onClick={handleForgotPassword}
          disabled={loading}
          style={{ padding: "10px" }}
          className={`py-3 text-white rounded-lg font-semibold transition ${
            loading ? "bg-gray-300 cursor-not-allowed" : "bg-[#4CAF50] hover:bg-[#388E3C]"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}
