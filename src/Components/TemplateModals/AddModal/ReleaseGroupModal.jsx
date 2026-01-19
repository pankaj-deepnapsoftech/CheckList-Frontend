import React from "react";
import { UserCheck, Wand, X } from "lucide-react";
import { useFormik } from "formik";
import { RegisterEmployee } from "../../../hooks/useRegisterEmployee";
import { UsePlantName } from "../../../hooks/UsePlantName";
import { useReleaseGroup } from "../../../hooks/Template Hooks/useReleaseGroup";
import { useDepartment } from "../../../hooks/useDepartment";

const AddReleaseGroupModal = ({
  openModal,
  setOpenModal,
  editData = null,
  mode = "add",
}) => {
  const { getAllEmployee } = RegisterEmployee();
  const { getAllPlantName } = UsePlantName();
  const { postReleaseGroup } = useReleaseGroup();
  const { getAllDepartmentData } = useDepartment();

  const USER_OPTIONS = getAllEmployee?.data || [];
  const PLANT_OPTIONS = getAllPlantName?.data || [];

  const isView = mode === "view";

  const titleMap = {
    add: "Add Release Group",
    edit: "Update Release Group",
    view: "View Release Group",
  };

  /* ---------------- Lookup Maps (ID → Name) ---------------- */

  const userMap = React.useMemo(() => {
    const map = {};
    USER_OPTIONS.forEach((u) => {
      map[u._id] = u.full_name;
    });
    return map;
  }, [USER_OPTIONS]);

  const plantMap = React.useMemo(() => {
    const map = {};
    PLANT_OPTIONS.forEach((p) => {
      map[p._id] = p.plant_name;
    });
    return map;
  }, [PLANT_OPTIONS]);

  /* ---------------- Formik ---------------- */

  const formik = useFormik({
    initialValues: {
      group_name: editData?.group_name ?? "",
      group_department: editData?.group_department ?? "",
      users: editData?.users ?? [],
    },

    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        group_name: values.group_name,
        group_department: values.group_department,
        users: values.users,
      };

      console.log("Payload:", payload);

      postReleaseGroup.mutate(payload, {
        onSuccess: () => {
          setOpenModal(false);
          formik.resetForm();
        },
      });
    },
  });

  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  /* ---------------- Handlers ---------------- */

  const handleAddUserPlant = () => {
    const { selectedUser, selectedPlant, users } = values;

    if (!selectedUser || !selectedPlant) return;

    const userIndex = users.findIndex((u) => u.user_id === selectedUser);

    // user already exists → add plant
    if (userIndex !== -1) {
      const user = users[userIndex];

      if (user.plants_id.includes(selectedPlant)) {
        alert("This plant is already added for this user");
        return;
      }

      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...user,
        plants_id: [...user.plants_id, selectedPlant],
      };

      setFieldValue("users", updatedUsers);
    }
    // new user → create user with plant
    else {
      setFieldValue("users", [
        ...users,
        {
          user_id: selectedUser,
          plants_id: [selectedPlant],
        },
      ]);
    }

    setFieldValue("selectedPlant", "");
  };

  const handleRemove = (index) => {
    setFieldValue(
      "users",
      values.users.filter((_, i) => i !== index),
    );
  };

  const selectedUserPlants = React.useMemo(() => {
    if (!values.selectedUser) return [];

    const user = values.users.find((u) => u.user_id === values.selectedUser);

    return user?.plants_id || [];
  }, [values.selectedUser, values.users]);

 const filteredPlantOptions = React.useMemo(() => {

  const usedPlants = values.users.flatMap((u) => u.plants_id);

  
  return PLANT_OPTIONS.filter(
    (plant) => !usedPlants.includes(plant._id)
  );
}, [PLANT_OPTIONS, values.users]);


  if (!openModal) return null;

  /* ---------------- UI ---------------- */

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
            label="Group Department"
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
            getLabel={(opt) => opt.full_name}
          />

     <Select
  label="Plant"
  name="selectedPlant"
  value={values.selectedPlant}
  onChange={handleChange}
  options={filteredPlantOptions}
  disabled={isView || !values.selectedUser || filteredPlantOptions.length === 0}
  getLabel={(opt) => opt.plant_name}
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

          {values.users.map((user, userIndex) => (
            <div
              key={user.user_id}
              className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <UserCheck size={16} className="text-blue-600" />
                <span className="font-semibold">{userMap[user.user_id]}</span>
              </div>

              <div className="flex flex-wrap gap-2 ml-6">
                {user.plants_id.map((plantId, plantIndex) => (
                  <div
                    key={plantId}
                    className="flex items-center gap-2 bg-white border px-3 py-1 rounded-full text-sm"
                  >
                    <Wand size={14} className="text-green-600" />
                    <span>{plantMap[plantId]}</span>

                    {!isView && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedUsers = [...values.users];
                          updatedUsers[userIndex].plants_id = updatedUsers[
                            userIndex
                          ].plants_id.filter((_, i) => i !== plantIndex);

                          // remove user if no plants left
                          if (updatedUsers[userIndex].plants_id.length === 0) {
                            updatedUsers.splice(userIndex, 1);
                          }

                          setFieldValue("users", updatedUsers);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

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

/* ---------------- Reusable Components ---------------- */

const Input = ({ label, ...props }) => (
  <label className="block mb-4">
    <span className="font-medium">{label}</span>
    <input
      {...props}
      className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg"
    />
  </label>
);

const Select = ({ label, options, getLabel, ...props }) => (
  <label className="block mb-4">
    <span className="font-medium">{label}</span>
    <select
      {...props}
      className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg"
    >
      <option value="">
        {options.length === 0 ? "No plants available" : `Select ${label}`}
      </option>

      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {getLabel(opt)}
        </option>
      ))}
    </select>
  </label>
);

export default AddReleaseGroupModal;
