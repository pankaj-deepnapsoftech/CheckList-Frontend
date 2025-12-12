import React from "react";
import { X } from "lucide-react";

export default function ViewPlantModal({ open, onClose, data }) {
  if (!open) return null;

  // Dummy fallback data (future API will override this)
  const plantData = data || {
    name: "Lorem Ipsum Plant",
    address: "Cyber City, Gurugram",
    company: "Lorem Ipsum Pvt Ltd",
    description: "This is a sample plant used for viewing.",
    createdOn: "12/12/2025",
    updatedOn: "12/12/2025",
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
        {/* Close Btn */}
        <button
          className="absolute cursor-pointer right-4 top-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">View Plant</h2>

        {/* Plant Name */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Plant Name</span>
          <input
            type="text"
            value={plantData.name}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Address */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Address</span>
          <textarea
            value={plantData.address}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg h-20 resize-none"
          />
        </label>

        {/* Company */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Company</span>
          <input
            type="text"
            value={plantData.company}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Description */}
        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Description</span>
          <textarea
            value={plantData.description}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg h-24 resize-none"
          />
        </label>       
      </div>
    </div>
  );
}
