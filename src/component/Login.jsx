import React, { useState } from "react";
import LoginAvatar from "../assets/LoginAvatar.jpg";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                 bg-gradient-to-br from-[#a6b4da] via-[#547bb6] to-[#867ddb] 
                 p-4"
    >
      <div
        className="relative w-full max-w-md rounded-2xl 
                   bg-white/20 backdrop-blur-lg 
                   shadow-2xl px-8 pt-20 pb-10 border border-white/30"
      >
        {/* Avatar */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <img
            src={LoginAvatar}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
          />
        </div>

        {/* Username */}
        <div className="mt-6 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 text-lg">
            👤
          </span>

          <input
            type="text"
            placeholder="enter your email"
            className="w-full bg-white/70 backdrop-blur-sm px-12 py-3 
                       rounded-lg shadow-md border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mt-6 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 text-lg">
            🔑
          </span>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-white/70 backdrop-blur-sm px-12 py-3 
                       rounded-lg shadow-md border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Eye Icon */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700"
          >
            {showPassword ? <Eye/> : <EyeOff/>}
          </span>
        </div>

        {/* Remember Password */}
        <div className="mt-4 flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4" />
          <label className="text-white text-sm font-medium">
            Remember Password
          </label>
        </div>

        {/* Login Button */}
        <button
          className="w-full mt-6 bg-gradient-to-r from-gray-800 to-gray-700 
                     text-white py-3 rounded-lg shadow-md 
                     hover:from-gray-900 hover:to-gray-800 transition-all"
        >
          Login
        </button>
      </div>
    </div>
  );
}
