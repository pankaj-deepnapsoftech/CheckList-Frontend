import React from "react";
import { X } from "lucide-react";

export default function UserRoleModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SLIDING PANEL */}
      <div
        className="
          ml-auto h-full w-full max-w-md bg-white shadow-xl 
          p-6 relative animate-slideLeft
        "
      >
        {/* Close Button */}
        <button
          className="absolute cursor-pointer right-4 top-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Add New Role</h2>

        {/* Role */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">
            Role <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            placeholder="Role"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        {/* Description */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Description</span>
          <input
            type="text"
            placeholder="Description"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        {/* Permissions */}
        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Permissions</span>
          <select
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Select</option>
            <option>View</option>
            <option>Edit</option>
            <option>Delete</option>
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
