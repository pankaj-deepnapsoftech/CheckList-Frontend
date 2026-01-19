import React from "react";
import { X, FileText, Upload } from "lucide-react";
import { useFormik } from "formik";

const AddDocumentModal = ({
  openModal,
  setOpenModal,
  editData = null,
  mode = "add",
}) => {
  const isView = mode === "view";

  const titleMap = {
    add: "Add Document",
    edit: "Update Document",
    view: "View Document",
  };

  const formik = useFormik({
    initialValues: {
      document_name: editData?.document_name ?? "",
      category: editData?.category ?? "",
      expiry_date: editData?.expiry_date ?? "",
      document_file: null,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("DOCUMENT DATA 👉", values);
      setOpenModal(false);
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="absolute inset-0" onClick={() => setOpenModal(false)} />

      <div className="relative h-full w-full max-w-md bg-white shadow-xl p-6">
        {/* CLOSE */}
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
          onClick={() => setOpenModal(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">{titleMap[mode]}</h2>

        <form onSubmit={handleSubmit}>
          {/* DOCUMENT NAME */}
          <Input
            label="Document Name"
            name="document_name"
            value={values.document_name}
            onChange={handleChange}
            readOnly={isView}
          />

          {/* CATEGORY */}
          <Input
            label="Category"
            name="category"
            value={values.category}
            onChange={handleChange}
            readOnly={isView}
          />

          {/* EXPIRY DATE */}
          <Input
            type="date"
            label="Expiry Date"
            name="expiry_date"
            value={values.expiry_date}
            onChange={handleChange}
            readOnly={isView}
          />

          {/* FILE UPLOAD */}
          <label className="block mb-6">
            <span className="font-medium">Attach Document</span>

            {isView && editData?.document_file ? (
              <div className="mt-3 flex items-center gap-2 text-blue-600">
                <FileText size={18} />
                <span className="text-sm">
                  {editData.document_file}
                </span>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload size={18} />
                  <span className="text-sm">Choose File</span>
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      setFieldValue("document_file", e.target.files[0])
                    }
                  />
                </label>

                {values.document_file && (
                  <span className="text-sm text-gray-600 truncate max-w-[180px]">
                    {values.document_file.name}
                  </span>
                )}
              </div>
            )}
          </label>

          {/* SUBMIT */}
          {!isView && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              {titleMap[mode]}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const Input = ({ label, ...props }) => (
  <label className="block mb-4">
    <span className="font-medium">{label}</span>
    <input
      {...props}
      className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg"
    />
  </label>
);

export default AddDocumentModal;
