import { useState } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import AddEmployeeModal from "../components/modal/addModal/AddEmployeeModal";
import { RegisterEmployee } from "../hooks/useRegisterEmployee";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../Components/Pagination/Pagination";
import { UserCheck } from "lucide-react";
import { UserX } from "lucide-react";

const  Employee=()=>{

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { debounce, value } = useDebounce(search);
  const { getAllEmployee, searchEmployee, toggleTerminateEmployee } =
    RegisterEmployee(value, page);

  

  const filteredEmployees = debounce
    ? searchEmployee?.data ?? []
    : getAllEmployee?.data ?? [];

    console.log("this is my get all employee data", toggleTerminateEmployee?.data?.message);

    const handleTerminateToggle = (emp) => {
      toggleTerminateEmployee.mutate(
        {
          id: emp._id,
          terminate: !emp.terminate, 
        },
        {
          onSuccess: () => {
            console.log(
              `Employee ${emp.full_name} terminate = ${!emp.terminate}`
            );
          },
        }
      );
    };



  return (
    <div className="w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">Employees</h1>
        <p className="text-gray-500 text-sm">Manage Employees</p>
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
                setSelectedEmployee(null);
                setModalOpen(true);
              }}
              className="px-5 py-2 cursor-pointer bg-blue-500 text-white rounded-lg w-full justify-center hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={18} /> Add New Employee
            </button>
          </div>

          <button className="border cursor-pointer border-gray-200 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 mt-6 p-5">
        {/* Header: Count + Show Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="text-gray-800 text-lg font-semibold">
            {filteredEmployees.length} Employees Found
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
          {filteredEmployees.map((emp, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              {/* Header: Name + actions */}
              <div className="flex items-center flex-wrap justify-between gap-3">
                <span className="bg-blue-500 whitespace-nowrap text-white px-3 py-1 rounded-full text-xs font-medium">
                  {emp.full_name || "N/A"}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-4">
                  <Eye
                    size={20}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      setModalMode("view");
                      setSelectedEmployee(emp);
                      setModalOpen(true);
                    }}
                  />

                  <Edit2
                    size={20}
                    className="text-green-500 cursor-pointer"
                    onClick={() => {
                      setModalMode("edit");
                      setSelectedEmployee(emp);
                      setModalOpen(true);
                    }}
                  />

                  {emp.terminate ? (
                    <UserX
                      size={22}
                      onClick={() => handleTerminateToggle(emp)}
                      className="text-red-500 cursor-pointer hover:scale-125 transition"
                      title="Re-Activate Employee"
                    />
                  ) : (
                    <UserCheck
                      size={22}
                      onClick={() => handleTerminateToggle(emp)}
                      className="text-green-600 cursor-pointer hover:scale-125 transition"
                      title="Terminate Employee"
                    />
                  )}
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>User ID:</strong> {emp.user_id || "N/A"}
                </p>

                <p>
                  <strong>Role:</strong>{" "}
                  <span className="">{emp?.role?.name || "N/A"}</span>
                </p>

                <p>
                  <strong>Designation:</strong>{" "}
                  {emp.designation || emp.desigination || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto hidden sm:block w-full rounded-xl border border-gray-200">
          <table className="w-full  text-center">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-sm text-center">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">User ID</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Designation</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-gray-700">
              {filteredEmployees.map((emp, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-200 transition ${
                    emp.terminate
                      ? "opacity-50 bg-gray-50"
                      : "hover:bg-blue-50/40"
                  }`}
                >
                  <td className="px-5 py-4">{emp.full_name || "N/A"}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {emp.user_id || "N/A"}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow">
                      {emp?.role?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-5 py-4 ">
                    {emp.designation || emp.desigination || "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 flex justify-center gap-5">
                    {/* VIEW */}
                    <Eye
                      size={20}
                      className="text-blue-500 hover:text-blue-600 hover:scale-125 cursor-pointer transition transform"
                      onClick={() => {
                        setModalMode("view");
                        setSelectedEmployee(emp);
                        setModalOpen(true);
                      }}
                    />

                    {/* EDIT */}
                    <Edit2
                      size={20}
                      className="text-green-500 hover:text-green-700 hover:scale-125 cursor-pointer transition transform"
                      onClick={() => {
                        setModalMode("edit");
                        setSelectedEmployee(emp);
                        setModalOpen(true);
                      }}
                    />

                    {/* DELETE */}
                    {emp.terminate ? (
                      <UserX
                        size={22}
                        onClick={() => handleTerminateToggle(emp)}
                        className="text-red-500 hover:scale-125 cursor-pointer transition"
                        title="Re-Activate Employee"
                      />
                    ) : (
                      <UserCheck
                        size={22}
                        onClick={() => handleTerminateToggle(emp)}
                        className="text-green-600 hover:scale-125 cursor-pointer transition"
                        title="Terminate Employee"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddEmployeeModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedEmployee}
        onClose={() => {
          setModalOpen(false);
          setSelectedEmployee(null);
        }}
      />
      <Pagination
        page={page}
        setPage={setPage}
        hasNextpage={filteredEmployees?.length === 10}
      />
    </div>
  );
}

export default Employee
