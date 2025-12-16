import React, { useState } from "react";
import { X, PlusCircle, Trash2 } from "lucide-react";

export default function AddProcessModal({ open, onClose }) {
 

  if (!open) return null;

  // Add new row

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* PANEL */}
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-6 relative animate-slideLeft overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute cursor-pointer right-4 top-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Add New Process</h2>

        {/* Process No */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Process No.</span>
          <input
            type="text"
            placeholder="Enter Process No."
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </label>

        {/* Process Name */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Process Name</span>
          <input
            type="text"
            placeholder="Enter Process Name"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </label>


        
        {/* Responsibility */}
        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Responsibility</span>
          <select
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            defaultValue=""
          >
            <option value="" disabled>Select Responsibility</option>
            <option>Person A</option>
            <option>Person B</option>
            <option>Person C</option>
          </select>
        </label>

        {/* Submit */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
          Submit
        </button>
      </div>
    </div>
  );
}
