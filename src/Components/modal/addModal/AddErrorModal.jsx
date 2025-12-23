import React, { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAssemblyLineError } from "../../../hooks/useAssemblyLineError";

// Validation schema
const validationSchema = Yup.object({
  is_error: Yup.string().required("Result is required"),
});

export default function AddErrorModal({
  open,
  onClose,
  data,
}) {
  const { updateAssemblyLineError } = useAssemblyLineError();

  const formik = useFormik({
    initialValues: {
      is_error: data?.is_error || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        checkList: data?.checkList?._id,
        process_id: data?.process_id?._id,
        assembly: data?.assembly?._id,
        is_error: values.is_error,
      };

      updateAssemblyLineError.mutate(
        { id: data._id, data: payload },
        {
          onSuccess: () => {
            formik.resetForm();
            onClose();
          },
        }
      );
    },
  });

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open || !data) return null;

  const isYesNo = data?.checkList?.result_type === "yesno";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-slideLeft flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="text-red-600" size={24} />
              Update Error
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Review and update inspection error
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Details Section */}
        <div className="space-y-6 flex-1">
          {/* Item Info Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
            <InfoRow label="Item" value={data?.checkList?.item} />
            <InfoRow
              label="Method"
              value={data?.checkList?.check_list_method}
            />
            <InfoRow label="Time" value={data?.checkList?.check_list_time} />
          </div>

          {/* Context Info Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-sm">
            <InfoRow
              label="Assembly"
              value={`${data?.assembly?.assembly_name} (${data?.assembly?.assembly_number})`}
            />
            <InfoRow
              label="Process"
              value={`${data?.process_id?.process_name} (${data?.process_id?.process_no})`}
            />
            <InfoRow
              label="Current Result"
              value={data?.is_error}
              isError={data?.is_error}
            />
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                New Result <span className="text-red-500">*</span>
              </label>

              {isYesNo ? (
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`
                    relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      formik.values.is_error === "true"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 hover:border-emerald-200 hover:bg-slate-50"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="is_error"
                      value="yes"
                      checked={formik.values.is_error === "true"}
                      onChange={formik.handleChange}
                      className="sr-only"
                    />
                    <span className="font-semibold">Yes (Pass)</span>
                  </label>

                  <label
                    className={`
                    relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      formik.values.is_error === "false"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-200 hover:border-red-200 hover:bg-slate-50"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="is_error"
                      value="no"
                      checked={formik.values.is_error === "false"}
                      onChange={formik.handleChange}
                      className="sr-only"
                    />
                    <span className="font-semibold">No (Fail)</span>
                  </label>
                </div>
              ) : (
                <input
                  name="is_error"
                  type="text"
                  placeholder="Enter error value"
                  value={formik.values.is_error}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`
                    w-full px-4 py-3 rounded-xl border bg-white
                    focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all
                    ${
                      formik.errors.is_error && formik.touched.is_error
                        ? "border-red-300 focus:border-red-400"
                        : "border-slate-200 focus:border-blue-400"
                    }
                  `}
                />
              )}

              {formik.touched.is_error && formik.errors.is_error && (
                <p className="text-red-500 text-sm font-medium animate-pulse">
                  {formik.errors.is_error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={updateAssemblyLineError.isPending}
              className={`
                w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-200
                transition-all duration-200 transform active:scale-[0.98]
                ${
                  updateAssemblyLineError.isPending
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl"
                }
              `}
            >
              {updateAssemblyLineError.isPending
                ? "Updating..."
                : "Update Result"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, isError }) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="font-medium text-slate-500 shrink-0">{label}</span>
      <span className={`font-semibold text-right break-words ${
        isError === true ? "text-red-600" : 
        isError === false ? "text-emerald-600" : 
        "text-slate-900"
      }`}>
        {value || "—"}
      </span>
    </div>
  );
}
