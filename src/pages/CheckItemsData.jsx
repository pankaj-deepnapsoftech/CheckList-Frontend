import React, { useState } from "react";

const CheckItemsData = () => {
  const [isActive, setIsActive] = useState("yes");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          CheckItems Data
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage check items data dynamically
        </p>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <select className="w-full sm:w-48 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Assembly</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>

          <select className="w-full sm:w-48 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Process</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white mt-6 rounded-2xl border border-gray-100 shadow-md p-5 sm:p-7">
        <div className="border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Lorem Ipsum
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the check item details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Check Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check Item Name
            </label>
            <input
              type="text"
              placeholder="Enter item name"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Is Active */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Is Active
            </label>

            <div className="flex items-center gap-6 rounded-xl border border-gray-300 px-4 py-3">
              {/* YES */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  value="yes"
                  checked={isActive === "yes"}
                  onChange={() => setIsActive("yes")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>

              {/* NO */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  value="no"
                  checked={isActive === "no"}
                  onChange={() => setIsActive("no")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
            Cancel
          </button>
          <button className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckItemsData;
