import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddDepartmentModal = ({
  openModal,
  setOpenModal,
  editData = null,
  mode = "add", // add | edit | view
}) => {
  const isView = mode === "view";

  const title = {
    add: "Add Department",
    edit: "Update Department",
    view: "View Details",
  };

  const [formData, setFormData] = useState({
    department_name: "",
    department_code: "",
    description: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        department_name: editData.department_name || "",
        department_code: editData.department_code || "",
        description: editData.description || "",
      });
    } else {
      setFormData({
        department_name: "",
        department_code: "",
        description: "",
      });
    }
  }, [editData, openModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className={`${
        openModal ? "translate-x-0" : "translate-x-full"
      } fixed inset-0 bg-black/40 z-50 flex justify-end`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setOpenModal(false)}
      />

      {/* Drawer */}
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-6 relative animate-slideLeft">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
          onClick={() => setOpenModal(false)}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6">
          {title[mode]}
        </h2>

        {/* Form */}
        <form>
          {/* Department Name */}
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Department Name{" "}
              {mode !== "view" && <span className="text-red-500">*</span>}
            </span>
            <input
              type="text"
              name="department_name"
              placeholder="Department Name"
              value={formData.department_name}
              onChange={handleChange}
              readOnly={isView}
              className="mt-2 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          {/* Department Code */}
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Department Code{" "}
              {mode !== "view" && <span className="text-red-500">*</span>}
            </span>
            <input
              type="text"
              name="department_code"
              placeholder="Department Code"
              value={formData.department_code}
              onChange={handleChange}
              readOnly={isView}
              className="mt-2 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          {/* Description */}
          <label className="block mb-6">
            <span className="text-gray-700 font-medium">
              Description <span className="font-light">(optional)</span>
            </span>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              readOnly={isView}
              className="mt-2 w-full px-4 py-3 border rounded-lg h-24 resize-none border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          {/* Submit Button */}
          {mode !== "view" && (
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {title[mode]}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
