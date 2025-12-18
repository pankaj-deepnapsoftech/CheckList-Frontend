import React from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useProcess } from "../../../hooks/useProcess";


export default function AddCheckItemModal({
  open,
  onClose,
  mode = "add",
  initialData = null,
  processes = [],
  onSubmit,
}) {
  const isView = mode === "view";

  const {getProcessData} = useProcess()


  const validationSchema = Yup.object({
    process: Yup.string().required("Process is required"),
    item: Yup.string().required("Item is required"),
    description: Yup.string().required("Description is required"),
    check_list_method: Yup.string().required("Check Item method is required"),
    check_list_time: Yup.string().required("Check Item time is required"),
    result_type: Yup.string().required("Result type is required"),

    min: Yup.number().when("result_type", {
      is: "measurement",
      then: () => Yup.number().required("Min value required"),
    }),

    max: Yup.number().when("result_type", {
      is: "measurement",
      then: () => Yup.number().required("Max value required"),
    }),

    uom: Yup.string().when("result_type", {
      is: "measurement",
      then: () => Yup.string().required("UOM is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      process: initialData?.process || "",
      item: initialData?.item || "",
      description: initialData?.description || "",
      check_list_method: initialData?.check_list_method || "",
      check_list_time: initialData?.check_list_time || "",
      result_type: initialData?.result_type || "", // yesno | measurement
      min: initialData?.min || "",
      max: initialData?.max || "",
      uom: initialData?.uom || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === "add"
              ? "Add Check Item"
              : mode === "edit"
              ? "Edit Check Item"
              : "View Check Item"}
          </h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Process */}
          <Field label="Process">
            <select
              name="process"
              disabled={isView}
              value={formik.values.process}
              onChange={formik.handleChange}
              className="input"
            >
              <option value="">Select Process</option>
              {getProcessData?.data?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.process_name}
                </option>
              ))}
            </select>
          </Field>

          {/* Item */}
          <Field label="Item">
            <input
              name="item"
              disabled={isView}
              value={formik.values.item}
              onChange={formik.handleChange}
              className="input"
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              name="description"
              disabled={isView}
              value={formik.values.description}
              onChange={formik.handleChange}
              className="input"
            />
          </Field>

          {/* Check Item Method */}
          <Field label="Check Item Method">
            <input
              name="check_list_method"
              disabled={isView}
              value={formik.values.check_list_method}
              onChange={formik.handleChange}
              className="input"
            />
          </Field>

          {/* Check Item Time */}
          <Field label="Check Item Time">
            <input
              name="check_list_time"
              disabled={isView}
              value={formik.values.check_list_time}
              onChange={formik.handleChange}
              className="input"
            />
          </Field>

          {/* Result Type */}
          <Field label="Result Type">
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="result_type"
                  value="yesno"
                  disabled={isView}
                  checked={formik.values.result_type === "yesno"}
                  onChange={formik.handleChange}
                />
                Yes / No
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="result_type"
                  value="measurement"
                  disabled={isView}
                  checked={formik.values.result_type === "measurement"}
                  onChange={formik.handleChange}
                />
                Measurement
              </label>
            </div>
          </Field>

          {/* MEASUREMENT */}
          {formik.values.result_type === "measurement" && (
            <>
              <Field label="Min Value">
                <input
                  type="number"
                  name="min"
                  disabled={isView}
                  value={formik.values.min}
                  onChange={formik.handleChange}
                  className="input"
                />
              </Field>

              <Field label="Max Value">
                <input
                  type="number"
                  name="max"
                  disabled={isView}
                  value={formik.values.max}
                  onChange={formik.handleChange}
                  className="input"
                />
              </Field>

              <Field label="UOM">
                <input
                  name="uom"
                  disabled={isView}
                  value={formik.values.uom}
                  onChange={formik.handleChange}
                  className="input"
                />
              </Field>
            </>
          )}

          {/* SUBMIT */}
          {!isView && (
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg mt-4"
            >
              {mode === "add" ? "Add Check Item" : "Update Check Item"}
            </button>
          )}
        </form>
      </div>

      {/* STYLES */}
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

/* FIELD WRAPPER */
function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium">{label}</label>
      {children}
    </div>
  );
}
