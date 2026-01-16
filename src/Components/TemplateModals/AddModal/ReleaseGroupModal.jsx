import React from "react";
import { UserCheck, Wand, X } from "lucide-react";
import { useFormik } from "formik";

const USER_OPTIONS = ["Rahul", "Amit", "Neha"];
const PLANT_OPTIONS = ["ItsyBuzz", "Plant-X", "Plant-Y"];

const AddReleaseGroupModal = ({
  openModal,
  setOpenModal,
  editData = null,
  mode = "add",
}) => {
  const isView = mode === "view";

  const titleMap = {
    add: "Add Release Group",
    edit: "Update Release Group",
    view: "View Release Group",
  };

  const formik = useFormik({
    initialValues: {
      group_name: editData?.group_name ?? "",
      group_department: editData?.group_department ?? "",
      selectedUser: "",
      selectedPlant: "",
      users_plants: editData?.users_plants ?? [],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("FINAL DATA 👉", values);
      setOpenModal(false);
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  const handleAddUserPlant = () => {
    const { selectedUser, selectedPlant, users_plants } = values;

    if (!selectedUser || !selectedPlant) return;

    const isDuplicate = users_plants.some(
      (item) => item.user === selectedUser && item.plant === selectedPlant
    );

    if (isDuplicate) {
      alert("This user is already added with this plant");
      return;
    }

    setFieldValue("users_plants", [
      ...users_plants,
      { user: selectedUser, plant: selectedPlant },
    ]);

    setFieldValue("selectedUser", "");
    setFieldValue("selectedPlant", "");
  };

  const handleRemove = (index) => {
    setFieldValue(
      "users_plants",
      values.users_plants.filter((_, i) => i !== index)
    );
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <div className="absolute inset-0" onClick={() => setOpenModal(false)} />

      <div className="relative h-full w-full max-w-md bg-white shadow-xl p-6">
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-black"
          onClick={() => setOpenModal(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">{titleMap[mode]}</h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Group Name"
            name="group_name"
            value={values.group_name}
            onChange={handleChange}
            readOnly={isView}
          />

          <Input
            label="Department"
            name="group_department"
            value={values.group_department}
            onChange={handleChange}
            readOnly={isView}
          />

          <Select
            label="User"
            name="selectedUser"
            value={values.selectedUser}
            onChange={handleChange}
            options={USER_OPTIONS}
            disabled={isView}
          />

          <Select
            label="Plant"
            name="selectedPlant"
            value={values.selectedPlant}
            onChange={handleChange}
            options={PLANT_OPTIONS}
            disabled={isView}
          />

          {!isView && (
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={handleAddUserPlant}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Add User & Plant
              </button>
            </div>
          )}

          {values.users_plants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Selected Users & Plants
              </p>

              <div className="flex  gap-2">
                {values.users_plants.map((item, index) => (
                  <div
                    key={`${item.user}-${item.plant}-${index}`}
                    className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-3 py-2 rounded-full text-sm text-gray-800 shadow-sm"
                  >
                 
                    <div className="flex items-center gap-1">
                      <UserCheck size={14} className="text-blue-600" />
                      <span className="font-medium">{item.user}</span>
                    </div>

                    <span className="text-gray-400">|</span>

                    
                    <div className="flex items-center gap-1">
                      <Wand size={14} className="text-green-600" />
                      <span>{item.plant}</span>
                    </div>

                    {!isView && (
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isView && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
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
    <input {...props} className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg" />
  </label>
);

const Select = ({ label, options, ...props }) => (
  <label className="block mb-4">
    <span className="font-medium">{label}</span>
    <select
      {...props}
      className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

export default AddReleaseGroupModal;
