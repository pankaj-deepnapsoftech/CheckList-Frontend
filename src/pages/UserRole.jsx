import React, { useState } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import UserRoleModal, { PERMISSION_MAP } from "../components/modal/addModal/AddUserRoleModal";
import { useUserRole } from "../hooks/useUserRole";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../Components/Pagination/Pagination";

const PATH_TO_KEY_MAP = Object.fromEntries(
  Object.entries(PERMISSION_MAP).map(([key, value]) => [value, key])
);

 

export default function UserRoles() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedRole, setSelectedRole] = useState(null);
  const { debounce, value } = useDebounce(search);
  const { UserlistQuery, removeUser, SearchUserList } = useUserRole(value,page);

  const filteredRoles = debounce
    ? SearchUserList?.data ?? []
    : UserlistQuery?.data ?? [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      removeUser.mutate(id);
    }
  };

   const handleRefresh = async () => {
    setPage(1);
    setShowRefresh(true);  
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1000)); 
    await Promise.all([UserlistQuery.refetch(), minDelay]); 
    setShowRefresh(false);  
  };

 const formatPermissions = (permissions) => {
   if (!permissions) return [];

   // ✅ Case 1: Already an array of strings
   if (Array.isArray(permissions)) {
     return permissions
       .map((p) => (typeof p === "string" ? p : p?.name))
       .filter(Boolean);
   }

   // ✅ Case 2: Single string (DashboardPlantNameCompany)
   if (typeof permissions === "string") {
     return permissions
       .replace(/([A-Z])/g, " $1")
       .trim()
       .split(" ")
       .reduce((acc, word) => {
         const last = acc[acc.length - 1];
         if (last && last.length < 14) {
           acc[acc.length - 1] = `${last} ${word}`;
         } else {
           acc.push(word);
         }
         return acc;
       }, []);
   }

   return [];
 };



  return (
    <div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">User Roles</h1>
        <p className="text-gray-500 text-sm">
          Manage user roles and permissions
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <button
            onClick={() => {
              setSelectedRole(null);
              setModalMode("add");
              setModalOpen(true);
            }}
            className="bg-blue-500 cursor-pointer text-white px-4 py-2 w-full sm:w-auto rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
          >
            <Plus size={18} /> Add New Role
          </button>

          <button className="border cursor-pointer border-gray-300 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 mt-6 p-5">
        <div className="flex items-center mb-5 gap-3">
          <h2 className="text-gray-800 text-lg font-semibold">
            {filteredRoles?.length} Roles Found
          </h2>

          <div className="flex items-center gap-2 text-gray-500 ml-auto">
            <span className="text-sm font-medium">Show:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 hover:border-gray-400 cursor-pointer">
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:hidden">
          {filteredRoles?.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <span className=" py-1 text-md text-gray-800 font-medium">
                  {item.name}
                </span>

                <div className="flex gap-4">
                  <Eye
                    size={20}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      setSelectedRole(item);
                      setModalMode("view");
                      setModalOpen(true);
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

                  <Trash2
                    size={20}
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  />
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <div className="mt-2 flex flex-wrap gap-2">
                  {formatPermissions(item?.permissions).map((perm, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full  min-w-[700px] text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm">
                <th className="px-5 py-3 font-semibold">Role Name</th>
                <th className="px-5 py-3 font-semibold">Permissions</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredRoles?.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="px-5 py-4">{item?.name}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2 max-w-[280px]">
                      {formatPermissions(item?.permissions).map((perm, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        >
                          {PATH_TO_KEY_MAP[perm]}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-5 py-4">{item.description}</td>
                  <td className="px-5 py-4 flex justify-center gap-5">
                    <Eye
                      size={20}
                      className="text-blue-500 cursor-pointer hover:scale-125"
                      onClick={() => {
                        setSelectedRole(item);
                        setModalMode("view");
                        setModalOpen(true);
                      }}
                    />

                    <Edit2
                      size={20}
                      className="text-green-600 cursor-pointer hover:scale-125"
                      onClick={() => {
                        setSelectedRole(item);
                        setModalMode("edit");
                        setModalOpen(true);
                      }}
                    />

                    <Trash2
                      size={20}
                      className="text-red-500 cursor-pointer hover:scale-125"
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          hasNextpage={UserlistQuery?.data?.length === 10}
        />
      </div>

      <UserRoleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        initialData={selectedRole}
      />
    </div>
  );
}
