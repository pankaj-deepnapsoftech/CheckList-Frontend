import { useState } from "react";
import { Plus, RefreshCw, Search, Edit2, Trash2 } from "lucide-react";
import AddProcessModal from "../components/modal/addModal/AddProcessModal";
import { useProcess } from "../hooks/useProcess.js";
import { useDebounce } from "../hooks/useDebounce.js";
import Pagination from "../Components/Pagination/Pagination.jsx";

const actionBtn =
  "p-2 rounded-lg transition-all duration-200 flex items-center justify-center hover:shadow-md";

const Process = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editTable, setEditTable] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [mode, setMode] = useState("add");
  const { debounce, value } = useDebounce(search);
  const { getProcessData, DeleteProcess, searchQuery } = useProcess(
    value,
    page
  );
  console.log(value);
  const filteredProcesses = debounce
    ? searchQuery?.data ?? []
    : getProcessData?.data ?? [];
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Process Data?")) {
      DeleteProcess.mutate(id);
    }
  };
  return (
    <div className="w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">Process</h1>
        <p className="text-gray-500 text-sm">Manage your Processes</p>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-300 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search process..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="flex justify-between items-center ">
            <button
              onClick={() => {
                setEditTable(null);
                setOpenModal(true);
                setViewModal(null);
                setMode("add");
              }}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg w-full justify-center hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={18} /> Add New Process
            </button>
          </div>

          <button className="border border-gray-200 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 mt-6 p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-1">
          <h2 className="text-gray-800 text-lg font-semibold">
            {filteredProcesses?.length} Process Found
          </h2>

          <div className="flex items-center gap-4 text-gray-600">
            <span>Show:</span>
            <select className="border border-gray-200 rounded-lg px-2 py-1 cursor-pointer">
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
        </div>

        <div className="sm:hidden space-y-3 mt-4">
          {filteredProcesses?.map((pro, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {pro?.process_no}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setOpenModal(true);
                      setMode("edit");
                      setEditTable(pro);
                    }}
                    className="p-2 rounded-lg text-green-600 hover:bg-green-100"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(pro?._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Process Name */}
              <p className="mt-2 text-sm font-medium text-gray-800">
                {pro.process_name}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto hidden sm:block rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-sm text-center">
                <th className="px-5 py-3 font-semibold">Process No.</th>
                <th className="px-5 py-3 font-semibold">Process Name</th>
                {/* <th className="px-5 py-3 font-semibold">Check Items</th>
                <th className="px-5 py-3 font-semibold">Check Time</th> */}
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredProcesses?.map((pro, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50/40 transition-all duration-200 text-center"
                >
                  <td className="px-5 py-4">{pro.process_no}</td>
                  <td className="px-5 py-4 "><span className="inline-flex items-center justify-center bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">{pro.process_name}</span></td>
                  {/* <td className="px-5 py-4">
                    <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow whitespace-nowrap">
                      {pro.check_items || "N/A"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow whitespace-nowrap">
                      {pro.check_time || "N/A"}
                    </span>
                  </td> */}
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Edit"
                        className={`${actionBtn} text-green-600 hover:bg-green-100`}
                        onClick={() => {
                          setOpenModal(true);
                          setMode("edit");
                          setEditTable(pro);
                        }}
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        title="Delete"
                        className={`${actionBtn} text-red-500 hover:bg-red-100`}
                      >
                        <Trash2
                          size={18}
                          onClick={() => handleDelete(pro?._id)}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddProcessModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          editTable={editTable}
          viewModal={viewModal}
          mode={mode}
        />
        <Pagination
          page={page}
          setPage={setPage}
          hasNextpage={filteredProcesses?.length === 10}
        />
      </div>
    </div>
  );
};

export default Process;
