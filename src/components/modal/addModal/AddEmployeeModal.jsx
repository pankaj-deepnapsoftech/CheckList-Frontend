import React, { useState } from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCompanies } from "../../../hooks/useCompanies";
import { usePlantsByCompany } from "../../../hooks/UsePlantName";
import { useUserRole } from "../../../hooks/useUserRole";
import {RegisterEmployee} from "../../../hooks/useRegisterEmployee";
import { Eye } from "lucide-react";
import { EyeOff } from 'lucide-react';

export default function AddEmployeeModal({
  open,
  onClose,
  mode = "add", 
  initialData = null,
  assemblyLines = [],
  onSubmit,
}) {
  const isView = mode === "view";

  const { AllCompanyData } = useCompanies(null, null, open);
  const { AllRolesData } = useUserRole();
 const { createEmployee, updateEmployee } = RegisterEmployee();
 const [showPassword, setShowPassword] = useState(false);



  const [assemblyOpen, setAssemblyOpen] = useState(false);

const validationSchema = Yup.object({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
  designation: Yup.string().required("Designation is required"),
  password:
    mode === "add"
      ? Yup.string().required("Password is required")
      : Yup.string(),
  employee_company: Yup.string().required("Company is required"),
  Employee_plant: Yup.string().required("Plant is required"),
});

  const formik = useFormik({
    initialValues: {
      full_name: initialData?.full_name || "",
      email: initialData?.email || "",
      role: initialData?.role?._id || "",
      designation: initialData?.designation || initialData?.desigination || "",
      user_id: initialData?.user_id || "",
      password: "",
      employee_company: initialData?.employee_company?._id || "",
      Employee_plant: initialData?.employee_plant?._id || "",
      assambly_line: initialData?.assambly_line?.map((l) => l._id) || [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        full_name: values.full_name,
        email: values.email,
        desigination: values.designation, // ⚠ backend spelling
        employee_plant: values.Employee_plant,
        employee_company: values.employee_company,
        role: values.role,
        assambly_line: values.assambly_line,
      };

      // ADD password only in ADD mode
      if (mode === "add") {
        payload.password = values.password;
      }

      // UPDATE EMPLOYEE
      if (mode === "edit") {
        updateEmployee.mutate(
          {
            id: initialData?._id,
            data: payload,
          },
          {
            onSuccess: () => {
              formik.resetForm();
              onClose();
            },
          }
        );
        return;
      }

      // CREATE EMPLOYEE
      createEmployee.mutate(payload, {
        onSuccess: () => {
          formik.resetForm();
          onClose();
        },
      });
    },
  });





  const plantsQuery = usePlantsByCompany(formik.values.employee_company);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === "add"
              ? "Add Employee"
              : mode === "edit"
              ? "Edit Employee"
              : "View Employee"}
          </h2>

          <button onClick={onClose} className="cursor-pointer">
            <X size={22} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {/* Full Name */}
            <Field label="Full Name">
              <input
                name="full_name"
                disabled={isView}
                value={formik.values.full_name}
                onChange={formik.handleChange}
                className="input"
              />
            </Field>

            {/* Email */}
            <Field label="Email">
              <input
                name="email"
                type="email"
                disabled={isView}
                value={formik.values.email}
                onChange={formik.handleChange}
                className="input"
              />
            </Field>

            {/* Password (only for add) */}
            {mode === "add" && (
              <Field label="Password">
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className="input pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition"
                  >
                    {showPassword ? (
                      <EyeOff className="text-blue-500" size={20} />
                    ) : (
                      <Eye className="text-blue-500" size={20} />
                    )}
                  </button>
                </div>
              </Field>
            )}

            {/* Designation */}
            <Field label="Designation">
              <input
                name="designation"
                disabled={isView}
                value={formik.values.designation}
                onChange={formik.handleChange}
                className="input"
              />
            </Field>

            {/* Role */}
            <Field label="Role">
              <select
                name="role"
                disabled={isView}
                value={formik.values.role}
                onChange={formik.handleChange}
                className="input cursor-pointer"
              >
                <option value="">Select Role</option>
                {(AllRolesData?.data || []).map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Company */}
            <Field label="Company">
              <select
                name="employee_company"
                disabled={isView}
                value={formik.values.employee_company}
                onChange={(e) => {
                  formik.setFieldValue("employee_company", e.target.value);
                  formik.setFieldValue("Employee_plant", "");
                }}
                className="input cursor-pointer"
              >
                <option value="">Select Company</option>
                {(AllCompanyData?.data || []).map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.company_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Plant">
              <select
                name="Employee_plant"
                disabled={isView}
                value={formik.values.Employee_plant}
                onChange={formik.handleChange}
                className="input cursor-pointer"
              >
                <option value="">Select Plant</option>
                {(plantsQuery?.data || []).map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.plant_name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Assembly Line Dropdown */}
            {/* <div>
              <label className="text-sm font-medium">Assembly Line</label>

              <button
                type="button"
                disabled={isView}
                onClick={() => setAssemblyOpen(!assemblyOpen)}
                className="input flex justify-between cursor-pointer"
              >
                {formik.values.assambly_line.length
                  ? `${formik.values.assambly_line.length} Selected`
                  : "Select Assembly Lines"}
              </button>

              {assemblyOpen && !isView && (
                <div className="border rounded-lg p-2 mt-1 max-h-40 overflow-y-auto">
                  {assemblyLines.map((line) => (
                    <label key={line._id} className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={formik.values.assambly_line.includes(line._id)}
                        onChange={() => {
                          const list = formik.values.assambly_line;
                          formik.setFieldValue(
                            "assambly_line",
                            list.includes(line._id)
                              ? list.filter((id) => id !== line._id)
                              : [...list, line._id]
                          );
                        }}
                      />
                      {line.line_name}
                    </label>
                  ))}
                </div>
              )}
            </div> */}

            {/* Submit */}
            {!isView && (
              <button
                type="submit"
                className="bg-blue-600 cursor-pointer text-white py-2 rounded-lg mt-4"
              >
                {mode === "add" ? "Add Employee" : "Update Employee"}
              </button>
            )}
          </div>
        </form>
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
