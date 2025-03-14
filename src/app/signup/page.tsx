"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

export default function SignupPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setButtonDisabled(
      !(user.fullName.length > 0 &&
        user.email.length > 0 &&
        user.mobileNumber.length > 0 &&
        user.password.length > 0)
    );
  }, [user]);

  useEffect(() => {
    if (session) {
      toast.success("Login successful!");
      router.push("/profile"); // Redirect after Google signup
    }
  }, [session, router]);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("Signup successful");
      router.push("/profile"); // Redirect after manual signup
    } catch (error) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8F5E9] px-4 py-8">
      <div className="w-full max-w-sm p-4 sm:p-6 bg-white/85 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col gap-4 items-center border border-white/50">
        <Image src="/logo.jpg" alt="SRU Logo" width={80} height={80} style={{ marginTop: "10px" }} />

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#388E3C]">SRU</h2>
          <p className="text-gray-700 text-sm sm:text-md">Recycle. Earn. Redeem.</p>
        </div>

        <div className="space-y-3 w-4/5">
          <input
            className="border border-gray-300 bg-white/40 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] px-4 h-12 w-full text-sm"
            type="text"
            value={user.fullName}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            placeholder="Full Name"
            style={{ marginBottom: "20px", padding: "10px" }}
          />
          <input
            className="border border-gray-300 bg-white/40 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] px-4 h-12 w-full text-sm"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
            style={{ marginBottom: "20px", padding: "10px" }}
          />
          <input
            className="border border-gray-300 bg-white/40 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] px-4 h-12 w-full text-sm"
            type="text"
            value={user.mobileNumber}
            onChange={(e) => setUser({ ...user, mobileNumber: e.target.value })}
            placeholder="Mobile Number"
            style={{ marginBottom: "20px", padding: "10px" }}
          />
          <div className="relative">
            <input
              className="border border-gray-300 bg-white/40 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388E3C] px-4 h-12 w-full text-sm"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
              style={{ padding: "10px" }}
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

        <button
          onClick={onSignup}
          disabled={buttonDisabled}
          className={`w-4/5 py-3 text-white rounded-lg font-semibold transition text-sm ${
            buttonDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#4CAF50] hover:bg-[#388E3C] focus:ring-2 focus:ring-green-400"
          }`}
          style={{ padding: "10px" }}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="flex items-center justify-center space-x-3 w-4/5">
          <div className="h-px w-16 bg-gray-300"></div>
          <p className="text-gray-500 text-sm">OR</p>
          <div className="h-px w-16 bg-gray-300"></div>
        </div>

        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center w-4/5 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
          style={{ padding: "10px" }}
        >
          <Image src="/google-icon.png" alt="Google Icon" width={20} height={20} className="mr-2" />
          Sign up with Google
        </button>

        <div className="text-center text-sm w-4/5">
          Already have an account? <Link href="/login" className="text-[#388E3C] font-semibold hover:underline">Log in</Link>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Each signup helps us plant a tree. <br />Green Plant Initiative.
        </p>
        <p className={"text-xs text-gray-500 text-center w-8/10"} style={{ marginBottom: "10px" }}>
        Need assistance? Contact us at: <strong>smartrecyclingunit@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}
