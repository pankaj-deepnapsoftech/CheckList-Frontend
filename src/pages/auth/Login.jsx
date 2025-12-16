import React, { useState } from "react";
import ProductionVideo from "../../assets/ProductionVideo.mp4";
import { Eye, EyeOff } from "lucide-react";
import { loginValidationSchema } from "../../Validation/LoginValidation";
import { useFormik } from "formik";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { loginUser,logedinUser } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginValidationSchema,


    onSubmit: (values) => {
      loginUser.mutate(values, {
        onSuccess: () => {
          navigate("/")
        },
      });
      
    },
  });

 
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover brightness-50"
      >
        <source src={ProductionVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>

      {/* Login Box */}
      <form
        className="
      relative z-10 w-full max-w-md 
      bg-white/20 backdrop-blur-xl 
      shadow-2xl rounded-2xl 
      p-10 pt-20 border border-white/30 
      min-h-[400px]
    "
        onSubmit={formik.handleSubmit}
      >
        {/* Circle With SVG */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 
        w-24 h-24 rounded-full bg-gray-300  shadow-xl flex items-center justify-center"
        >
          <img
            src="https://jpmgroup.co.in/assets/svg/logo-color.svg"
            alt="logo"
            className="w-14 h-14"
          />
        </div>

        <h2 className="text-3xl font-semibold text-center text-white mb-10">
          Login
        </h2>

        {/* Email */}
        <label className="block mb-6">
          <span className="text-white font-medium">Email address</span>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            className="
          mt-2 w-full px-4 py-3 
          bg-white/70 backdrop-blur-sm 
          border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-400
        "
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />

          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.email}
            </p>
          )}

        </label>

        {/* Password */}
        <label className="block mb-8">
          <span className="text-white font-medium">Password</span>
          <div className="relative mt-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="
            w-full px-4 py-3 
            bg-white/70 backdrop-blur-sm 
            border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />

            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>
        </label>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loginUser.isPending}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
          {loginUser.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
