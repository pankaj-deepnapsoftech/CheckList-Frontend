import React from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function ManageWorkflow() {
  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">

      {/* FLOATING BACKGROUND SHAPES */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 bg-white border border-blue-100 shadow-xl rounded-3xl p-10 max-w-xl w-full text-center"
      >
        {/* ICON */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mx-auto mb-6 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center"
        >
          <Rocket className="w-8 h-8 text-blue-600" />
        </motion.div>

        {/* TITLE */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
          Coming
          <span className="text-blue-600"> Soon</span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-600 mt-4 text-sm sm:text-base">
          We’re working hard to bring you something amazing.  
          This feature will be available very soon.
        </p>

        {/* DIVIDER */}
        <div className="w-20 h-1 bg-blue-500 rounded-full mx-auto my-6" />
      </motion.div>
    </div>
  );
}
