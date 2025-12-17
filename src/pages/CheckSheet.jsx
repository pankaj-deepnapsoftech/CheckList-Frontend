import { useState } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import AddCheckSheetModal from "../components/modal/addModal/AddCheckSheetModal";


const checkSheet = Array(5).fill({
  item: "Process 1",
  description: "Description of checkSheet",
  check_list_method: "Lorem Ipsum",
  check_list_time: "Lorem Ipsum",
});

const  CheckSheet=()=>{
  const [search, setSearch] = useState("");
  const [openCheckSheetModal, setOpenCheckSheetModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCheckSheet, setSelectedCheckSheet] = useState(null);
  const filteredCheckSheet = checkSheet.filter((emp) =>
    emp.item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">Approval Check Sheet</h1>
        <p className="text-gray-500 text-sm">Manage Your Approval Check Sheet</p>
      </div>

      {/* Search + Buttons */}
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
        {/* Search Box */}
        <div className="flex justify-between items-center ">
          <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-200 rounded-lg px-3 py-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full outline-none text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 self-center">
          <div className="flex justify-between items-center ">
            <button
              onClick={() => {
                setModalMode("add");
                setSelectedCheckSheet(null);
                setOpenCheckSheetModal(true);
              }}
              className="px-5 py-2 cursor-pointer bg-blue-500 text-white rounded-lg w-full justify-center hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={18} /> Add New Check Sheet
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
          <h2 className="text-gray-800 text-lg font-semibold">
            {filteredCheckSheet.length} Items Found
          </h2>

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

        {/* Mobile View (Card Layout) */}
        <div className="grid gap-4 sm:hidden mt-4">
          {filteredCheckSheet.map((cl, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              {/* Header: Name + actions */}
              <div className="flex items-center flex-wrap justify-between gap-3">
                <span className="bg-blue-500 whitespace-nowrap text-white px-3 py-1 rounded-full text-xs font-medium">
                  {cl.item}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-4">
                  <Eye
                    size={20}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      setModalMode("view");
                      setSelectedCheckSheet(cl);
                      setOpenCheckSheetModal(true);
                    }}
                  />

                  <Edit2
                    size={20}
                    className="text-green-600 cursor-pointer"
                    onClick={() => {
                      setModalMode("edit");
                      setSelectedCheckSheet(cl);
                      setOpenCheckSheetModal(true);
                    }}
                  />

                  <Trash2 size={20} className="text-red-500 cursor-pointer" />
                </div>
              </div>

              {/* More details */}
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Date:</strong>{" "}
                  <span className="">{cl.check_list_method || "N/A"}</span>
                </p>

                <p>
                  <strong>Time:</strong> {cl.check_list_time || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto hidden sm:block w-full rounded-xl border border-gray-200">
          <table className="w-full  text-left">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-sm text-center">
                <th className="px-5 py-3 font-semibold">Item</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Check Sheet Date</th>
                <th className="px-5 py-3 font-semibold">Check Sheet Time</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-gray-700">
              {filteredCheckSheet.map((cl, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50/40 transition-all duration-200 text-center"
                >
                  <td className="px-5 py-4">{cl.item || "N/A"}</td>
                  <td className="px-5 py-4 ">{cl.description || "N/A"}</td>
                  <td className="px-5 py-4 ">
                    {cl.check_list_method || "N/A"}
                  </td>
                  <td className="px-5 py-4 ">{cl.check_list_time || "N/A"}</td>

                  {/* Actions */}
                  <td className="px-5 py-4 flex justify-center gap-5">
                    {/* VIEW */}
                    <Eye
                      size={20}
                      className="text-blue-500 hover:text-blue-600 hover:scale-125 cursor-pointer transition transform"
                      onClick={() => {
                        setModalMode("view");
                        setSelectedCheckSheet(cl);
                        setOpenCheckSheetModal(true);
                      }}
                    />

                    {/* EDIT */}
                    <Edit2
                      size={20}
                      className="text-green-500 hover:text-green-700 hover:scale-125 cursor-pointer transition transform"
                      onClick={() => {
                        setModalMode("edit");
                        setSelectedCheckSheet(cl);
                        setOpenCheckSheetModal(true);
                      }}
                    />

                    {/* DELETE */}
                    <Trash2
                      size={20}
                      className="text-red-500 hover:text-red-600 hover:scale-125 cursor-pointer transition transform"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddCheckSheetModal
        open={openCheckSheetModal}
        onClose={() => setOpenCheckSheetModal(false)}
        mode={modalMode}
        initialData={selectedCheckSheet}
        processes={[
          { _id: "1", process_name: "Process 1" },
          { _id: "2", process_name: "Process 2" },
        ]}
        onSubmit={(data) => {
          if (modalMode === "add") {
            console.log("ADD", data);
            // createCheckSheet.mutate(data)
          } else if (modalMode === "edit") {
            console.log("UPDATE", selectedCheckSheet._id, data);
            // updateCheckSheet.mutate({ id: selectedCheckSheet._id, data })
          }
        }}
      />

     
    </div>
  );
}

export default CheckSheet