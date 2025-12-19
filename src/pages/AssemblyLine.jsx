import React, { useState } from "react";
import { Search, Plus, RefreshCw, Edit2, Trash2, Eye } from "lucide-react";
import AssemblyLineModal from "../components/modal/addModal/AddNewAssembly";
import { useAssemblyLine } from "../hooks/useAssemblyLine";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../Components/Pagination/Pagination";
import Refresh from "../components/Refresh/Refresh";

export default function AssemblyLine() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editTable, setEditTable] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [limit, setLimit] = useState(10);
  const [mode, setMode] = useState("add");
  const { debounce, value } = useDebounce(search);
  const { getAssemblyLineData, searchQuery, DeleteAssemblyLine } = useAssemblyLine(value, page, limit);
  const data = debounce ? searchQuery?.data ?? [] : getAssemblyLineData?.data ?? [];
  const [showRefresh, setShowRefresh] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Assembly Line?")) {
      DeleteAssemblyLine.mutate(id);
    }
  };

  const handleRefresh = async () => {
    setPage(1);
    setSearch("");
    setShowRefresh(true);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    await Promise.all([getAssemblyLineData.refetch(), minDelay]);
    setShowRefresh(false);
  };

  const openModalHandler = (mode, item = null) => {
    setMode(mode);
    setEditTable(item);       
    setViewModal(mode === "view" ? item : null);
    setOpenModal(true);
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Assembly Line</h1>
          <p className="text-gray-500 text-sm">Manage all assembly lines efficiently</p>
        </div>
      </div>

      {/* Search and Buttons */}
      <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-300 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search assembly line..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <button
            onClick={() => openModalHandler("add")}
            className="bg-blue-500 text-white px-4 py-2 w-full sm:w-auto rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
          >
            <Plus size={18} /> Add New Assembly
          </button>

          <button
            onClick={handleRefresh}
            className="border border-gray-300 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700"
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative min-h-[300px] bg-white rounded-2xl shadow-md border border-gray-100 mt-6 p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="font-semibold text-gray-800 text-lg">{data?.length} Records Found</h2>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-sm font-medium">Show:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 hover:border-gray-400 cursor-pointer transition focus:outline-none focus:ring-0"
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            >
              <option>5</option>
              <option>10</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>

        {showRefresh ? (
          <Refresh />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                  <th className="px-5 py-3 font-semibold">Assembly Line No.</th>
                  <th className="px-5 py-3 font-semibold">Assembly Line Name</th>
                  <th className="px-5 py-3 font-semibold">Processes</th>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Plant</th>
                  <th className="px-5 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {data?.map((item) => (
                  <tr key={item._id} className="border-b border-gray-200 hover:bg-blue-50/40 transition">
                    <td className="px-5 py-4 text-sm">{item?.assembly_number}</td>
                    <td className="px-5 py-4 text-sm">
                      <span className="inline-flex items-center justify-center bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                        {item?.assembly_name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {item?.process_id?.map((p) => (
                        <p key={p._id}>{p.process_name} ({p.process_no})</p>
                      ))}
                    </td>
                    <td className="px-5 py-4 text-sm">{item?.company_id?.company_name}</td>
                    <td className="px-5 py-4 text-sm">{item?.plant_id?.plant_name}</td>
                    <td className="px-5 py-4">
                      
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => openModalHandler("assign", item)}
                          className="px-3 py-1 bg-blue-600 text-white text-[13px] font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                        >
                          Assign
                        </button>
                        <Eye onClick={() => openModalHandler("view", item)} size={18} className="text-blue-500 cursor-pointer" />
                        <Edit2 onClick={() => openModalHandler("edit", item)} size={18} className="text-green-600 cursor-pointer" />
                        <Trash2 onClick={() => handleDelete(item._id)} size={18} className="text-red-500 cursor-pointer" />
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AssemblyLineModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        editTable={editTable}
        viewModal={viewModal}
        mode={mode}
      />
      <Pagination page={page} setPage={setPage} hasNextpage={data?.length === limit} />
    </div>
  );
}
