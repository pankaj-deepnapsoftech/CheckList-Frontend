import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

/* ================== VALIDATION ================== */
const validationSchema = Yup.object({
  part_no: Yup.string().required("Part No is required"),
  part_name: Yup.string().required("Part Name is required"),
});

/* ================== MODAL ================== */
export default function AddPartsModal({
  openModal,
  setOpenModal,
  mode = "add",
  initialData = null,
  onSave,
}) {
  const isView = mode === "view";

  const formik = useFormik({
    initialValues: {
      part_no: initialData?.part_no || "",
      part_name: initialData?.part_name || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSave?.(values);
      formik.resetForm();
      setOpenModal(false);
    },
  });

  /* ESC CLOSE */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpenModal(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [setOpenModal]);

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      {/* BACKDROP */}
      <div className="absolute inset-0" onClick={() => setOpenModal(false)} />

      {/* DRAWER */}
      <div className="relative w-full max-w-md bg-white h-full shadow-xl p-6 animate-slideLeft overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === "add"
              ? "Add Part"
              : mode === "edit"
              ? "Edit Part"
              : "View Part"}
          </h2>

          <button onClick={() => setOpenModal(false)}>
            <X size={20} className="text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* PART NO */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Part No <span className="text-red-500">*</span>
            </label>
            <input
              name="part_no"
              disabled={isView}
              value={formik.values.part_no}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter part number"
              className={`mt-1 w-full px-4 py-3 rounded-lg border
                ${
                  formik.touched.part_no && formik.errors.part_no
                    ? "border-red-500"
                    : "border-gray-300"
                }
                ${isView && "bg-gray-100 cursor-not-allowed"}
                focus:ring-2 focus:ring-blue-400`}
            />
            {formik.touched.part_no && formik.errors.part_no && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.part_no}
              </p>
            )}
          </div>

          {/* PART NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Part Name <span className="text-red-500">*</span>
            </label>
            <input
              name="part_name"
              disabled={isView}
              value={formik.values.part_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter part name"
              className={`mt-1 w-full px-4 py-3 rounded-lg border
                ${
                  formik.touched.part_name && formik.errors.part_name
                    ? "border-red-500"
                    : "border-gray-300"
                }
                ${isView && "bg-gray-100 cursor-not-allowed"}
                focus:ring-2 focus:ring-blue-400`}
            />
            {formik.touched.part_name && formik.errors.part_name && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.part_name}
              </p>
            )}
          </div>

          {/* ACTION */}
          {!isView && (
            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition"
            >
              {mode === "add" ? "Save Part" : "Update Part"}
            </button>
          )}
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
      `}</style>
    </div>
  );
}
