import { X } from "lucide-react";
import { useAssemblyLine } from "../../../hooks/useAssemblyLine";
import { useFormik } from "formik";
import { assemblyValidationSchema } from "../../../Validation/AssemblyLineValidation";
import { useCompanies } from "../../../hooks/useCompanies";
import { usePlantsByCompany } from "../../../hooks/UsePlantName";
import { useProcess } from "../../../hooks/useProcess";
import { useEffect } from "react";
import { RegisterEmployee } from "../../../hooks/useRegisterEmployee";
import { UsePart } from "../../../hooks/usePart";
export default function AssemblyLineModal({
  openModal,
  setOpenModal,
  editTable,
  viewModal,
  mode,
}) {
  if (!open) return null;
  const { createAssemblyLine, UpdateAssemblyLine } = useAssemblyLine();
  const { AllCompanyData } = useCompanies();
  const { AllProcessData } = useProcess();
  const { AllEmpData } = RegisterEmployee();
  const { getAllPart } = UsePart();

  const formik = useFormik({
    initialValues: {
      assembly_name: editTable?.assembly_name || viewModal?.assembly_name || "",
      assembly_number:
        editTable?.assembly_number || viewModal?.assembly_number || "",
      company_id: editTable?.company_id?._id || viewModal?.company_id || "",
      plant_id: editTable?.plant_id?._id || viewModal?.plant_id || "",
      responsibility:
        editTable?.responsibility?._id || viewModal?.responsibility || "",
      part_id: editTable?.part_id || viewModal?.part_id?._id || "",
      process_id: editTable?.process_id?.map((i) => i?._id) ||
        viewModal?.process_id || [""],
    },
    validationSchema: assemblyValidationSchema,
    enableReinitialize: true,
    onSubmit: (value) => {
      if (editTable) {
        UpdateAssemblyLine.mutate(
          { id: editTable._id, data: value },
          {
            onSuccess: () => {
              formik.resetForm();
              setOpenModal(false);
            },
            onError: (error) => {
              console.log("Update error:", error);
            },
          }
        );
      } else {
        createAssemblyLine.mutate(value, {
          onSuccess: () => {
            formik.resetForm();
            setOpenModal(false);
          },
          onError: (error) => {
            console.log("Create error:", error);
          },
        });
      }
    },
  });

  const isView = !!viewModal;
  const PlantData = usePlantsByCompany(formik?.values?.company_id);
  const title = {
    add: "Add Assembly Line",
    edit: "Update Assembly Line",
    view: "View Assembly Line Details",
  };

  if (!openModal) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setOpenModal(false)}
      />
      <div
        className="
    ml-auto h-full w-full max-w-md bg-white shadow-xl 
    p-6 relative animate-slideLeft
    overflow-y-auto max-h-screen
  "
      >
        <button
          className="absolute cursor-pointer right-4 top-4 text-gray-600 hover:text-black"
          onClick={() => setOpenModal(false)}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-6">{title[mode]}</h2>
        <form onSubmit={formik.handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Assembly Name <span className="text-red-500">*</span>
            </span>
            <input
              name="assembly_name"
              value={formik.values.assembly_name}
              onChange={formik.handleChange}
              disabled={isView}
              type="text"
              placeholder="Assembly name"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.errors.assembly_name && formik.touched.assembly_name && (
              <p className="text-sm text-red-500">
                {formik.errors.assembly_name}
              </p>
            )}
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Assembly Line No. <span className="text-red-500">*</span>
            </span>
            <input
              name="assembly_number"
              value={formik.values.assembly_number}
              onChange={formik.handleChange}
              disabled={isView}
              type="text"
              placeholder="Assembly line no."
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formik.errors.assembly_number &&
              formik.touched.assembly_number && (
                <p className="text-sm text-red-500">
                  {formik.errors.assembly_number}
                </p>
              )}
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">
              Select Company <span className="text-red-500">*</span>
            </span>
            <select
              name="company_id"
              value={formik.values.company_id}
              onChange={formik.handleChange}
              disabled={isView}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Select</option>
              {AllCompanyData?.data?.map((i) => (
                <option key={i?._id} value={i?._id}>
                  {i?.company_name}
                </option>
              ))}
            </select>
            {formik.errors.company_id && formik.touched.company_id && (
              <p className="text-sm text-red-500">{formik.errors.company_id}</p>
            )}
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">
              Select Plant <span className="text-red-500">*</span>
            </span>
            <select
              name="plant_id"
              value={formik.values.plant_id}
              onChange={formik.handleChange}
              disabled={isView || !formik.values.company_id}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Select</option>
              {PlantData?.data?.map((i) => (
                <option key={i?._id} value={i?._id}>
                  {i?.plant_name}
                </option>
              ))}
            </select>
            {formik.errors.plant_id && formik.touched.plant_id && (
              <p className="text-sm text-red-500">{formik.errors.plant_id}</p>
            )}
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">
              Select Process <span className="text-red-500">*</span>
            </span>

            {formik.values.process_id.map((item, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <select
                  name={`process_id[${index}]`}
                  value={formik.values.process_id[index]}
                  onChange={(e) => {
                    const updated = [...formik.values.process_id];
                    updated[index] = e.target.value;
                    formik.setFieldValue("process_id", updated);
                  }}
                  disabled={isView}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  {AllProcessData?.data?.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.process_name} ({i.process_no})
                    </option>
                  ))}
                </select>

                {!isView && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formik.values.process_id];
                      updated.splice(index, 1);
                      formik.setFieldValue("process_id", updated);
                    }}
                    className="group relative ml-2 rounded-full p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {formik.errors.process_id && formik.touched.process_id && (
              <p className="text-sm text-red-500">{formik.errors.process_id}</p>
            )}
          </label>
          {!isView && (
            <button
              type="button"
              onClick={() =>
                formik.setFieldValue("process_id", [
                  ...formik.values.process_id,
                  "",
                ])
              }
              className="mb-6 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition-all duration-200"
            >
              + Add Process
            </button>
          )}

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">
              Select Responsibility <span className="text-red-500">*</span>
            </span>
            <select
              name="responsibility"
              value={formik.values.responsibility}
              onChange={formik.handleChange}
              disabled={isView}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Select</option>
              {AllEmpData?.data?.map((i) => (
                <option key={i?._id} value={i?._id}>
                  {i?.full_name} ({i?.user_id})
                </option>
              ))}
            </select>
            {formik.errors.responsibility && formik.touched.responsibility && (
              <p className="text-sm text-red-500">
                {formik.errors.responsibility}
              </p>
            )}
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">
              Select Part <span className="text-red-500">*</span>
            </span>
            <select
              name="part_id"
              value={formik.values.part_id}
              onChange={formik.handleChange}
              disabled={isView}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Select</option>
              {getAllPart?.data?.map((i) => (
                <option key={i?._id} value={i?._id}>
                  {i?.part_name} ({i?.part_number})
                </option>
              ))}
            </select>
            {formik.errors.part_id && formik.touched.part_id && (
              <p className="text-sm text-red-500">{formik.errors.part_id}</p>
            )}
          </label>

          <button
            type="submit"
            disabled={isView}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {title[mode]}
          </button>
        </form>
      </div>
    </div>
  );
}
