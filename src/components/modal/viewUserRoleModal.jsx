import React from "react";
import { X } from "lucide-react";

export default function ViewUserRoleModal({ open, onClose, data }) {
  if (!open) return null;

  // Dummy data fallback (Future API se ye data aayega)
  const roleData = data || {
    role: "IMPR",
    description: "Import / Purchase role with read + edit permissions",
    createdOn: "10/12/2025",
    updatedOn: "10/12/2025",
    permissions: ["View", "Edit"],
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Right Slide Panel */}
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

        <h2 className="text-xl font-semibold mb-6">View Role</h2>

        {/* Role */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Role</span>
          <input
            type="text"
            value={roleData.role}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Description */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Description</span>
          <textarea
            value={roleData.description}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg h-24 resize-none"
          />
        </label>

        {/* Created On */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Created On</span>
          <input
            type="text"
            value={roleData.createdOn}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Updated On */}
        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Last Updated</span>
          <input
            type="text"
            value={roleData.updatedOn}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Permissions */}

        {/* <div className="mb-6">
          <span className="text-gray-700 font-medium">Permissions</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {roleData?.permissions?.map((p, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
