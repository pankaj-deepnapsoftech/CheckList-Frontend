import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2, Ban } from "lucide-react";
import AddEmployeeModal from "../components/modal/addModal/AddEmployeeModal";
import { RegisterEmployee } from "../hooks/useRegisterEmployee";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../Components/Pagination/Pagination";
import { UserCheck } from "lucide-react";
import Refresh from "../components/Refresh/Refresh";
import { UserX } from "lucide-react";
import ViewEmployeeModal from "../components/modal/ViewModal/ViewEmployee";

const Employee = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [modalMode, setModalMode] = useState("add");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const { debounce, value } = useDebounce(search);
  const [viewOpen, setViewOpen] = useState(false);

  const { getAllEmployee, searchEmployee, toggleTerminateEmployee } =
    RegisterEmployee(selectedCompany, selectedPlant, value, page, limit);
  const searchValue = search ? value : "";

  const { getAllEmployee, searchEmployee, toggleTerminateEmployee } =
    RegisterEmployee(selectedCompany, selectedPlant, searchValue, page, limit);

  const hasfilter = selectedPlant || selectedCompany || search;

  const filteredEmployees = useMemo(() =>
    hasfilter ? searchEmployee?.data ?? [] : getAllEmployee?.data ?? [],
    [hasfilter, searchEmployee?.data, getAllEmployee?.data]
  );

  const [showRefresh, setShowRefresh] = useState(false);

  const [showRefresh, setShowRefresh] = useState(false);

  const handleRefresh = async () => {
    setPage(1);
    setSearch("");
    setShowRefresh(true);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    await Promise.all([getAllEmployee.refetch(), minDelay]);
    setShowRefresh(false);
  };


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

  const plantOptions = [
    ...new Map(
      (getAllEmployee?.data || [])
        .map((emp) => emp?.employee_plant)
        .filter(Boolean)
        .map(plant => [plant._id, plant])
    ).values(),
  ];

  const companyOptions = [
    ...new Map(
      (getAllEmployee?.data || [])
        .map((emp) => emp?.employee_company)
        .filter(Boolean)
        .map((company) => [company._id, company])
    ).values(),
  ];


  
  useEffect(() => {
    setPage(1);
  }, [search, selectedCompany, selectedPlant]);
  return (
    <div className="w-full relative">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">Employees</h1>
        <p className="text-gray-500 text-sm">Manage Employees</p>
      </div>

      {/* Search + Buttons */}
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
        {/* Search Box */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Search */}
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

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Company Filter */}
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">All Companies</option>
              {companyOptions.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.company_name}
                </option>
              ))}
            </select>

            {/* Plant Filter */}
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">All Plants</option>
              {plantOptions.map((plant, i) => (
                <option key={i} value={plant?._id}>
                  {plant?.plant_name}
                </option>
              ))}
            </select>
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

          <button className="border cursor-pointer border-gray-200 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700"
            onClick={handleRefresh}
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative min-h-[300px] bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 mt-6 p-5">
        {/* Header: Count + Show Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="text-gray-800 text-lg font-semibold">
            {filteredEmployees.length} Employees Found
          </h2>

          {/* Show Dropdown */}
          <div className="flex items-center gap-4 text-gray-600">
            <span>Show:</span>
            <select
              className="border border-gray-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-0 "
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Mobile View (Card Layout) */}
        {showRefresh ? (
          <Refresh />
                <Refresh />
              ) : (
        <div className="grid gap-4 sm:hidden mt-4">
          {filteredEmployees.map((emp, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              {/* Header: Name + actions */}
              <div className="flex items-center flex-wrap justify-between gap-3">
                <span className="bg-blue-500 whitespace-nowrap text-white px-3 py-1 rounded-full text-xs font-medium">
                  {emp.user_id || "N/A"}
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

                  <label className="inline-flex items-center cursor-pointer">
                      <input
                      type="checkbox"
                      checked={!emp.terminate}
                      onChange={() => handleTerminateToggle(emp)}
                      className="sr-only peer"
                        />
                      <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                    after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Name:</strong> {emp.full_name || "N/A"}
                </p>

                <p>
                  <strong>Plant:</strong>{" "}
                  <span className="">
                    {emp?.employee_plant?.plant_name || "N/A"}
                  </span>
                </p>

                <p>
                  <strong>Company:</strong>{" "}
                  {emp?.employee_company?.company_name || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Table */}
      {showRefresh ? (
        <Refresh />
        ) : (
          <div className="grid gap-4 sm:hidden mt-4">
            {filteredEmployees.map((emp, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
              >
                {/* Header: Name + actions */}
                <div className="flex items-center flex-wrap justify-between gap-3">
                  <span className="bg-blue-500 whitespace-nowrap text-white px-3 py-1 rounded-full text-xs font-medium">
                    {emp.user_id || "N/A"}
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

                    {/* DELETE */}
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                      type="checkbox"
                      checked={!emp.terminate}
                      onChange={() => handleTerminateToggle(emp)}
                      className="sr-only peer"
                        />
                      <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                    after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                  </td>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="text-gray-700">
                {filteredEmployees.map((emp, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-200 transition ${emp.terminate
                      ? "opacity-50 bg-gray-50"
                      : "hover:bg-blue-50/40"
                      }`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      {emp.user_id || "N/A"}
                    </td>
                    <td className="px-5 py-4">{emp.full_name || "N/A"}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow">
                        {emp?.employee_plant?.plant_name || "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4 ">
                      {emp?.employee_company?.company_name || "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 flex justify-center gap-5">
                      {/* VIEW */}
                      <Eye
                        size={20}
                        className="text-blue-500 hover:text-blue-600 hover:scale-125 cursor-pointer transition transform"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setViewOpen(true);
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
                        <Ban
                          size={22}
                          onClick={() => handleTerminateToggle(emp)}
                          className="text-red-500 hover:scale-125 cursor-pointer transition"
                          title="Re-Activate Employee"
                        />
                      ) : (
                        <UserCheck
                          size={22}
                          onClick={() => handleTerminateToggle(emp)}
                          className="text-purple-500 hover:scale-125 cursor-pointer transition"
                          title="Terminate Employee"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
        hasNextpage={filteredEmployees?.length === limit}
      />

      <ViewEmployeeModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedEmployee}
      />
    </div>
  );
};

export default Employee;
