import React, { useState, useEffect } from "react";
import { Search, Plus, RefreshCw, Eye, Edit2, Trash2 } from "lucide-react";
import AddPlantModal from "../components/modal/addModal/AddPlantModal";
import { UsePlantName } from "../hooks/UsePlantName";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../Components/Pagination/Pagination";

const PlantName = () => {
  const [page,setPage] = useState(1)
  const [search, setSearch] = useState("");
  const [editTable, setEditTable] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [viewModal, setViewModal] = useState(null)
  const [mode, setMode] = useState("add")
  const { debounce, value } = useDebounce(search)
  const { getPlantName, DeletePlantData, searchQuery } = UsePlantName(value,page)
  const handleDeletePlant  = (id)=>{
    if(window.confirm("Are you sure you want to delete Plant Data")){
      DeletePlantData.mutate(id)
    }
  }

  const filetredData = debounce ? searchQuery?.data ?? [] : getPlantName?.data ?? [] ;


  return (
    <div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">Plants</h1>
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
             
              setEditTable(null);
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
            {filetredData.length} Plants Found
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
          {filetredData?.map((p, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {p.plant_name}
                </span>

                <div className="flex gap-4">
                  <Eye
                    onClick={() => {
                      setMode("view");
                      setViewModal(p)
                      setEditTable(null);
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
                      setOpenModal(true);
                    }}
                  />

                  <Trash2 size={20} className="text-red-500 cursor-pointer" onClick={()=> handleDeletePlant(p?._id)}/>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <strong>Address:</strong> {p.company_id?.company_address}
                </p>
                <p>
                  <strong>Company:</strong> {p.company_id?.company_name}
                </p>
              </div>
            </div>
          ))}
        </div>

    
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
              {filetredData?.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="px-5 py-4">{p.plant_name}</td>
                  <td className="px-5 py-4">{p.company_id?.company_address}</td>
                  <td className="px-5 py-4">{p.company_id?.company_name}</td>

                  <td className="px-5 py-4 flex justify-center gap-5">
                    <Eye
                      onClick={() => {
                        setMode("view");
                        setEditTable(null);
                        setOpenModal(true);
                        setViewModal(p)
                      }}
                      size={20}
                      className="text-blue-500 cursor-pointer hover:scale-125 transition"
                    />
                    <Edit2
                      size={20}
                      className="text-green-600 cursor-pointer hover:scale-125 transition"
                      onClick={() => {
                        setMode("edit");
                        setEditTable(p);
                        setOpenModal(true);
                      }}
                    />

                    <Trash2
                      onClick={()=> handleDeletePlant(p?._id)}
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

    
      <AddPlantModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        editTable={editTable}
        mode={mode}
        viewModal={viewModal}
      />
      <Pagination page={page} setPage={setPage} hasNextpage={filetredData?.length === 10} />
    </div>
  );
}
export default PlantName;