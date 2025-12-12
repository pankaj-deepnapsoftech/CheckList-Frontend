import { useState,useEffect } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import CompanyDrawer from "../components/CompanyDrawer";
import AddProcessModal from "../components/modal/addModal/AddProcessModal";


const Processes = Array(10).fill({
  id: 1,
  process_no: "001",
  process_name: "123 Main St, Cityville",
  check_item: "Leading manufacturer of industrial equipment.",
  check_time: "2023-10-01 10:00 AM",
  responsibility : "27AAEPM1234C1Z5",
});

const  Process=()=>{

  const [search, setSearch] = useState("");

  const [openDrawer, setOpenDrawer] = useState(false);

  const filteredProcesses = Processes.filter((pro) =>
    pro.process_name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="p-4 sm:p-6 w-full">

      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">Process</h1>
        <p className="text-gray-500 text-sm">Manage your Processes</p>
      </div>

      {/* Search + Buttons */}
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Search Box */}
       <div className="flex justify-between items-center ">

       <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-200 rounded-lg px-3 py-2">
       <Search size={20} className="text-gray-500" />
       <input
        type="text"
        placeholder="Search companyies..."
        className="w-full outline-none text-gray-700"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
       />
       </div>

        
      </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
        <div className="flex justify-between items-center ">
        
        <button
         onClick={() => {
         setOpenDrawer(true);
        }}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
           Add New Process
        </button>
       
       </div>

          <button className="border border-gray-200 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>

        </div>


      </div>
      

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 mt-6 p-5">

  {/* Header: Count + Show Dropdown */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
    <h2 className="text-gray-800 text-lg font-semibold">{filteredProcesses.length} Process Found</h2>

    {/* Show Dropdown */}
    <div className="flex items-center gap-4 text-gray-600">
      <span>Show:</span>
      <select className="border border-gray-200 rounded-lg px-2 py-1 cursor-pointer">
        <option>5</option>
        <option>10</option>
        <option>15</option>
      </select>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto rounded-xl border border-gray-200">
  <table className="w-full min-w-[700px] text-left">
    {/* Table Header */}
    <thead>
      <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-sm text-center">
        <th className="px-5 py-3 font-semibold">Process No.</th>
        <th className="px-5 py-3 font-semibold">Process Name</th>
        <th className="px-5 py-3 font-semibold">Check Items</th>
        <th className="px-5 py-3 font-semibold">Check Time</th>
        <th className="px-5 py-3 font-semibold text-center">Responsibility</th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody className="text-gray-700">
      {filteredProcesses.map((pro, i) => (
        <tr
          key={i}
          className="border-b border-gray-200 hover:bg-blue-50/40 transition-all duration-200 text-center"
        >
          <td className="px-5 py-4">{pro.process_no}</td>
          <td className="px-5 py-4">{pro.process_name}</td>
          <td className="px-5 py-4">
            <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow">
              {pro.check_items || "N/A"}
            </span>
          </td>
          <td className="px-5 py-4">
            <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow">
              {pro.check_time || "N/A"}
            </span>
          </td>
          <td className="px-5 py-4">{pro.responsibility || "N/A"}</td>


        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>

<AddProcessModal open={openDrawer} onClose={() => setOpenDrawer(false)}/>

  </div>
  );
}

export default Process