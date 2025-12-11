import React, { useState } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import UserRoleModal from "../components/modal/addModal/AddUserRoleModal";
import ViewUserRoleModal from "../components/modal/viewUserRoleModal";
import EditUserRoleModal from "../components/modal/editModal/editUserRoleModal";

export default function UserRoles() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [viewModal, setViewModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [editModal, setEditModal] = useState(false);

  // Dummy Data
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

  // Future API integration
  /*
  useEffect(() => {
      async function fetchRoles() {
          const res = await fetch("/api/roles");
          const data = await res.json();
          setRoles(data);
      }
      fetchRoles();
  }, []);
  */

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-semibold">User Roles</h1>
        <p className="text-gray-500 text-sm">
          Manage user roles and permissions
        </p>
      </div>

      {/* Search */}
      <div className="bg-white shadow-sm rounded-xl p-4 mt-4 flex items-center justify-between gap-4">
        {/* Search Box */}
        <div className="flex items-center gap-3 w-full max-w-[300px] border border-gray-200 rounded-lg px-3 py-2">
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add New Role
          </button>

          <button className="border border-gray-200 cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-sm rounded-xl mt-6 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium">{roles.length} Roles Found</h2>

          {/* Show Dropdown */}
          <div className="flex items-center gap-2 text-gray-600">
            <span>Show:</span>
            <select className="border border-gray-200 rounded-lg px-2 py-1 cursor-pointer">
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Created On</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  {/* ROLE BADGE */}
                  <td className="px-4 py-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.role}
                    </span>
                  </td>

                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">{item.createdOn}</td>
                  <td className="px-4 py-3">{item.updatedOn}</td>

                  {/* ACTION ICONS */}
                  <td className="px-4 py-3 flex gap-3">
                    <Eye
                      size={18}
                      onClick={() => {
                        setSelectedRole(item);
                        setViewModal(true);
                      }}
                      className="text-blue-600 cursor-pointer"
                    />

                    <Edit2
                      size={18}
                      className="cursor-pointer text-green-500 hover:scale-110 transition"
                      onClick={() => {
                        setSelectedRole(item);
                        setEditModal(true);
                      }}
                    />

                    <Trash2
                      size={18}
                      className="cursor-pointer text-red-500 hover:scale-110 transition"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">
            Previous
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            1
          </button>

          <button className="border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
      <UserRoleModal open={openModal} onClose={() => setOpenModal(false)} />
      <ViewUserRoleModal
        open={viewModal}
        onClose={() => setViewModal(false)}
        data={selectedRole}
      />
      <EditUserRoleModal
        open={editModal}
        onClose={() => setEditModal(false)}
        data={selectedRole}
      />
    </div>
  );
}
