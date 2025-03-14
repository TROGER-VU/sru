"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password) return toast.error("Enter a new password");
    try {
      setLoading(true);
      await axios.post("/api/users/reset-password", { token, password });
      toast.success("Password reset successful!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8F5E9] px-4 py-8">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-4" style={{ padding: "10px" }}>
        <h2 className="text-xl font-bold text-center text-[#388E3C]">Set New Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px" }}
          className="border border-gray-300 bg-white/40 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] px-4 h-12 w-full text-m"
        />
        <button
          onClick={handleResetPassword}
          disabled={loading}
          style={{ padding: "10px" }}
          className={`py-3 text-white rounded-lg font-semibold transition ${
            loading ? "bg-gray-300 cursor-not-allowed" : "bg-[#4CAF50] hover:bg-[#388E3C]"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
