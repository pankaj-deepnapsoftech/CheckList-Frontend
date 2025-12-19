import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UsePart } from "../../../hooks/usePart";

const validationSchema = Yup.object({
  part_number: Yup.string().required("Part No is required"),
  part_name: Yup.string().required("Part Name is required"),
});

export default function AddPartsModal({
  openModal,
  setOpenModal,
  mode = "add",
  initialData = null,
}) {
  const isView = mode === "view";
  const { createPart, updateParts } = UsePart();


  const formik = useFormik({
    initialValues: {
      part_number: initialData?.part_number || "",
      part_name: initialData?.part_name || "",
    },
    enableReinitialize: true,
    validationSchema,

    onSubmit: (values) => {
      if (mode === "add") {
        createPart.mutate(values);
      }

      if (mode === "edit") {
        updateParts.mutate({
          id: initialData?._id,
          data: values,
        });
      }

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
      <div className="absolute inset-0" onClick={() => setOpenModal(false)} />

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
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* PART NUMBER */}
          <div>
            <label className="text-sm font-medium">
              Part No <span className="text-red-500">*</span>
            </label>
            <input
              name="part_number"
              disabled={isView}
              value={formik.values.part_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full px-4 py-3 rounded-lg border"
            />
            {formik.touched.part_number && formik.errors.part_number && (
              <p className="text-red-500 text-sm">
                {formik.errors.part_number}
              </p>
            )}
          </div>

          {/* PART NAME */}
          <div>
            <label className="text-sm font-medium">
              Part Name <span className="text-red-500">*</span>
            </label>
            <input
              name="part_name"
              disabled={isView}
              value={formik.values.part_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full px-4 py-3 rounded-lg border"
            />
            {formik.touched.part_name && formik.errors.part_name && (
              <p className="text-red-500 text-sm">{formik.errors.part_name}</p>
            )}
          </div>

          {/* TOTAL ASSEMBLIES (VIEW ONLY) */}
          {isView && (
            <div>
              <label className="text-sm font-medium">Total Assemblies</label>
              <input
                value={initialData?.total_assemblies ?? 0}
                disabled
                className="mt-1 w-full px-4 py-3 rounded-lg border bg-gray-100 text-gray-700"
              />
            </div>
          )}

          {!isView && (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg"
            >
              {mode === "add" ? "Save Part" : "Update Part"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
