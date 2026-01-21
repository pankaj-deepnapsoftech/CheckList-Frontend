import { X } from "lucide-react";
import { useFormik } from "formik";
import { useWorkflow } from "../../../hooks/useWorkflow";
import { workflowValidationSchema } from "../../../Validation/WorkflowValidation";

const ManageWorkflowModal = ({
  openModal,
  setOpenModal,
  editTable,
  viewModal,
  mode,
  setMode,
}) => {
  const { create, update } = useWorkflow();

  // Workflow management options - can be replaced with API data later
  const workflowManagementOptions = [
    { label: "Approval Workflow", value: "approval" },
    { label: "Review Workflow", value: "review" },
    { label: "Processing Workflow", value: "processing" },
    { label: "Verification Workflow", value: "verification" },
    { label: "Custom Workflow", value: "custom" },
  ];

  const formik = useFormik({
    initialValues: {
      name: editTable?.name || viewModal?.name || "",
      workflow_management:
        editTable?.workflow_management ||
        viewModal?.workflow_management ||
        "",
    },
    validationSchema: workflowValidationSchema,
    enableReinitialize: true,
    onSubmit: (value) => {
      if (editTable) {
        update.mutate(
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
        create.mutate(value, {
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

  const isView = mode === "view";
  const title = {
    add: "Add New Manage Workflow",
    edit: "Update Manage Workflow",
    view: "View Workflow Details",
  };

  if (!openModal) return null;

  return (
    <div
      className={`${openModal ? "translate-x-0" : "translate-x-full"}
 fixed inset-0 bg-black/40  z-50 flex justify-end`}
    >
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title[mode]}</h2>
          <button
            className="cursor-pointer"
            onClick={() => {
              setOpenModal(false);
              formik.resetForm();
            }}
          >
            <X size={22} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
              value={formik.values.name}
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              required
              placeholder="Enter workflow name"
            />

            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">
              Workflow Management <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
              value={formik.values.workflow_management}
              name="workflow_management"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              required
            >
              <option value="">Select workflow management</option>
              {workflowManagementOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {formik.touched.workflow_management &&
              formik.errors.workflow_management && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.workflow_management}
                </p>
              )}
          </div>

          {!isView && (
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
              disabled={create.isPending || update.isPending}
            >
              {create.isPending || update.isPending
                ? "Saving..."
                : editTable
                ? "Update Workflow"
                : "Add Workflow"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ManageWorkflowModal;
