import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddPlantModal({ open, onClose, onSubmit, editData }) {
  const [plantName, setPlantName] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  // 🟦 When modal opens, auto-fill if editing
  useEffect(() => {
    if (editData) {
      setPlantName(editData.name || "");
      setAddress(editData.address || "");
      setCompany(editData.company || "");
      setDescription(editData.description || "");
    } else {
      setPlantName("");
      setAddress("");
      setCompany("");
      setDescription("");
    }
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = () => {
    const plant = {
      name: plantName,
      address,
      company,
      description,
    };

    onSubmit(plant, editData ? "edit" : "add"); // Mode return

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SLIDING PANEL */}
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-6 relative animate-slideLeft">
        {/* Close Button */}
        <button
          className="absolute cursor-pointer right-4 top-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-6">
          {editData ? "Edit Plant" : "Add New Plant"}
        </h2>

        {/* Plant Name */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">
            Plant Name <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            placeholder="Plant Name"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
          />
        </label>

        {/* Address */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Address</span>
          <input
            type="text"
            placeholder="Address"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        {/* Company */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Company</span>
          <input
            type="text"
            placeholder="Company"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>

        {/* Description */}
        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Description</span>
          <input
            type="text"
            placeholder="Description"
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {editData ? "Update Plant" : "Submit"}
        </button>
      </div>
    </div>
  );
}
