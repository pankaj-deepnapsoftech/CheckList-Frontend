import React, { useState, useEffect } from "react";
import { Search, Plus, RefreshCw, Eye, Edit2, Trash2 } from "lucide-react";
import AddPlantModal from "../components/modal/addModal/AddPlantModal";

export default function PlantName() {
  const [search, setSearch] = useState("");
  const [plants, setPlants] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [mode, setMode] = useState("add"); // add | edit | view
  const [selectedPlant, setSelectedPlant] = useState(null);

  const [editData, setEditData] = useState(null);

  useEffect(() => {
    setPlants([
      {
        name: "Lorem Ipsum",
        address: "Cyber City, Gurugram",
        company: "Lorem Ipsum",
        description: "Lorem Ipsum is dummy text",
      },
      {
        name: "Dolor Sit",
        address: "MG Road, Bengaluru",
        company: "Dolor Inc",
        description: "Dolor Sit Amet",
      },
      {
        name: "Amet Consectetur",
        address: "Koramangala, Bengaluru",
        company: "Consectetur Ltd",
        description: "Amet Consectetur Dummy",
      },
    ]);
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">Plants</h1>
        <p className="text-gray-500 text-sm">Manage plant information</p>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-300 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search plants..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <button
            onClick={() => {
              setMode("add");
              setSelectedPlant(null);
              setEditData(null);
              setOpenModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 w-full sm:w-auto rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
          >
            <Plus size={18} /> Add New Plant
          </button>

          <button className="border border-gray-300 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-6 p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="font-semibold text-gray-800 text-lg">
            {plants.length} Plants Found
          </h2>

          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-sm font-medium">Show:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 hover:border-gray-400 cursor-pointer">
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
        </div>

        {/* Mobile View */}
        <div className="grid gap-4 sm:hidden">
          {plants.map((p, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {p.name}
                </span>

                <div className="flex gap-4">
                  <Eye
                    onClick={() => {
                      setMode("view");
                      setSelectedPlant(p);
                      setEditData(null);
                      setOpenModal(true);
                    }}
                    size={20}
                    className="text-blue-500 cursor-pointer"
                  />
                  <Edit2
                    size={20}
                    className="text-green-600 cursor-pointer hover:scale-125 transition"
                    onClick={() => {
                      setMode("edit");
                      setEditData(p);
                      setSelectedPlant(null);
                      setOpenModal(true);
                    }}
                  />

                  <Trash2 size={20} className="text-red-500 cursor-pointer" />
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <strong>Address:</strong> {p.address}
                </p>
                <p>
                  <strong>Company:</strong> {p.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                <th className="px-5 py-3 font-semibold">Plant Name</th>
                <th className="px-5 py-3 font-semibold">Address</th>
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {plants.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="px-5 py-4">{p.name}</td>
                  <td className="px-5 py-4">{p.address}</td>
                  <td className="px-5 py-4">{p.company}</td>

                  <td className="px-5 py-4 flex justify-center gap-5">
                    <Eye
                      onClick={() => {
                        setMode("view");
                        setSelectedPlant(p);
                        setEditData(null);
                        setOpenModal(true);
                      }}
                      size={20}
                      className="text-blue-500 cursor-pointer hover:scale-125 transition"
                    />
                    <Edit2
                      size={20}
                      className="text-green-600 cursor-pointer hover:scale-125 transition"
                      onClick={() => {
                        setMode("edit");
                        setEditData(p);
                        setSelectedPlant(null);
                        setOpenModal(true);
                      }}
                    />

                    <Trash2
                      size={20}
                      className="text-red-500 cursor-pointer hover:scale-125 transition"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SINGLE MODAL FOR ADD | EDIT | VIEW */}
      <AddPlantModal
        open={openModal}
        mode={mode}
        editData={editData}
        viewData={selectedPlant}
        onClose={() => {
          setOpenModal(false);
          setEditData(null);
          setSelectedPlant(null);
        }}
        onSubmit={(plant, actionMode) => {
          if (actionMode === "add") {
            setPlants([...plants, plant]);
          } else if (actionMode === "edit") {
            setPlants(
              plants.map((x) => (x.name === editData.name ? plant : x))
            );
          }
        }}
      />
    </div>
  );
}
