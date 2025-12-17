import { X } from "lucide-react";
import { useAssemblyLine } from "../../../hooks/useAssemblyLine";
import { useFormik } from "formik";
import { assemblyValidationSchema } from "../../../Validation/AssemblyLineValidation";
import { useCompanies } from "../../../hooks/useCompanies";
import { usePlantsByCompany } from "../../../hooks/UsePlantName";
import { useProcess } from "../../../hooks/useProcess";
import { RegisterEmployee } from "../../../hooks/useRegisterEmployee";
import { UsePart } from "../../../hooks/usePart";
export default function AssemblyLineModal({ openModal, setOpenModal, editTable, viewModal, mode }) {
  if (!open) return null;
  const { createAssemblyLine, UpdateAssemblyLine } = useAssemblyLine()
  const { AllCompanyData } = useCompanies()
  const { AllProcessData } = useProcess()
  const { AllEmpData } = RegisterEmployee()
  const { getAllPart } = UsePart()


 
  const formik = useFormik({
    initialValues: {
      assembly_name:
        editTable?.assembly_name || viewModal?.assembly_name || "",
      assembly_number:
        editTable?.assembly_number || viewModal?.assembly_number || "",
      company_id: editTable?.company_id?._id || viewModal?.company_id || "",
      plant_id: editTable?.plant_id?._id || viewModal?.plant_id || "",
      responsibility: editTable?.responsibility?._id || viewModal?.responsibility || "",
      part_id: editTable?.part_id || viewModal?.part_id?._id || "",
      process_id: editTable?.process_id?.map((i)=> i?._id) || viewModal?.process_id || [""],
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
          }
        );
      } else {
        createAssemblyLine.mutate(value, {
          onSuccess: () => {
            formik.resetForm();
            setOpenModal(false);
          },
        });
      }
    },
  });

  const isView = !!viewModal;
  const PlantData = usePlantsByCompany(formik.values.company_id);

  const title = {
    add: "Add Assembly Line",
    edit: "Update Assembly Line",
    view: "View Assembly Line Details",
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setOpenModal(false)}
      />

      {/* Drawer */}
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl relative animate-slideLeft flex flex-col">
        {/* Header */}
        <div className="p-6 relative">
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-black"
            onClick={() => setOpenModal(false)}
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold">{title[mode]}</h2>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={formik.handleSubmit}>
            {/* Assembly Name */}
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
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              />
            </label>

            {/* Assembly Number */}
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
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              />
            </label>

            {/* Company */}
            <label className="block mb-4">
              <span className="text-gray-700 font-medium">
                Select Company <span className="text-red-500">*</span>
              </span>
              <select
                name="company_id"
                value={formik.values.company_id}
                onChange={formik.handleChange}
                disabled={isView}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select</option>
                {AllCompanyData?.data?.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.company_name}
                  </option>
                ))}
              </select>
            </label>

            {/* Plant */}
            <label className="block mb-4">
              <span className="text-gray-700 font-medium">
                Select Plant <span className="text-red-500">*</span>
              </span>
              <select
                name="plant_id"
                value={formik.values.plant_id}
                onChange={formik.handleChange}
                disabled={isView || !formik.values.company_id}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select</option>
                {PlantData?.data?.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.plant_name}
                  </option>
                ))}
              </select>
            </label>

            {/* Processes */}
            <label className="block mb-6">
              <span className="text-gray-700 font-medium">
                Select Process <span className="text-red-500">*</span>
              </span>

              <div className="mt-2 space-y-3">
                {formik.values.processes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <select
                      name={`processes[${index}].process_id`}
                      value={item.process_id}
                      onChange={formik.handleChange}
                      disabled={isView}
                      className="flex-1 bg-transparent outline-none text-sm"
                    >
                      <option value="">Select Process</option>
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
                          const updated = [...formik.values.processes];
                          updated.splice(index, 1);
                          formik.setFieldValue("processes", updated);
                        }}
                        className="text-red-500 hover:bg-red-100 rounded-full p-2 transition"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </label>

            {!isView && (
              <button
                type="button"
                onClick={() =>
                  formik.setFieldValue("processes", [
                    ...formik.values.processes,
                    { process_id: "" },
                  ])
                }
                className="mb-6 w-full border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                + Add Process
              </button>
            )}

            {/* Responsibility */}
            <label className="block mb-6">
              <span className="text-gray-700 font-medium">
                Select Responsibility <span className="text-red-500">*</span>
              </span>
              <select
                name="responsibility"
                value={formik.values.responsibility}
                onChange={formik.handleChange}
                disabled={isView}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select</option>
                {AllEmpData?.data?.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.full_name} ({i.user_id})
                  </option>
                ))}
              </select>
            </label>

            {!isView && (
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
    </div>
  );
}
