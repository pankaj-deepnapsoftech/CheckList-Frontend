import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Eye, Search, X, Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterEmployee } from "../hooks/useRegisterEmployee";
import { useTemplateSubmission } from "../hooks/Template Hooks/useTemplateSubmission";
import { useFormik } from "formik";
import { useLogin } from "../hooks/useLogin";

const InfoItem = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
      {label}
    </p>
    <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
  </div>
);

/* -------------------- Main Component -------------------- */
export default function TemplateApproveReject() {
  const queryClient = useQueryClient();
  const { getAllAssignedTemp, PostHistorTem } = RegisterEmployee();
  const { updateSubmission } = useTemplateSubmission();
  const [approvalTemplate, setApprovalTemplate] = useState(null);
  const [rejectionTemplate, setRejectionTemplate] = useState(null);
  const { logedinUser } = useLogin();
  const [searchText, setSearchText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const assignedTemplates =
    getAllAssignedTemp?.data?.flatMap(
      (user) =>
        user?.assigned_templates?.map((t) => ({
          ...t,
          user_id: user?.user_id,
          user_db_id: user?._id,
          full_name: user?.full_name,
          email: user?.email,
          employee_plant: user?.employee_plant,
        })) || [],
    ) || [];

  const currentUserId = logedinUser?.data?._id;
  const filteredTemplates = assignedTemplates.filter((t) => {
    if (!t?.template_name?.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }

    const approvals = t?.approvals || [];
    const workflowSteps = t?.workflow?.workflow || [];

   
    const lastApprovedStage =
      approvals.length > 0
        ? Math.max(...approvals.map((a) => a.current_stage))
        : -1;

   
    const nextStageIndex = lastApprovedStage + 1;
    const nextStage = workflowSteps[nextStageIndex];

    if (!nextStage) return false;


    if (nextStage.group === "HOD") {
      const hodAlreadyApproved = approvals.some(
        (a) =>
          a.current_stage === nextStageIndex && a.approved_by === currentUserId,
      );

      return !hodAlreadyApproved;
    }


    const groupUsers = nextStage.group_users || [];
    if (groupUsers.length === 0) return false;

   
    const stageApprovals = approvals.filter(
      (a) => a.current_stage === nextStageIndex,
    );

 
    const nextApproverIndex = stageApprovals.length;

    const nextApprover = groupUsers[nextApproverIndex];

    return nextApprover?.user_id === currentUserId;
  });



  const formik = useFormik({
    initialValues: {
      current_stage: 0,
      reassign_stage: null,
      workflow_id: "",
      status: "",
      remarks: "",
      user_id: "",
      template_id: "",
    },
    onSubmit: (values) => {
      PostHistorTem.mutate(values, {
        onSuccess: () => {
          setIsApprovalOpen(false);
          setIsRejectionOpen(false);
          setApprovalTemplate(null);
          setRejectionTemplate(null);
          formik.resetForm();
        },
      });
    },
  });

  useEffect(() => {
    if (approvalTemplate) {
      formik.setValues({
        current_stage: approvalTemplate?.approvals?.length || 0,
        reassign_stage: null,
        workflow_id: approvalTemplate?.workflow?.workflow_id || "",
        status: "approved",
        remarks: "",
        user_id: approvalTemplate?.user_db_id || "",
        template_id: approvalTemplate?.template_id || "",
      });
    }
  }, [approvalTemplate]);

  useEffect(() => {
    if (rejectionTemplate) {
      formik.setValues({
        current_stage: rejectionTemplate?.approvals?.length || 0,
        reassign_stage: null,
        workflow_id: rejectionTemplate?.workflow?.workflow_id || "",
        status: "rejected",
        remarks: "",
        user_id: rejectionTemplate?.user_db_id || "",
        template_id: rejectionTemplate?.template_id || "",
      });
    }
  }, [rejectionTemplate]);

  const handleReject = (id) => {
    const tpl = assignedTemplates.find((t) => t.template_id === id);
    if (tpl) {
      setRejectionTemplate(tpl);
      setIsRejectionOpen(true);
    }
  };

  const handleApprove = (id) => {
    const tpl = assignedTemplates.find((t) => t.template_id === id);
    if (tpl) {
      setApprovalTemplate(tpl);
      setIsApprovalOpen(true);
    }
  };

  const openViewModal = (template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedTemplate(null);
    setIsViewModalOpen(false);
  };

  const openEditModal = (template) => {
    if (!template?.submission?.submission_id) return;
    setEditTemplate(template);
    setEditFormData({ ...(template.submission?.form_data || {}) });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setEditTemplate(null);
    setEditFormData({});
    setIsEditOpen(false);
  };

  const handleEditFieldChange = (fieldKey, value) => {
    setEditFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleEditSave = () => {
    if (!editTemplate?.submission?.submission_id) return;
    updateSubmission.mutate(
      {
        id: editTemplate.submission.submission_id,
        payload: {
          form_data: editFormData,
          status: editTemplate.submission?.status || "SUBMITTED",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-assign-template"] });
          closeEditModal();
          if (selectedTemplate?.template_id === editTemplate?.template_id) {
            setSelectedTemplate((prev) =>
              prev
                ? {
                    ...prev,
                    submission: {
                      ...prev.submission,
                      form_data: editFormData,
                    },
                  }
                : null
            );
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Template Approval
          </h1>
          <p className="text-sm text-gray-600">
            Review, validate, and manage submitted templates
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
            size={18}
          />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-xl border border-indigo-100 bg-white px-10 py-2.5 text-sm shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
        </div>

        {/* Template Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates?.map((template) => (
            <div
              key={template.template_id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm
                       transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                {template?.template_name}
              </h3>

              <div className="mt-2 mb-3 space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Employee:</span>{" "}
                  {template?.full_name || "N/A"}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {template?.email || "N/A"}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {template?.template_type}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  {Object.keys(template?.submission?.form_data || {}).length}{" "}
                  fields
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Status:</span>{" "}
                  <span className="capitalize">
                    {template?.submission?.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-800">Submitted:</span>{" "}
                  {new Date(
                    template?.submission?.submitted_at,
                  ).toLocaleString()}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => openViewModal(template)}
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-2 rounded-xl border
                           bg-white py-2 text-sm font-medium text-gray-700
                           hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => openEditModal(template)}
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-2 rounded-xl border
                           border-amber-200 bg-amber-50 py-2 text-sm font-medium text-amber-800
                           hover:bg-amber-100 hover:border-amber-300"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setIsApprovalOpen(true);
                    setApprovalTemplate(template);
                  }}
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-1 rounded-xl
                           bg-gradient-to-r from-emerald-500 to-green-600
                           py-2 text-sm font-medium text-white
                           hover:from-emerald-600 hover:to-green-700"
                >
                  <CheckCircle2 size={16} />
                  Approve
                </button>
                <button
                  onClick={() => {
                    setIsRejectionOpen(true);
                    setRejectionTemplate(template);
                  }}
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-1 rounded-xl
                           bg-gradient-to-r from-rose-500 to-red-600
                           py-2 text-sm font-medium text-white
                           hover:from-rose-600 hover:to-red-700"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates?.length === 0 && (
          <div className="mt-16 text-center text-gray-500">
            No templates found
          </div>
        )}

        {isViewModalOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTemplate?.template_name}
                </h2>
                <button
                  onClick={closeViewModal}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    label="Template Type"
                    value={selectedTemplate?.template_type}
                  />
                  <InfoItem
                    label="Submission Status"
                    value={selectedTemplate?.submission?.status}
                  />
                  <InfoItem
                    label="Submitted At"
                    value={new Date(
                      selectedTemplate?.submission?.submitted_at,
                    ).toLocaleString()}
                  />
                  <InfoItem
                    label="Workflow"
                    value={selectedTemplate?.workflow?.workflow_name}
                  />
                </div>

                {/* Form Data */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Submitted Form Data
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(
                      selectedTemplate?.submission?.form_data || {},
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4"
                      >
                        <p className="text-xs font-semibold uppercase text-indigo-600 mb-1">
                          {key}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
                  <button
                    onClick={closeViewModal}
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      closeViewModal();
                      openEditModal(selectedTemplate);
                    }}
                    className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedTemplate?.template_id);
                      closeViewModal();
                    }}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedTemplate?.template_id);
                      closeViewModal();
                    }}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isApprovalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                Approval Remarks
              </h2>

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    rows={4}
                    placeholder="Enter your remarks here..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApprovalOpen(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isRejectionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Rejection Remarks
              </h2>

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    rows={4}
                    placeholder="Enter your remarks here..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRejectionOpen(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit submission modal */}
        {isEditOpen && editTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-6">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold text-amber-800">
                  Edit submission — {editTemplate?.template_name}
                </h2>
                <button
                  onClick={closeEditModal}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="space-y-4">
                {Object.keys(editFormData).length === 0 ? (
                  <p className="text-sm text-gray-500">No form fields to edit.</p>
                ) : (
                  Object.entries(editFormData).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="block text-xs font-semibold uppercase text-gray-500">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={value ?? ""}
                        onChange={(e) => handleEditFieldChange(key, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={updateSubmission.isPending}
                  className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {updateSubmission.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
