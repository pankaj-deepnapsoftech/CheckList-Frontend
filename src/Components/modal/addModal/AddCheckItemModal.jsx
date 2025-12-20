import React from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useProcess } from "../../../hooks/useProcess";
import { validationSchema } from "../../../Validation/CheckItemValidation";
import { useCheckItem } from "../../../hooks/useCheckItem";


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
  const { CreateCheckItem, updateCheckItem } = useCheckItem();

 const formik = useFormik({
  initialValues: {
    process:
      initialData?.process?._id || initialData?.process || "",
    item: initialData?.item || "",
    description: initialData?.description || "",
    check_list_method: initialData?.check_list_method || "",
    check_list_time: initialData?.check_list_time || "",
    result_type: initialData?.result_type || "",
    min: initialData?.min || "0",
    max: initialData?.max || "0",
    uom: initialData?.uom || "0",
  },
  enableReinitialize: true,
  validationSchema,
  onSubmit: (values) => {
    if (mode === "edit") {
      updateCheckItem.mutate(
        { id: initialData?._id, data: values },
        {
          onSuccess: () => {
            onClose();
            formik.resetForm();
          },
        }
      );
    } else {
      CreateCheckItem.mutate(values, {
        onSuccess: () => {
          onClose();
          formik.resetForm();
        },
      });
    }
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
                <option key={p?._id} value={p?._id}>
                  {p?.process_name}({p?.process_no})
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
          <Field label="Check  Method">
            <select
              name="check_list_method"
              disabled={isView}
              value={formik.values.check_list_method}
              onChange={formik.handleChange}
              className="input"
            >
              <option value="" disabled>
                Select method
              </option>
              <option value="Visual">Visual</option>
              <option value="Visual and manual">Visual and manual</option>
              <option value="Visual by ESD meter">Visual by ESD meter</option>
              <option value="Visual check in PID">Visual check in PID</option>
              <option value="Visual check in timer">
                Visual check in timer
              </option>
              <option value="Visual check in FR unit">
                Visual check in FR unit
              </option>
              <option value="Visual and greasing sample">
                Visual and greasing sample
              </option>
              <option value="Visual check in pressure gauge">
                Visual check in pressure gauge
              </option>
              <option value="Visual check in temperature meter">
                Visual check in temperature meter
              </option>
              <option value="Visual by limit sample and attention sheet">
                Visual by limit sample and attention sheet
              </option>
              <option value="Visual check grease name / part no.">
                Visual check grease name / part no.
              </option>
              <option value="Weighing machine">Weighing machine</option>
              <option value="Lot management plan">Lot management plan</option>
              <option value="As per checker validation sheet">
                As per checker validation sheet
              </option>
            </select>
          </Field>

          {/* Check Item Time */}
          <Field label="Checking Time">
            <select
              name="check_list_time"
              disabled={isView}
              value={formik.values.check_list_time}
              onChange={formik.handleChange}
              className="input"
            >
              <option value="" disabled>
                Select time
              </option>
              <option value="SOP">SOP</option>
              <option value="When bit change">When bit change</option>
              <option value="when roll change">When roll change</option>
              <option value="At the time of grease filling">
                At the time of grease filling
              </option>
              <option value="As per checker validation sheet">
                As per checker validation sheet
              </option>
            </select>
          </Field>

          {/* Result Type */}
          <Field label="Evaluation Type">
            <div className="flex gap-4 mt-1">
              <label className="flex text-[15px] items-center gap-2">
                <input
                  type="radio"
                  name="result_type"
                  value="yesno"
                  disabled={isView}
                  checked={formik.values.result_type === "yesno"}
                  onChange={formik.handleChange}
                />
                Condition Check
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
                Numeric Check
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
