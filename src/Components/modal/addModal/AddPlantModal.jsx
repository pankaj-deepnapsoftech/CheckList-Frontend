import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddPlantModal({
  open,
  onClose,
  onSubmit,
  editData,
  viewData,
  mode = "add", // add | edit | view
}) {
  const [plantName, setPlantName] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const isView = mode === "view";

  useEffect(() => {
    const src = editData || viewData;

    if (src) {
      setPlantName(src.name || "");
      setAddress(src.address || "");
      setCompany(src.company || "");
      setDescription(src.description || "");
    } else {
      setPlantName("");
      setAddress("");
      setCompany("");
      setDescription("");
    }
  }, [editData, viewData, mode, open]);

  if (!open) return null;

  const handleSubmit = () => {
    const plant = {
      name: plantName,
      address,
      company,
      description,
    };

    if (!isView) {
      onSubmit(plant, mode);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Right Panel */}
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-6 relative animate-slideLeft">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6">
          {mode === "add"
            ? "Add New Plant"
            : mode === "edit"
            ? "Edit Plant"
            : "View Plant"}
        </h2>

        {/* Fields */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">
            Plant Name{" "}
            {mode !== "view" && <span className="text-red-500">*</span>}
          </span>
          <input
            type="text"
            placeholder="Plant Name"
            value={plantName}
            readOnly={isView}
            className={`mt-2 w-full px-4 py-3 border rounded-lg ${
              isView
                ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            }`}
            onChange={(e) => setPlantName(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Address</span>
          <textarea
            placeholder="Address"
            value={address}
            readOnly={isView}
            className={`mt-2 w-full px-4 py-3 border rounded-lg h-20 resize-none ${
              isView
                ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            }`}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Company</span>
          <input
            type="text"
            placeholder="Company"
            value={company}
            readOnly={isView}
            className={`mt-2 w-full px-4 py-3 border rounded-lg ${
              isView
                ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            }`}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Description</span>
          <textarea
            placeholder="Description"
            value={description}
            readOnly={isView}
            className={`mt-2 w-full px-4 py-3 border rounded-lg h-24 resize-none ${
              isView
                ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            }`}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {/* Submit Button (hidden in view mode) */}
        {!isView && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {mode === "add" ? "Submit" : "Update Plant"}
          </button>
        )}
      </div>
    </div>
  );
}
