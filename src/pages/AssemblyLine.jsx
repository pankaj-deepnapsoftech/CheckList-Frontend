import React, { useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Edit2,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Assembly Line</h1>
          <p className="text-gray-500 text-sm">
            Manage all assembly lines efficiently
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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


        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-500 text-white px-4 py-2 w-full sm:w-auto rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
          >
            <Plus size={18} /> Add New Assembly
          </button>

          <button className="border border-gray-300 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 mt-6 p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="font-semibold text-gray-800 text-lg">
            {data.length} Records Found
          </h2>

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

        {/* ============ MOBILE CARDS ============ */}
        <div className="grid gap-4 sm:hidden">
          {data.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.no} — {item.name}
                  </p>
                  <p className="text-sm text-gray-500">{item.process}</p>
                </div>

                <div className="flex gap-4">
                  <Edit2
                    size={20}
                    className="text-blue-600 cursor-pointer hover:scale-110"
                  />
                  <Trash2
                    size={20}
                    className="text-red-500 cursor-pointer hover:scale-110"
                  />
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Company:</strong> -
                </p>
                <p>
                  <strong>Plant:</strong> -
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ============ DESKTOP TABLE ============ */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                <th className="px-5 py-3 font-semibold">Assembly Line No.</th>
                <th className="px-5 py-3 font-semibold">Assembly Line Name</th>
                <th className="px-5 py-3 font-semibold">
                  Assembly Line Process
                </th>
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold">Plant</th>
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

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-5">
                      <Edit2
                        size={18}
                        className="text-blue-500 cursor-pointer hover:scale-125 transition"
                      />
                      <Trash2
                        size={18}
                        className="text-red-500 cursor-pointer hover:scale-125 transition"
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

      {/* ADD MODAL */}
      <AssemblyLineModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
