import React, { useState } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import UserRoleModal from "../components/modal/addModal/AddUserRoleModal";
import ViewUserRoleModal from "../components/modal/viewUserRoleModal";

export default function UserRoles() {
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAddRole = (roleData) => {
    console.log("Add Role API →", roleData);
  };

  const handleUpdateRole = (roleData) => {
    console.log("Update Role API →", roleData);
  };

  const roles = [
    {
      role: "IMPR",
      description: "IMPR",
      createdOn: "10/12/2025",
      updatedOn: "10/12/2025",
    },
    {
      role: "Sales & production",
      description: "Sales",
      createdOn: "10/12/2025",
      updatedOn: "10/12/2025",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">User Roles</h1>
        <p className="text-gray-500 text-sm">
          Manage user roles and permissions
        </p>
      </div>

      {/* Search + Buttons */}
      <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Box */}
        <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-300 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search roles..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <button
            onClick={() => {
              setSelectedRole(null);
              setModalMode("add");
              setModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 w-full sm:w-auto rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
          >
            <Plus size={18} /> Add New Role
          </button>

          <button className="border border-gray-300 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-6 p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="font-semibold text-gray-800 text-lg">
            {roles.length} Roles Found
          </h2>

          {/* Show Dropdown */}
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-sm font-medium">Show:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 hover:border-gray-400 cursor-pointer">
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
        </div>

        {/* Mobile View Cards */}
        <div className="grid gap-4 sm:hidden">
          {roles.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {item.role}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-4">
                  <Eye
                    size={20}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      setSelectedRole(item);
                      setViewModal(true);
                    }}
                  />
                  <Edit2
                    size={20}
                    className="text-green-600 cursor-pointer"
                    onClick={() => {
                      setSelectedRole(item);
                      setModalMode("edit");
                      setModalOpen(true);
                    }}
                  />
                  <Trash2 size={20} className="text-red-500 cursor-pointer" />
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                {/* <p>
                  <strong>Created On:</strong> {item.createdOn}
                </p>
                <p>
                  <strong>Updated On:</strong> {item.updatedOn}
                </p> */}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Created On</th>
                <th className="px-5 py-3 font-semibold">Last Updated</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {roles.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="px-5 py-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">{item.description}</td>
                  <td className="px-5 py-4">{item.createdOn}</td>
                  <td className="px-5 py-4">{item.updatedOn}</td>

                  <td className="px-5 py-4 flex justify-center gap-5">
                    <Eye
                      size={20}
                      className="text-blue-500 cursor-pointer hover:scale-125 transition"
                      onClick={() => {
                        setSelectedRole(item);
                        setViewModal(true);
                      }}
                    />
                    <Edit2
                      size={20}
                      className="text-green-600 cursor-pointer hover:scale-125 transition"
                      onClick={() => {
                        setSelectedRole(item);
                        setEditModal(true);
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

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-6">
          <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-sm">
            Previous
          </button>

          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium shadow text-sm">
            1
          </button>

          <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-sm">
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <UserRoleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        initialData={selectedRole}
        onSubmit={modalMode === "add" ? handleAddRole : handleUpdateRole}
      />

      <ViewUserRoleModal
        open={viewModal}
        onClose={() => setViewModal(false)}
        data={selectedRole}
      />

      
    </div>
  );
}
