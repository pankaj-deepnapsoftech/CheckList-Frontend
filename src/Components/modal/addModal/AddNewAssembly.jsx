import React from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import { useAssemblyLine } from "../../../hooks/useAssemblyLine";
import { useCompanies } from "../../../hooks/useCompanies";
import { usePlantsByCompany } from "../../../hooks/UsePlantName";
import { useProcess } from "../../../hooks/useProcess";
import { RegisterEmployee } from "../../../hooks/useRegisterEmployee";
import { UsePart } from "../../../hooks/usePart";
import { assemblyValidationSchema } from "../../../Validation/AssemblyLineValidation";

export default function AssemblyLineModal({ openModal, setOpenModal, editTable, viewModal, mode }) {
  if (!openModal) return null;

  const { createAssemblyLine, UpdateAssemblyLine } = useAssemblyLine();
  const { AllCompanyData } = useCompanies();
  const { AllProcessData } = useProcess();
  const { AllEmpData } = RegisterEmployee();
  const { getAllPart } = UsePart();

  const isView = mode === "view";


  const getInitialValues = () => {
    const existingProcesses =
      editTable?.process_id?.map(i => i?._id).filter(Boolean) ||
      viewModal?.process_id?.map(i => i?._id).filter(Boolean);

    return {
      assembly_name: editTable?.assembly_name || viewModal?.assembly_name || "",
      assembly_number: editTable?.assembly_number || viewModal?.assembly_number || "",
      company_id: editTable?.company_id?._id || viewModal?.company_id?._id || "",
      plant_id: editTable?.plant_id?._id || viewModal?.plant_id?._id || "",
      responsibility: editTable?.responsibility?._id || viewModal?.responsibility?._id || "",
      part_id: editTable?.part_id || viewModal?.part_id || "",

      process_id:
        existingProcesses?.length
          ? existingProcesses
          : AllProcessData?.data?.length
            ? [AllProcessData.data?._id]   
            : []
    };
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(),
    validationSchema: mode !== "assign" ? assemblyValidationSchema : null,
    onSubmit: (values) => {
    
      const payload = mode === "assign" 
        ? { ...values } 
        : {
          
          assembly_name: values.assembly_name,
          assembly_number: values.assembly_number,
          company_id: values.company_id,
          plant_id: values.plant_id,
        };

      if (editTable) {
        UpdateAssemblyLine.mutate(
          { id: editTable._id, data: payload },
          {
            onSuccess: () => setOpenModal(false),
            onError: (err) => console.log("Update Error:", err)
          }
        );
      } else {
        createAssemblyLine.mutate(payload, {
          onSuccess: () => setOpenModal(false),
          onError: (err) => console.log("Create Error:", err)
        });
      }
    }


 
  });
  const PlantData = usePlantsByCompany(formik.values.company_id || editTable?.company_id || viewModal?.company_id);
  const title = {
    add: "Add Assembly Line",
    edit: "Edit Assembly Line",
    view: "View Assembly Line",
    assign: "Assign Processes / Responsibilities"
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpenModal(false)} />
      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-6 relative animate-slideLeft overflow-y-auto max-h-screen">
        <button className="absolute right-4 top-4 text-gray-600 hover:text-black" onClick={() => setOpenModal(false)}>
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-6">{title[mode]}</h2>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {mode !== "assign" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assembly Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="assembly_name"
                  value={formik.values.assembly_name}
                  onChange={formik.handleChange}
                  disabled={isView}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.assembly_name && formik.errors.assembly_name && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.assembly_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assembly Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="assembly_number"
                  value={formik.values.assembly_number}
                  onChange={formik.handleChange}
                  disabled={isView}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.assembly_number && formik.errors.assembly_number && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.assembly_number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  name="company_id"
                  value={formik.values.company_id}
                  onChange={formik.handleChange}
                  disabled={isView}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {AllCompanyData?.data?.map((c) => (
                    <option key={c._id} value={c._id}>{c.company_name}</option>
                  ))}
                </select>
                {formik.touched.company_id && formik.errors.company_id && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.company_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plant</label>
                <select
                  name="plant_id"
                  value={formik.values.plant_id}
                  onChange={formik.handleChange}
                  disabled={isView || !formik.values.company_id}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {PlantData?.data?.map((p) => (
                    <option key={p._id} value={p._id}>{p.plant_name}</option>
                  ))}
                </select>
                {formik.touched.plant_id && formik.errors.plant_id && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.plant_id}
                  </p>
                )}
              </div>
            </>
          )}

          {mode === "assign" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibility</label>
                <select
                  name="responsibility"
                  value={formik.values.responsibility}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option >Select</option>
                  {AllEmpData?.data?.map((e) => (
                    <option key={e?._id} value={e?._id}>{e?.full_name} ({e?.user_id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part</label>
                <select
                  name="part_id"
                  value={formik.values.part_id}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {getAllPart?.data?.map((p) => (
                    <option key={p._id} value={p._id}>{p.part_name} ({p.part_number})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processes</label>
                {formik.values.process_id.map((pid, index) => (
                  <div key={index} className="flex gap-2 mt-1">
                    <select
                      value={pid || ""}
                      onChange={(e) => {
                        const updated = [...formik.values.process_id];
                        updated[index] = e.target.value;
                        formik.setFieldValue("process_id", updated);
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      {AllProcessData?.data?.map((p) => (
                        <option key={p._id} value={p._id}>{p.process_name} ({p.process_no})</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formik.values.process_id];
                        updated.splice(index, 1);
                        formik.setFieldValue("process_id", updated);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => formik.setFieldValue("process_id", [...formik.values.process_id, ""])}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Add Process
                </button>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setOpenModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            {!isView && (
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {mode === "assign" ? "Assign" : "Save"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
