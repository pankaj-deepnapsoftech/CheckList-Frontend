import React, { useState } from "react";
import ProductionVideo from "../../assets/ProductionVideo.mp4";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export default function ForgetPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassoword } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: (values) => {
      forgotPassoword.mutate(values, {
        onSuccess: () => {
          setEmailSent(true);
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

      {/* Forgot Password Box */}
      <div
        className="
          relative z-10 w-full max-w-md 
          bg-white/20 backdrop-blur-xl 
          shadow-2xl rounded-2xl 
          p-10 pt-20 border border-white/30 
          min-h-[400px]
        "
      >
        {/* Circle With SVG */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 
          w-24 h-24 rounded-full bg-gray-300 shadow-xl flex items-center justify-center"
        >
          <img
            src="https://jpmgroup.co.in/assets/svg/logo-color.svg"
            alt="logo"
            className="w-14 h-14"
          />
        </div>

        {!emailSent ? (
          <form onSubmit={formik.handleSubmit}>
            <h2 className="text-3xl font-semibold text-center text-white mb-10">
              Forgot Password
            </h2>

            <label className="block mb-6">
              <span className="text-white font-medium">Email Address</span>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="
                    w-full pl-10 pr-4 py-3 
                    bg-white backdrop-blur-sm 
                    border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </label>

            <button
              type="submit"
              disabled={forgotPassoword.isPending}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPassoword.isPending ? "Sending..." : "Send Reset Link"}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 mt-6 text-white"
            >
              <span>Back to Login</span>
            </Link>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Check Your Email
            </h2>

            <button
              onClick={() => setEmailSent(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              Try Again
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
