import React from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";

const AddReleaseGroupModal = ({
  openModal,
  setOpenModal,
  editData = null,
  mode = "add",
}) => {
  const isView = mode === "view";

  const title = {
    add: "Add Release Group",
    edit: "Update Release Group",
    view: "View Release Group",
  };

  const formik = useFormik({
    initialValues: {
      group_name: editData?.group_name || "",
      group_department: editData?.group_department || "",
      groupusers: editData?.groupusers || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Release Group Data:", values);
      setOpenModal(false);
      formik.resetForm();
    },
  });

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
        {/* Close */}
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
        <form onSubmit={formik.handleSubmit}>
          {/* Group Name */}
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Group Name{" "}
              {mode !== "view" && <span className="text-red-500">*</span>}
            </span>
            <input
              type="text"
              name="group_name"
              placeholder="Release Group Name"
              value={formik.values.group_name}
              onChange={formik.handleChange}
              readOnly={isView}
              className="mt-2 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          {/* Department */}
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Department{" "}
              {mode !== "view" && <span className="text-red-500">*</span>}
            </span>
            <input
              type="text"
              name="group_department"
              placeholder="Department Name"
              value={formik.values.group_department}
              onChange={formik.handleChange}
              readOnly={isView}
              className="mt-2 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          {/* Users Count */}
          <label className="block mb-6">
            <span className="text-gray-700 font-medium">
              Users Count
            </span>
            <input
              type="number"
              name="groupusers"
              placeholder="Number of users"
              value={formik.values.groupusers}
              onChange={formik.handleChange}
              readOnly={isView}
              className="mt-2 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>

          {/* Submit */}
          {mode !== "view" && (
            <button
              type="submit"
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

export default AddReleaseGroupModal;
