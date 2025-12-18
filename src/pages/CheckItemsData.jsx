import React from "react";

const CheckItemsData = () => {
  return (
    <div className="w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">CheckItems Data</h1>
        <p className="text-gray-500 text-sm">
          Manage check items data dynamically
        </p>
      </div>

      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
        {/* Filters */}
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Assembly Filter */}
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-gray-700 w-full sm:w-auto">
            <option value="">Assembly</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>

          {/* Process Filter */}
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-gray-700 w-full sm:w-auto">
            <option value="">Process</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CheckItemsData;
