import { useState } from "react";
import { Plus, RefreshCw, Search, Edit2, Trash2 } from "lucide-react";
import Pagination from "../Components/Pagination/Pagination.jsx";
import AddPartsModal from "../components/modal/addModal/AddPartsModal.jsx";

const actionBtn =
  "p-2 rounded-lg transition-all duration-200 flex items-center justify-center hover:shadow-md";

const dummyParts = [
  { _id: "1", part_no: "P-001", part_name: "Gear Box" },
  { _id: "2", part_no: "P-002", part_name: "Shaft" },
  { _id: "3", part_no: "P-003", part_name: "Bearing" },
];

const Parts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [parts, setParts] = useState(dummyParts);

  const [editTable, setEditTable] = useState(null);
  const [viewModal, setViewModal] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");

  const filteredParts = parts.filter(
    (p) =>
      p.part_no.toLowerCase().includes(search.toLowerCase()) ||
      p.part_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this part?")) {
      setParts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">Parts</h1>
        <p className="text-gray-500 text-sm">Manage your parts</p>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white shadow rounded-2xl p-4 mt-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-200 rounded-lg px-3 py-2">
            <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search parts..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditTable(null);
              setViewModal(null);
              setMode("add");
              setOpenModal(true);
            }}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={18} /> Add New Part
          </button>

          <button
            onClick={() => setSearch("")}
            className="px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow mt-6 p-5">
        <h2 className="text-gray-800 text-lg font-semibold mb-4">
          {filteredParts.length} Parts Found
        </h2>

        {/* MOBILE */}
        <div className="grid gap-4 sm:hidden">
          {filteredParts.map((part) => (
            <div key={part._id} className=" rounded-xl p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                  {part.part_no}
                </span>

                <div className="flex gap-2">
                  <button
                    className={`${actionBtn} text-green-600 hover:bg-green-100`}
                    onClick={() => {
                      setEditTable(part);
                      setMode("edit");
                      setOpenModal(true);
                    }}
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    className={`${actionBtn} text-red-500 hover:bg-red-100`}
                    onClick={() => handleDelete(part._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-gray-700 font-medium">{part.part_name}</p>
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="overflow-x-auto hidden sm:block rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-sm text-center">
                <th className="px-5 py-3 font-semibold">Parts No.</th>
                <th className="px-5 py-3 font-semibold">Parts Name</th>
                {/* <th className="px-5 py-3 font-semibold">Check Items</th>
                        <th className="px-5 py-3 font-semibold">Check Time</th> */}
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredParts?.map((pro, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50/40 transition-all duration-200 text-center"
                >
                  <td className="px-5 py-4">{}</td>
                  <td className="px-5 py-4 ">{}</td>
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

        {/* MODAL */}
        <AddPartsModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          mode={mode}
          initialData={editTable}
        />

        {/* PAGINATION (UI ONLY) */}
        <Pagination page={page} setPage={setPage} hasNextpage={false} />
      </div>
    </div>
  );
};

export default Parts;
