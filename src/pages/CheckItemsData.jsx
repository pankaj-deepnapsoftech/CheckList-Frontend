import React, { useState } from "react";

const CheckItemsData = () => {
  const [isActive, setIsActive] = useState("yes");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Check Items
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure and manage quality check items
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <select className="w-full sm:w-52 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">Select Assembly</option>
              <option value="">Assembly 1</option>
              <option value="">Assembly 2</option>
            </select>

            <select className="w-full sm:w-52 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">Select Process</option>
              <option value="">Process 1</option>
              <option value="">Process 2</option>
            </select>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-md">
          
          {/* FORM HEADER */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lorem Ipsum
            </h2>
            <p className="text-sm text-gray-500">
              Enter check item information
            </p>
          </div>

          {/* FORM BODY */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Check Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check Item Name
                </label>
                <input
                  type="text"  
                  placeholder="Ex: Visual inspection"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={isActive === "yes"}
                      onChange={() => setIsActive("yes")}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      Active
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isActive"
                      checked={isActive === "no"}
                      onChange={() => setIsActive("no")}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      Inactive
                    </span>
                  </label>
                
              </div>
            </div>
          </div>

          {/* FORM FOOTER */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
              Cancel
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow">
              Save Check Item
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckItemsData;
