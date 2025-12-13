import { useState, useEffect } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import CompanyDrawer from "../components/CompanyDrawer";
import { useCompanies } from "../hooks/useCompanies";




const Company = () => { 
  const { listQuery, remove } = useCompanies()
  const [search, setSearch] = useState("");
  const [editTable,setTable] = useState(null)
  const [openModal,setOpenModal] = useState(false)


  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredCompanyies = listQuery?.data?.filter((com) =>
    com.company_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id)=>{
   if(window.confirm("are you sure you want to delete this data")){
     remove.mutate(id)
   }
  }


return (
  <div >
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold">Companies</h1>
      <p className="text-gray-500 text-sm">Manage Company</p>
    </div>

    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-200 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedCompany(null);
          setDrawerMode("add");
          setDrawerOpen(true);
        }}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg w-full sm:w-auto justify-center hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus size={18} /> Add New Company
      </button>

      <button className="border border-gray-200 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
        <RefreshCw size={18} /> Refresh
      </button>
    </div>

    {/* Mobile View (Card Layout) */}
    <div className="grid gap-4 sm:hidden mt-4">
      {filteredCompanyies?.map((com, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              {com.company_name}
            </span>

            <div className="flex gap-4">
              <Eye
                size={20}
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  setSelectedCompany(com);
                  setDrawerMode("view");
                  setDrawerOpen(true);
                }}
              />
              <Edit2
                size={20}
                className="text-green-600 cursor-pointer"
                onClick={() => {
                  setSelectedCompany(com);
                  setDrawerMode("edit");
                  setDrawerOpen(true);
                }}
              />
              <Trash2 
                size={20} 
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(com?._id)}
              />
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Address:</strong> {com.company_address}
            </p>
            <p>
              <strong>GST:</strong> {com.gst || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> {com.description || "N/A"}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Desktop View (Table Layout) */}
    <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 mt-6 p-5 hidden sm:block">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h2 className="text-gray-800 text-lg font-semibold">{filteredCompanyies?.length} Companies Found</h2>

        <div className="flex items-center gap-4 text-gray-600">
          <span>Show:</span>
          <select className="border border-gray-200 rounded-lg px-2 py-1 cursor-pointer">
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-sm text-center">
              <th className="px-5 py-3 font-semibold">Company Name</th>
              <th className="px-5 py-3 font-semibold">Company Address</th>
              <th className="px-5 py-3 font-semibold">GST</th>
              <th className="px-5 py-3 font-semibold">Description</th>
              <th className="px-5 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filteredCompanyies?.map((com, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 hover:bg-blue-50/40 transition-all duration-200 text-center"
              >
                <td className="px-5 py-4">{com.company_name}</td>
                <td className="px-5 py-4">{com.company_address}</td>
                <td className="px-5 py-4">
                  <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow">
                    {com.gst || "N/A"}
                  </span>
                </td>
                <td className="px-5 py-4">{com.description || "N/A"}</td>

                <td className="px-5 py-4 flex justify-center gap-5">
                  <Eye
                    size={20}
                    className="text-blue-500 hover:text-blue-600 hover:scale-125 cursor-pointer transition transform"
                    onClick={() => {
                      setSelectedCompany(com);
                      setDrawerMode("view");
                      setDrawerOpen(true);
                    }}
                  />

                  <Edit2
                    size={20}
                    className="text-green-500 hover:text-green-700 hover:scale-125 cursor-pointer transition transform"
                    onClick={() => {
                      setSelectedCompany(com);
                      setDrawerMode("edit");
                      setDrawerOpen(true);
                    }}
                  />

                  <Trash2
                    size={20}
                    className="text-red-500 hover:text-red-600 hover:scale-125 cursor-pointer transition transform"
                    onClick={() => handleDelete(com?._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <CompanyDrawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      data={selectedCompany}
      mode={drawerMode}
      onSubmit={(formData) => {
        console.log(formData);
        setDrawerOpen(false);
      }}
    />
  </div>
);
}

export default Company