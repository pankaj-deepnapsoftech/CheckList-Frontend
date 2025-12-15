import React, { useState } from "react";
import { X } from "lucide-react";
import { useCompanies } from "../../../hooks/useCompanies";

export default function AddEmployeeModal({
  open,
  onClose,
  roles = [],
  plants = [],
  companies = [],
  assemblyLines = [],
  onSubmit,
})



{
const { AllCompanyData } = useCompanies(null, null, open);
  
  const [formData, setFormData] = useState({
  full_name: "",
  email: "",
  role: "",
  designation: "",
  user_id: "",
  password: "",
  Employee_plant: "",
  employee_company: "",
  assambly_line: [],
  showAssemblyDropdown: false,
});

useCompanies();
if (!open) return null;
  

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Employee</h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <Field label="Full Name">
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </Field>

          {/* Email */}
          <Field label="Email">
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Field>

          {/* Password */}
          <Field label="Password">
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </Field>

          {/* Role */}
          <Field label="Role">
            <select
              className="input"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </Field>

          {/* Designation */}
          <Field label="Designation">
            <input
              className="input"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
            />
          </Field>

          {/* Plant */}
          <Field label="Employee Plant">
            <select
              className="input"
              value={formData.Employee_plant}
              onChange={(e) =>
                setFormData({ ...formData, Employee_plant: e.target.value })
              }
            >
              <option value="">Select Plant</option>
              {plants.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.plant_name}
                </option>
              ))}
            </select>
          </Field>

          {/* Company */}
          <Field label="Employee Company">
            <select
              className="input"
              value={formData.employee_company}
              onChange={(e) =>
                setFormData({ ...formData, employee_company: e.target.value })
              }
            >
              <option value="">Select Company</option>

              {AllCompanyData?.data?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.company_name}
                </option>
              ))}
            </select>

            {AllCompanyData?.isLoading && (
              <p className="text-xs text-gray-500 mt-1">Loading companies...</p>
            )}
          </Field>

          {/* Assembly Lines */}
          {/* Assembly Line Dropdown */}
          <div className="w-full">
            <label className="text-sm text-gray-700 font-medium">
              Assembly Line
            </label>

            {/* Dropdown Button */}
            <div className="relative mt-1">
              <button
                type="button"
                className="w-full border rounded-lg px-3 py-2 bg-white flex justify-between items-center"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    showAssemblyDropdown: !prev.showAssemblyDropdown,
                  }))
                }
              >
                <span className="text-gray-700">
                  {formData.assambly_line.length > 0
                    ? `${formData.assambly_line.length} Selected`
                    : "Select Assembly Lines"}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`size-5 transition-transform ${
                    formData.showAssemblyDropdown ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {formData.showAssemblyDropdown && (
                <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-md max-h-48 overflow-y-auto z-50 p-2">
                  {assemblyLines.length === 0 ? (
                    <p className="text-gray-500 text-sm px-2 py-1">
                      No Assembly Lines Available
                    </p>
                  ) : (
                    assemblyLines.map((line) => (
                      <label
                        key={line._id}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.assambly_line.includes(line._id)}
                          onChange={() => {
                            setFormData((prev) => {
                              const exists = prev.assambly_line.includes(
                                line._id
                              );

                              return {
                                ...prev,
                                assambly_line: exists
                                  ? prev.assambly_line.filter(
                                      (id) => id !== line._id
                                    )
                                  : [...prev.assambly_line, line._id],
                              };
                            });
                          }}
                        />
                        {line.line_name}
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
            onClick={() => onSubmit(formData)}
          >
            Add Employee
          </button>
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.3s ease-out;
        }
        .input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium">{label}</label>
      {children}
    </div>
  );
}
