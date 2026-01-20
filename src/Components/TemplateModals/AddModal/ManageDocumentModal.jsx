import React, { useEffect, useState } from "react";
import { X, FileText, Upload } from "lucide-react";
import {  useFormik } from "formik";
import { useCheckItem } from "../../../hooks/useCheckItem";
import SearchableDropdownwithRemove from "../../SearchableDropDown/SearchableDropDown2";
import { Field } from "../../modal/addModal/AddCheckItemModal";

const AddDocumentModal = ({
  openModal,
  setOpenModal,
  editData = null,
  mode = "add",
}) => {
  const isView = mode === "view";
  const { GetCategory, AddCategroy } = useCheckItem();
  const [category, setCategoryList] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  
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

  console.log(GetCategory?.data);

  useEffect(() => {
    if (GetCategory?.data) {
      const ListData = GetCategory.data
        .filter((item) => item?.category)
        .map((item) => ({
          category: item.category,
          id: item._id,
        }));

      setCategoryList(ListData);
    }
  }, [GetCategory?.data]);

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
          <Input
            label="Document Name"
            name="document_name"
            value={values.document_name}
            onChange={handleChange}
            readOnly={isView}
          />

          <Field label="Category">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <SearchableDropdownwithRemove
                  placeholder="Select category Time"
                  options={category.map((t) => ({
                    label: t.category,
                    value: t.category,
                    _id: t.id,
                  }))}
                  value={formik.values.category}
                  getOptionLabel={(o) => o.label}
                  getOptionValue={(o) => o.value}
                  getOptionId={(o) => o._id}
                  onChange={(val) => formik.setFieldValue("category", val)}
                  type="category"
                />
              </div>
            </div>

            <div className="w-full flex justify-end pt-2">
              {!showCategory && !isView && (
                <button
                  type="button"
                  className="
                     text-blue-600 text-sm font-medium whitespace-nowrap
                     bg-blue-50 border border-blue-300
                        px-3 py-1.5 rounded-md
                      hover:bg-blue-100 hover:border-blue-400
                        transition-colors
                        "
                  onClick={() => setShowCategory(true)}
                >
                  + Add Time
                </button>
              )}
            </div>

            {showCategory && (
              <div className="flex gap-2 mt-2">
                <input
                  className="input flex-1"
                  placeholder="Enter time"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
                  onClick={() => {
                    if (!newCategory.trim()) return;
                    AddCategroy.mutate({ newCategory: newCategory });
                    setNewCategory("");
                    setShowCategory(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowCategory(false);
                    setNewCategory("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </Field>

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
                <span className="text-sm">{editData.document_file}</span>
              </div>
            ) : (
              <>
                {/* DROP ZONE */}
                <div
                  className="mt-3 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) setFieldValue("document_file", file);
                  }}
                  onClick={() =>
                    document.getElementById("documentUpload").click()
                  }
                >
                  <Upload className="mx-auto mb-3 text-gray-500" size={32} />

                  <p className="text-gray-700 font-medium">
                    Drag and drop here
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    or{" "}
                    <span className="text-blue-600 font-medium">
                      Browse files
                    </span>
                  </p>

                  <input
                    id="documentUpload"
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setFieldValue("document_file", e.target.files[0])
                    }
                  />
                </div>

                {/* FILE INFO */}
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Accepted File Types: PDF, DOC, DOCX, JPG, PNG...</span>
                </div>

                {/* SELECTED FILE */}
                {values.document_file && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                    <FileText size={16} />
                    <span className="truncate max-w-[250px]">
                      {values.document_file.name}
                    </span>
                  </div>
                )}
              </>
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
