//@ts-nocheck
import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  RefreshCw,
  RotateCcw,
  Download,
  Edit2,
  Delete,
  Trash2,
} from "lucide-react";
import AssemblyLineModal from "../components/modal/addModal/AddNewAssembly";

export default function AssemblyLine() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const data = [
    {
      no: "001",
      name: "ASS 1",
      process: "PCB Depaneling",
    },
    {
      no: "002",
      name: "ASS 2",
      process: "PCB Depaneling",
    },
    {
      no: "003",
      name: "ASS 3",
      process: "PCB Depaneling",
    },
  ];

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Assembly Line</h1>
          <p className="text-gray-500 text-sm">
            Manage all assembly lines efficiently
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-500 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-600 transition flex items-center gap-2"
        >
          <Plus size={18} /> Add New Assembly
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white shadow-sm rounded-2xl p-4 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Box */}
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-200 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 text-gray-500">
          <Filter className="cursor-pointer hover:text-gray-700" />
          <RefreshCw className="cursor-pointer hover:text-gray-700" />
          <RotateCcw className="cursor-pointer hover:text-gray-700" />
          <Download className="cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 mt-6 p-5">
        {/* TABLE HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="font-semibold text-gray-800 text-lg">
            {data.length} Records Found
          </h2>

          {/* Show Dropdown */}
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-sm font-medium">Show:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 hover:border-gray-400 cursor-pointer transition">
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                <th className="px-5 py-3 font-semibold">Assembly Line No.</th>
                <th className="px-5 py-3 font-semibold">Assembly Line Name</th>
                <th className="px-5 py-3 font-semibold">
                  Assembly Line Process
                </th>
                <th className="px-5 py-3 font-semibold">Company name</th>
                <th className="px-5 py-3 font-semibold">Plant name</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {data.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50/40 transition"
                >
                  <td className="px-5 py-4 text-sm">{item.no}</td>
                  <td className="px-5 py-4 text-sm">{item.name}</td>
                  <td className="px-5 py-4 text-sm">{item.process}</td>
                  <td className="px-5 py-4 text-sm">-</td>
                  <td className="px-5 py-4 text-sm">-</td>

                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <Edit2
                        size={18}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer hover:scale-125 transition"
                      />
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-700 cursor-pointer hover:scale-125 transition"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-3 mt-6">
          <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition text-sm">
            Previous
          </button>

          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium shadow text-sm">
            1
          </button>

          <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition text-sm">
            Next
          </button>
        </div>
      </div>

      {/* ADD ASSEMBLY LINE MODAL */}
      <AssemblyLineModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
