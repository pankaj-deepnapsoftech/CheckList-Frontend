import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditEmployeeModal({
  open,
  onClose,
  data,
  roles = [],
  plants = [],
  companies = [],
  assemblyLines = [],
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
    designation: "",
    user_id: "",
    Employee_plant: "",
    employee_company: "",
    assambly_line: [],
  });

  useEffect(() => {
    if (data) {
      setFormData({
        full_name: data.full_name || "N/A",
        email: data.email || "N/A",
        role: data.role?._id || "",
        designation: data.designation || "N/A",
        user_id: data.user_id || "N/A",
        Employee_plant: data.Employee_plant?._id || "N/A",
        employee_company: data.employee_company?._id || "N/A",
        assambly_line: data.assambly_line?.map((l) => l._id) || [],
      });
    }
  }, [data]);

  if (!open) return null;

  // Toggle checkbox for assembly lines
  const toggleAssemblyLine = (id) => {
    setFormData((prev) => ({
      ...prev,
      assambly_line: prev.assambly_line.includes(id)
        ? prev.assambly_line.filter((line) => line !== id)
        : [...prev.assambly_line, id],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Employee</h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* Full Name */}
          <Field label="Full Name">
            <input
              className="input"
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

          {/* User ID */}
          <Field label="User ID">
            <input
              className="input"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
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
          <Field label="Plant">
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
          <Field label="Company">
            <select
              className="input"
              value={formData.employee_company}
              onChange={(e) =>
                setFormData({ ...formData, employee_company: e.target.value })
              }
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </Field>

          {/* Assembly Lines */}
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Assembly Lines
            </label>

            <div className="flex flex-col gap-2 border rounded-lg px-3 py-2 bg-gray-50 mt-1 max-h-40 overflow-y-auto">
              {/* Default Message When Empty */}
              {assemblyLines.length === 0 ? (
                <div className="text-gray-500 text-sm">
                  No Assembly Lines Available
                </div>
              ) : (
                assemblyLines.map((line) => (
                  <label key={line._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.assambly_line.includes(line._id)}
                      onChange={() => toggleAssemblyLine(line._id)}
                    />
                    {line.line_name}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
            onClick={() => onSubmit(formData)}
          >
            Update Employee
          </button>
        </div>
      </div>

      {/* Animation */}
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
