"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/profile");
    } catch (error: any) {
      console.log("Login Failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8F5E9] px-4 py-8">
      <div className="w-full max-w-sm p-4 sm:p-6 bg-white/85 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col gap-4 items-center border border-white/50">

        <Image src="/logo.jpg" alt="SRU Logo" width={80} height={80} style={{marginTop:"10px"}} />

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#388E3C]">SRU</h2>
          <p className="text-gray-700 text-sm sm:text-md">Recycle. Earn. Redeem.</p>
        </div>

        <div className="space-y-3 w-4/5">
          <input
            className="border border-gray-300 bg-white/40 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] px-4 h-12 w-full text-sm"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            style={{marginBottom:"20px", padding:"10px"}}
          />

          <div className="relative">
            <input
              className="border border-gray-300 bg-white/40 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] px-4 h-12 w-full text-sm"
              id="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              style={{padding:"10px"}}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#388E3C] text-xs"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="text-right w-4/5 text-xs text-[#388E3C] hover:underline">
          <a href="#">Forgot password?</a>
        </div>

        <button
          onClick={onLogin}
          disabled={buttonDisabled}
          className={`w-4/5 py-3 text-white rounded-lg font-semibold transition text-sm ${
            buttonDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#4CAF50] hover:bg-[#388E3C] focus:ring-2 focus:ring-green-400"
          }`}
          style={{padding:"10px"}}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="flex items-center justify-center space-x-3 w-4/5">
          <div className="h-px w-16 bg-gray-300"></div>
          <p className="text-gray-500 text-sm">OR</p>
          <div className="h-px w-16 bg-gray-300"></div>
        </div>

        <button
          onClick={() => {/* Google login logic */}}
          className="flex items-center justify-center w-4/5 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
          style={{padding: "10px"}}
        >
          <Image src="/google-icon.png" alt="Google Icon" width={20} height={20} className="mr-2" />
          Continue with Google
        </button>

        <div className="text-center text-sm w-4/5">
          Don’t have an account? <Link href="/signup" className="text-[#388E3C] font-semibold hover:underline">Sign up</Link>
        </div>

        <p className={"text-xs text-gray-500 text-center w-8/10"} style={{marginBottom: "10px"}}>
          Join us in creating a sustainable future, one recycling action at a time.<br />
          Together we can make a difference.
        </p>

      </div>
    </div>
  );
}
