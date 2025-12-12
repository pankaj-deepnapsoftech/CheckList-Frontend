import React, { useState } from "react";
import { X, PlusCircle, Trash2 } from "lucide-react";

export default function AddProcessModal({ open, onClose }) {
  const [checkItems, setCheckItems] = useState([
    { name: "", min: "", max: "" }
  ]);

  if (!open) return null;

  // Add new row
  const addCheckItem = () => {
    setCheckItems([...checkItems, { name: "", min: "", max: "" }]);
  };

  // Update row
  const updateCheckItem = (index, field, value) => {
    const updated = [...checkItems];
    updated[index][field] = value;
    setCheckItems(updated);
  };

  // Remove row
  const removeCheckItem = (index) => {
    setCheckItems(checkItems.filter((_, i) => i !== index));
  };

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

        {/* ------- MULTIPLE CHECK ITEMS START ------- */}
        <span className="text-gray-700 font-medium">Check Items</span>

        <div className="space-y-4 mt-3 mb-6">
          {checkItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            >
              {/* Item + Remove Button */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">
                  Item {index + 1}
                </span>

                {checkItems.length > 1 && (
                  <button
                    onClick={() => removeCheckItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Check Item Name */}
              <input
                type="text"
                placeholder="Enter Check Item"
                value={item.name}
                onChange={(e) => updateCheckItem(index, "name", e.target.value)}
                className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              {/* Min & Max Row */}
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={item.min}
                  onChange={(e) =>
                    updateCheckItem(index, "min", e.target.value)
                  }
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="number"
                  placeholder="Max"
                  value={item.max}
                  onChange={(e) =>
                    updateCheckItem(index, "max", e.target.value)
                  }
                  className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          ))}

          {/* Add New Item Button */}
          <button
            onClick={addCheckItem}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <PlusCircle size={20} />
            Add Item
          </button>
        </div>

        {/* ------- MULTIPLE CHECK ITEMS END ------- */}

        {/* Checking Method */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Checking Method</span>
          <select
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            defaultValue=""
          >
            <option value="" disabled>Select Check Method</option>
            <option>Method 1</option>
            <option>Method 2</option>
            <option>Method 3</option>
          </select>
        </label>

        {/* Check Time */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Check Time</span>
          <select
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            defaultValue=""
          >
            <option value="" disabled>Select Check Time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
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
