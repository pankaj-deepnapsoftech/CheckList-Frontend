import { useEffect, useState } from "react";
import { RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import CompanyDrawer from "../Components/modal/addModal/CompanyDrawer";
import { useCompanies } from "../hooks/useCompanies";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../Components/Pagination/Pagination";

const Company = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1)
  const [editTable, setEditTable] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [viewModal, setViewModal] = useState(null)
  const [mode, setMode] = useState("add")
  const { debounce, value } = useDebounce(search)
  const { listQuery, remove, searchQuery } = useCompanies(value, page);
  const filteredCompanies = debounce ? searchQuery?.data ?? [] : listQuery?.data ?? [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      remove.mutate(id);
    }
  };
  const handleRefresh = () => {
    listQuery.refetch()
  }

  return (
    <div className="p-4 sm:p-6 w-full">

      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">Companies</h1>
        <p className="text-gray-500 text-sm">Manage Company</p>
      </div>


      <div className="bg-white shadow rounded-2xl p-4 mt-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditTable(null);
              setOpenModal(true);
              setMode("add")
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Company
          </button>

          <button onClick={handleRefresh} className="border px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>


      <div className="grid gap-4 sm:hidden mt-4">
        {filteredCompanies?.map((com) => (
          <div
            key={com._id}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                {com.company_name}
              </span>

              <div className="flex gap-4">
                <Eye onClick={() => { setOpenModal(true); setViewModal(com); setMode("view") }} size={18} className="text-blue-500 cursor-pointer" />
                <Edit2
                  size={18}
                  className="text-green-600 cursor-pointer"
                  onClick={() => {
                    setEditTable(com);
                    setOpenModal(true);
                    setMode("edit")
                  }}
                />
                <Trash2
                  size={18}
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(com._id)}
                />
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p><strong>Address:</strong> {com.company_address}</p>
              <p><strong>GST:</strong> {com.gst_no || "N/A"}</p>
              <p><strong>Description:</strong> {com.description || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>


      <div className="hidden sm:block mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="bg-gray-100 text-center text-sm">
              <th className="px-5 py-3">Company Name</th>
              <th className="px-5 py-3">Address</th>
              <th className="px-5 py-3">GST</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCompanies?.map((com) => (
              <tr
                key={com._id}
                className="border-b hover:bg-blue-50 text-center"
              >
                <td className="px-5 py-4">{com.company_name}</td>
                <td className="px-5 py-4">{com.company_address}</td>
                <td className="px-5 py-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                    {com.gst_no || "N/A"}
                  </span>
                </td>
                <td className="px-5 py-4">{com.description || "N/A"}</td>
                <td className="px-5 py-4 flex justify-center gap-5">
                  <Eye onClick={() => { setOpenModal(true); setViewModal(com); setMode("view") }} className="text-blue-500 cursor-pointer" />
                  <Edit2
                    className="text-green-500 cursor-pointer"
                    onClick={() => {
                      setEditTable(com);
                      setOpenModal(true);
                      setMode("edit")
                    }}
                  />
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(com._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <CompanyDrawer
        openModal={openModal}
        setOpenModal={setOpenModal}
        editTable={editTable}
        viewModal={viewModal}
        mode={mode}
      />
      <Pagination page={page} setPage={setPage} hasNextpage={listQuery?.data?.length === 10} />
    </div>
  );
};

export default Company;
