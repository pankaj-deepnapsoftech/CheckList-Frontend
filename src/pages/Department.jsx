import React, { useState } from "react";
import { Search, Plus, Eye, Edit2, Trash2 } from "lucide-react";
import AddDepartmentModal from "../components/modal/addModal/AddDepartmentModal";

const Department = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit | view
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const departments = [
    {
      id: 1,
      department_code: "DEP-001",
      department_name: "Human Resources",
      description: "Employee management and hiring",
    },
    {
      id: 2,
      department_code: "DEP-002",
      department_name: "Engineering",
      description: "Product development",
    },
    {
      id: 3,
      department_code: "DEP-003",
      department_name: "Finance",
      description: "Accounts and budgeting",
    },
  ];

  const filteredDepartments = departments.filter((d) =>
    d.department_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">Departments</h1>
        <p className="text-gray-500 text-sm">Manage department information</p>
      </div>

      {/* Search + Add */}
      <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-300 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search departments..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setMode("add");
            setSelectedDepartment(null);
            setOpenModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-6 p-5">
        <h2 className="font-semibold text-gray-800 text-lg mb-4">
          {filteredDepartments.length} Departments Found
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-5 py-3 font-semibold">Department Code</th>
                <th className="px-5 py-3 font-semibold">Department Name</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredDepartments.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="px-5 py-4">{d.department_code}</td>
                  <td className="px-5 py-4">{d.department_name}</td>
                  <td className="px-5 py-4 max-w-[250px] truncate">
                    {d.description}
                  </td>
                  <td className="px-5 py-4 flex justify-center gap-5">
                    {/* View */}
                    <Eye
                      size={20}
                      className="text-blue-500 cursor-pointer"
                      onClick={() => {
                        setMode("view");
                        setSelectedDepartment(d);
                        setOpenModal(true);
                      }}
                    />

                    {/* Edit */}
                    <Edit2
                      size={20}
                      className="text-green-600 cursor-pointer"
                      onClick={() => {
                        setMode("edit");
                        setSelectedDepartment(d);
                        setOpenModal(true);
                      }}
                    />

                    {/* Delete (UI only) */}
                    <Trash2
                      size={20}
                      className="text-red-500 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AddDepartmentModal    
        openModal={openModal}
        setOpenModal={setOpenModal}
        editData={selectedDepartment}
        mode={mode}
      />
    </div>
  );
};

export default Department;
