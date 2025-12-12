// components/modal/viewModal/ViewProcessDrawer.jsx
import React from "react";
import { X } from "lucide-react";

export default function ViewProcessModal({ open, onClose, data }) {
  if (!open) return null;

  const processData = data || {
    process_no: "N/A",
    process_name: "N/A",
    check_items: "N/A",
    check_time: "N/A",
    responsibility: "N/A",
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Right Slide Drawer */}
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-6 relative animate-slideLeft overflow-y-auto">
        
        {/* Close Button */}
        <button
          className="absolute cursor-pointer right-4 top-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">View Process</h2>

        {/* Process No */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Process No</span>
          <input
            type="text"
            value={processData.process_no}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Process Name */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Process Name</span>
          <input
            type="text"
            value={processData.process_name}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Check Items */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Check Items</span>
          <textarea
            value={processData.check_items}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg h-20 resize-none"
          />
        </label>

        {/* Check Time */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Check Time</span>
          <input
            type="text"
            value={processData.check_time}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Responsibility */}
        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Responsibility</span>
          <input
            type="text"
            value={processData.responsibility}
            readOnly
            className="mt-2 w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-lg"
          />
        </label>

        {/* Slide animation */}
        <style>{`
          @keyframes slideLeft {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slideLeft {
            animation: slideLeft 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
