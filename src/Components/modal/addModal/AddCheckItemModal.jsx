import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useProcess } from "../../../hooks/useProcess";
import { validationSchema } from "../../../Validation/CheckItemValidation";
import { useCheckItem } from "../../../hooks/useCheckItem";
import SearchableDropdown from "../../SearchableDropDown/SearchableDropDown";

export default function AddCheckItemModal({
  open,
  onClose,
  mode = "add",
  initialData = null,
}) {
  const isView = mode === "view";

  const { getProcessData } = useProcess();
  const { CreateCheckItem, updateCheckItem, AddCategroy, GetCategory } = useCheckItem();

  const [checklistMethods, setChecklistMethods] = useState([
    "Visual",
    "Visual and manual",
    "Visual by ESD meter",
    "Visual check in PID",
    "Visual check in timer",
    "Visual check in FR unit",
    "Visual and greasing sample",
    "Visual check in pressure gauge",
    "Visual check in temperature meter",
    "Visual by limit sample and attention sheet",
    "Visual check grease name / part no.",
    "Weighing machine",
    "Lot management plan",
    "As per checker validation sheet",
  ]);

  const [checklistTimes, setChecklistTimes] = useState([
    "SOP",
    "When bit change",
    "When roll change",
    "At the time of grease filling",
    "As per checker validation sheet",
  ]);


  const [uom, setUom] = useState([]);

  useEffect(() => {
    if (GetCategory?.data) {
      const UomData = GetCategory.data
        .filter(item => item?.uom)
        .map(item => item.uom);

      setUom(UomData);
    }
  }, [GetCategory?.data]);


  const [showMethodInput, setShowMethodInput] = useState(false);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showUomInput,setShowUomInput] = useState(false);
  const [newMethod, setNewMethod] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newUom,setNewUom]= useState("");

  const formik = useFormik({
    initialValues: {
      process:
        initialData?.process?._id || initialData?.process || "",
      item: initialData?.item || "",
      description: initialData?.description || "",
      check_list_method: initialData?.check_list_method || "",
      check_list_time: initialData?.check_list_time || "",
      result_type: initialData?.result_type || "",
      min: initialData?.min ,
      max: initialData?.max ,
      uom: initialData?.uom,
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
          });
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
            <SearchableDropdown
              placeholder="Select Process"
              options={(getProcessData?.data || []).map((p) => ({
                label: `${p.process_name} (${p.process_no})`,
                value: p._id,
              }))}
              value={formik.values.process}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              onChange={(val) => formik.setFieldValue("process", val)}
              onBlur={() => formik.setFieldTouched("process", true)}
              disabled={isView}
              error={formik.touched.process && formik.errors.process}
            />

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


          <Field label="Check Method">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <SearchableDropdown
                  placeholder="Select Checklist Method"
                  options={checklistMethods.map((m) => ({
                    label: m,
                    value: m,
                  }))}
                  value={formik.values.check_list_method}
                  getOptionLabel={(o) => o.label}
                  getOptionValue={(o) => o.value}
                  onChange={(val) =>
                    formik.setFieldValue("check_list_method", val)
                  }
                />
              </div>
            </div>

            <div className=" w-full flex justify-end pt-2">
              {!showMethodInput && !isView && (
                <button
                  type="button"
                  className="text-blue-600 text-sm font-medium whitespace-nowrap
        bg-blue-50 border border-blue-300
        px-3 py-1.5 rounded-md
        hover:bg-blue-100 hover:border-blue-400
        transition-colors "
                  onClick={() => setShowMethodInput(true)}
                >
                  + Add Method
                </button>
              )}
            </div>

            {showMethodInput && (
              <div className="flex gap-2 mt-2">
                <input
                  className="input flex-1"
                  placeholder="Enter method"
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
                  onClick={() => {
                    if (!newMethod.trim()) return;
                    setChecklistMethods([...checklistMethods, newMethod]);
                    setNewMethod("");
                    setShowMethodInput(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowMethodInput(false);
                    setNewMethod("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </Field>


          <Field label="Checking Time">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <SearchableDropdown
                  placeholder="Select Checklist Time"
                  options={checklistTimes.map((t) => ({
                    label: t,
                    value: t,
                  }))}
                  value={formik.values.check_list_time}
                  getOptionLabel={(o) => o.label}
                  getOptionValue={(o) => o.value}
                  onChange={(val) =>
                    formik.setFieldValue("check_list_time", val)
                  }
                />
              </div>


            </div>

            <div className="w-full flex justify-end pt-2">
              {!showTimeInput && !isView && (
                <button
                  type="button"
                  className="
        text-blue-600 text-sm font-medium whitespace-nowrap
        bg-blue-50 border border-blue-300
        px-3 py-1.5 rounded-md
        hover:bg-blue-100 hover:border-blue-400
        transition-colors
      "
                  onClick={() => setShowTimeInput(true)}
                >
                  + Add Time
                </button>
              )}
            </div>

            {showTimeInput && (
              <div className="flex gap-2 mt-2">
                <input
                  className="input flex-1"
                  placeholder="Enter time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
                  onClick={() => {
                    if (!newTime.trim()) return;
                    setChecklistTimes([...checklistTimes, newTime]);
                    setNewTime("");
                    setShowTimeInput(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowTimeInput(false);
                    setNewTime("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
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
                Simple Check
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
                Value Based Check
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
                {!showUomInput && !isView && (
              <button
                type="button"
                className="text-blue-600 text-sm mb-2 ml-4"
                onClick={() => setShowUomInput(true)}
              >
                + Add Uom
              </button>
            )}

            {showUomInput && (
              <div className="flex gap-2 mb-2">
                <input
                  className="input"
                  placeholder="Enter Uom"
                  value={newUom}
                  onChange={(e) => setNewUom(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 rounded"
                  onClick={() => {
                    if (!newUom.trim()) return;
                    setUom([...uom, newUom]);
                    setNewUom("");
                    setShowUomInput(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-gray-500"
                  onClick={() => {
                    setShowUomInput(false);
                    setUomTime("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
               
                <SearchableDropdown
                  placeholder="Select UOM"
                  options={uom.map((t) => ({
                    label: t,
                    value: t,
                  }))}
                  value={formik.values.uom}
                  getOptionLabel={(o) => o.label}
                  getOptionValue={(o) => o.value}
                  onChange={(val) =>
                    formik.setFieldValue("uom", val)
                  }
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
