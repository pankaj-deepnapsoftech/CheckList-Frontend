import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  X,
  Pencil,
  UserPlus,
} from "lucide-react";
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
  const [reassignTemplate, setReassignTemplate] = useState(null);
  const { logedinUser } = useLogin();
  const [searchText, setSearchText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [openFillModal, setOpenFillModal] = useState(false);

  const assignedTemplates =
    getAllAssignedTemp?.data?.flatMap(
      (user) =>
        user?.submissions?.map((submission) => ({
          ...submission,
          ...submission?.template,
          submission: submission,
          user_id: user?.user_id,
          user_db_id: user?._id,
          full_name: user?.full_name,
          email: user?.email,
          employee_plant: user?.employee_plant,
          hod_id: user?.hod_id,
        })) || [],
    ) || [];

  const filteredTemplates = assignedTemplates.filter((t) =>
    t?.template_name?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const formik = useFormik({
    initialValues: {
      current_stage: 0,
      reassign_stage: null,
      workflow_id: "",
      status: "",
      remarks: "",
      user_id: "",
      template_id: "",
      reassign_user_id: "",
      submission_id: "",
      edit_count:1
    },
    onSubmit: (values) => {
      PostHistorTem.mutate(values, {
        onSuccess: () => {
          setIsApprovalOpen(false);
          setIsRejectionOpen(false);
          setApprovalTemplate(null);
          setRejectionTemplate(null);
          setIsReassignOpen(false);
          formik.resetForm();
        },
      });
    },
  });

  useEffect(() => {
    if (approvalTemplate) {
      formik.setValues({
        current_stage:
          approvalTemplate?.current_approver_stage ??
          approvalTemplate?.approvals?.length ??
          0,
        reassign_stage: null,
        workflow_id: approvalTemplate?.workflow?.workflow_id || "",
        status: "approved",
        remarks: "",
        user_id: approvalTemplate?.user_db_id || "",
        template_id: approvalTemplate?.template_id || "",
        reassign_user_id: "",
        submission_id: approvalTemplate?.submission_id,
        edit_count: approvalTemplate?.submission_edit_count,
      });
    }
  }, [approvalTemplate]);

  useEffect(() => {
    if (rejectionTemplate) {
      formik.setValues({
        current_stage:
          rejectionTemplate?.current_approver_stage ??
          rejectionTemplate?.approvals?.length ??
          0,
        reassign_stage: null,
        workflow_id: rejectionTemplate?.workflow?.workflow_id || "",
        status: "rejected",
        remarks: "",
        user_id: rejectionTemplate?.user_db_id || "",
        template_id: rejectionTemplate?.template_id || "",
        reassign_user_id: "",
        submission_id: approvalTemplate?.submission_id,
         edit_count: approvalTemplate?.submission_edit_count ,
      });
    }
  }, [rejectionTemplate]);

  console.log(approvalTemplate);
  useEffect(() => {
    if (reassignTemplate) {
      formik.setValues({
        current_stage:
          reassignTemplate?.current_approver_stage ??
          reassignTemplate?.approvals?.length ??
          0,
        reassign_stage: null,
        workflow_id: reassignTemplate?.workflow?.workflow_id || "",
        status: "reassigned",
        remarks: "",
        user_id: reassignTemplate?.user_db_id || "",
        template_id: reassignTemplate?.template_id || "",
        reassign_user_id: "",
        submission_id: approvalTemplate?.submission_id,
        edit_count: approvalTemplate?.submission_edit_count ,
      });
    }
  }, [reassignTemplate]);

 
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

  const handleReassign = (id) => {
    const tpl = assignedTemplates.find((t) => t.template_id === id);
    if (tpl) {
      setReassignTemplate(tpl);
      setIsReassignOpen(true);
       setApprovalTemplate(tpl);
    }
  };

  const getReassignOptions = (template) => {
    const users = template?.allowed_reassign_users || [];
    return users.map((u) => ({
      value: u.user_id,
      label: u.full_name || u.user_id || "—",
    }));
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
     setApprovalTemplate(template);
    // Use previous submission data (prev) for editing
    setEditFormData({
      ...(template.submission?.prev || template.submission?.form_data || {}),
    });
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
                : null,
            );
          }
        },
      },
    );
  };

  const current_stage = approvalTemplate?.current_approver_stage ?? 0;

  console.log(approvalTemplate?.current_approver_stage);

  const fields =
    approvalTemplate?.workflow?.workflow?.[current_stage]?.fields || [];

   

  const selectedTemplateFields =
    selectedTemplate?.workflow?.workflow?.[0]?.fields || [];

  const fieldMap =
    selectedTemplateFields?.reduce((acc, field) => {
      acc[field._id] = field.field_name;
      return acc;
    }, {}) || {};

  const getWorkflowFormData = (formData) => {
    if (!formData || selectedTemplateFields.length === 0) return {};
    return formData;
  };

  const previousSubmissionData = approvalTemplate?.submission?.prev || {};
  const initialValues = fields?.reduce((acc, field) => {
    acc[field._id] =
      previousSubmissionData[field._id] || "";
    return acc;
  }, {});

  const formikForForm = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const previousFormData = approvalTemplate?.submission?.prev || {};

      const newFormData = {};
      Object.keys(values).forEach((fieldId) => {
        const field = fields.find((f) => f._id === fieldId);
        if (field) {
          newFormData[field._id] = values[fieldId];
        }
      });

      const payload = {
        form_data: { ...previousFormData, ...newFormData },
        status: "SUBMITTED",
      };

      updateSubmission.mutate(
        {
          id: approvalTemplate?.submission?.submission_id,
          payload: payload,
        },
        {
          onSuccess: () => {
            setOpenFillModal(false);
            formikForForm.resetForm();
          },
        },
      );
    },
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="mx-auto max-w-full px-4 py-8">
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
              <div className="flex justify-between">
                <div>
                  <p className=" rounded-full bg-sky-100 px-2 py-[5px]     text-[13px] font-[600] text-sky-700">
                    {template?.template_name}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setOpenFillModal(true);
                    setApprovalTemplate(template);
                  }}
                  className="  rounded-xl border bg-amber-400  cursor-pointer
                           text-white py-2.5 px-2 text-sm font-medium 
                           hover:bg-amber-300"
                >
                  Fill Form
                </button>
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
              <div className="mt-2 mb-3 space-y-1">
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Employee:</span>{" "}
                  {template?.full_name || "N/A"} ({template?.user_id})
                </p>
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  {template?.email || "N/A"}
                </p>
                <p className="text-xs  text-gray-700">
                  <span className="font-medium ">Plant Name:</span>{" "}
                  {template.plant_detail?.plant_name} (
                  {template.plant_detail?.plant_code})
                </p>
              </div>

              <div className=" space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Status:</span>{" "}
                  <span className="capitalize rounded-full bg-emerald-100 px-2 py-1 text-xs font-[600] text-emerald-700">
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
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-2 rounded-xl border border-gray-400 cursor-pointer
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
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-1 cursor-pointer rounded-xl
                           bg-gradient-to-r from-emerald-500 to-green-600
                           py-2 px-2 text-sm font-medium text-white
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
                  className="flex-1 min-w-[80px] flex items-center justify-center gap-1 cursor-pointer rounded-xl
                           bg-gradient-to-r from-rose-500 to-red-600
                           py-2 px-2 text-sm font-medium text-white
                           hover:from-rose-600 hover:to-red-700"
                >
                  <XCircle size={16} />
                  Reject
                </button>
                {template?.allowed_reassign_user_ids?.length > 0 && (
                  <button
                    onClick={() => handleReassign(template.template_id)}
                    className="flex-1 min-w-[80px] flex items-center justify-center gap-1 cursor-pointer rounded-xl
                             bg-gradient-to-r from-violet-500 to-purple-600
                             py-2 px-2 text-sm font-medium text-white
                             hover:from-violet-600 hover:to-purple-700"
                  >
                    <UserPlus size={16} />
                    Reassign
                  </button>
                )}
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
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTemplate?.template_name}
                </h2>
                <button
                  onClick={closeViewModal}
                  className="rounded-lg p-1 cursor-pointer text-gray-500 hover:bg-gray-100"
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
                      getWorkflowFormData(
                        selectedTemplate?.submission?.form_data,
                      ),
                    ).map(([key, value]) => {
                      const fieldName = fieldMap[key] || key;
                      const keys = fieldName.split("~");

                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4"
                        >
                          <p className="text-xs font-semibold  text-indigo-600 mb-1">
                            {keys[0]} :
                            <span className="text-sm pl-2 font-medium text-gray-900">
                              {String(value)}
                            </span>{" "}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Template Status / Approval History */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Template Status History
                  </h3>

                  {selectedTemplate?.approvals?.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Stage
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Action
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              By
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Reassign Status
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Remarks
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedTemplate.approvals.map((a, idx) => {
                            const actionLabel =
                              (a.status || "").toLowerCase() === "reassigned"
                                ? `Reassigned to ${a.reassign_to_name || a.reassign_user_id || "—"}`
                                : (a.status || "").toLowerCase() === "rejected"
                                  ? "Rejected"
                                  : (a.status || "").toLowerCase() ===
                                      "approved"
                                    ? "Approved"
                                    : a.status || "—";
                            const reassignStatusLabel =
                              a.status === "reassigned"
                                ? a.reassign_status
                                  ? "Approved by HOD/approver"
                                  : "Pending"
                                : "—";
                            return (
                              <tr
                                key={a.approval_id || idx}
                                className="hover:bg-gray-50/50"
                              >
                                <td className="px-4 py-2 text-gray-700">
                                  {a.approved_at
                                    ? new Date(a.approved_at).toLocaleString()
                                    : "—"}
                                </td>
                                <td className="px-4 py-2 text-gray-700">
                                  {a.current_stage ?? "—"}
                                </td>
                                <td className="px-4 py-2">
                                  <span
                                    className={
                                      a.status === "approved"
                                        ? "text-green-600 font-medium"
                                        : a.status === "rejected"
                                          ? "text-red-600 font-medium"
                                          : a.status === "reassigned"
                                            ? "text-violet-600 font-medium"
                                            : "text-gray-700"
                                    }
                                  >
                                    {actionLabel}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-gray-700">
                                  {a.approved_by_name || "—"}
                                </td>
                                <td className="px-4 py-2 text-gray-600">
                                  {reassignStatusLabel}
                                </td>
                                <td
                                  className="px-4 py-2 text-gray-600 max-w-[200px] truncate"
                                  title={a.remarks}
                                >
                                  {a.remarks || "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No approval history yet.
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-4">
                  <button
                    onClick={closeViewModal}
                    className="rounded-xl border cursor-pointer border-gray-400 px-4 py-2 text-sm hover:bg-gray-50"
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
                      closeViewModal();
                      setIsRejectionOpen(true);
                      setRejectionTemplate(selectedTemplate);
                    }}
                    className="flex items-center gap-2 cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      closeViewModal();
                      setIsApprovalOpen(true);
                      setApprovalTemplate(selectedTemplate);
                    }}
                    className="flex items-center gap-2 cursor-pointer rounded-xl bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                  {selectedTemplate?.allowed_reassign_user_ids?.length > 0 && (
                    <button
                      onClick={() => {
                        closeViewModal();
                        handleReassign(selectedTemplate?.template_id);
                      }}
                      className="flex items-center gap-2 cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
                    >
                      <UserPlus size={16} />
                      Reassign
                    </button>
                  )}
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
        {openFillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-[#ffb900] mb-4">
                Fill Out the Form
              </h2>

              <form onSubmit={formikForForm.handleSubmit}>
                {fields?.length === 0 ? (
                  <div className="flex h-full min-h-[300px] items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center rounded-xl bg-white px-8 py-10 shadow-md">
                      <h2 className="mb-2 text-xl font-semibold text-gray-800">
                        No Data Found
                      </h2>

                      <p className="mb-6 text-center text-sm text-gray-500">
                        We couldn’t find any records to display.
                      </p>
                    </div>
                  </div>
                ) : (
                  fields?.map((field) => (
                    <div className="mb-6" key={field?._id}>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {field.field_name}
                        {field.is_mandatory && (
                          <span className="text-red-500"> *</span>
                        )}
                      </label>

                      {field.field_type === "TEXT" && (
                        <input
                          type="text"
                          name={field._id}
                          value={formikForForm.values[field?._id]}
                          onChange={formikForForm.handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {field.field_type === "NUMBER" && (
                        <input
                          type="number"
                          name={field._id}
                          value={formikForForm.values[field._id]}
                          onChange={formikForForm.handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {field.field_type === "TEXTAREA" && (
                        <textarea
                          name={field._id}
                          value={formikForForm.values[field._id]}
                          onChange={formikForForm.handleChange}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {field.field_type === "DATE" && (
                        <input
                          type="date"
                          name={field._id}
                          value={formikForForm.values[field._id]}
                          onChange={formikForForm.handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      )}

                      {field.field_type === "CHECKBOX" && (
                        <input
                          type="checkbox"
                          name={field._id}
                          checked={formikForForm.values[field._id]}
                          onChange={formikForForm.handleChange}
                          className="h-4 w-4 text-blue-600"
                        />
                      )}

                      {field.field_type === "DROPDOWN" && (
                        <select
                          name={field._id}
                          value={formikForForm.values[field._id]}
                          onChange={formikForForm.handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.field_type === "RADIO" && (
                        <div className="space-y-2">
                          {field.options?.map((option, index) => (
                            <label
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="radio"
                                name={field._id}
                                value={option}
                                checked={
                                  formikForForm.values[field._id] === option
                                }
                                onChange={formikForForm.handleChange}
                                className="text-blue-600"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      )}

                      {field.field_type === "IMAGE" && (
                        <input
                          type="file"
                          name={field._id}
                          onChange={(event) =>
                            formikForForm.setFieldValue(
                              field._id,
                              event.currentTarget.files[0],
                            )
                          }
                          className="w-full text-sm text-gray-600"
                        />
                      )}
                    </div>
                  ))
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenFillModal(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    // disabled={formikForForm.values}
                    className={`rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white `}
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

        {isReassignOpen && reassignTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
              <h2 className="text-xl font-semibold text-violet-600 mb-4">
                Reassign to
              </h2>

              <form onSubmit={formik.handleSubmit}>
                <input type="hidden" name="status" value="reassigned" />
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Reassign to user
                  </label>
                  <select
                    name="reassign_user_id"
                    value={formik.values.reassign_user_id}
                    onChange={formik.handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">Select user...</option>
                    {getReassignOptions(reassignTemplate).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Remarks (optional)
                  </label>
                  <textarea
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    rows={2}
                    placeholder="Optional remarks..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReassignOpen(false);
                      setReassignTemplate(null);
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700"
                  >
                    Reassign
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
              <div className="flex justify-between items-center  pb-4 mb-4">
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
                {!editTemplate?.workflow?.workflow?.[current_stage]?.fields ||
                editTemplate.workflow.workflow[current_stage].fields.length ===
                  0 ? (
                  <p className="text-sm text-gray-500">
                    No form fields to edit.
                  </p>
                ) : (
                  editTemplate.workflow.workflow[current_stage].fields.map(
                    (field) => {
                      const fieldValue =
                        editFormData[field._id] !== undefined
                          ? editFormData[field._id]
                          : "";
                      return (
                        <div key={field._id} className="space-y-1">
                          <label className="block text-xs font-semibold uppercase text-gray-500">
                            {field.field_name}
                            {field.is_mandatory && (
                              <span className="text-red-500"> *</span>
                            )}
                          </label>
                          {field.field_type === "TEXT" && (
                            <input
                              type="text"
                              value={fieldValue}
                              onChange={(e) =>
                                handleEditFieldChange(field._id, e.target.value)
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          )}
                          {field.field_type === "NUMBER" && (
                            <input
                              type="number"
                              value={fieldValue}
                              onChange={(e) =>
                                handleEditFieldChange(field._id, e.target.value)
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          )}
                          {field.field_type === "TEXTAREA" && (
                            <textarea
                              value={fieldValue}
                              onChange={(e) =>
                                handleEditFieldChange(field._id, e.target.value)
                              }
                              rows={4}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          )}
                          {field.field_type === "DATE" && (
                            <input
                              type="date"
                              value={fieldValue}
                              onChange={(e) =>
                                handleEditFieldChange(field._id, e.target.value)
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                          )}
                          {field.field_type === "CHECKBOX" && (
                            <input
                              type="checkbox"
                              checked={
                                fieldValue === true || fieldValue === "true"
                              }
                              onChange={(e) =>
                                handleEditFieldChange(
                                  field._id,
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 text-amber-600"
                            />
                          )}
                          {field.field_type === "DROPDOWN" && (
                            <select
                              value={fieldValue}
                              onChange={(e) =>
                                handleEditFieldChange(field._id, e.target.value)
                              }
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <option value="">Select an option</option>
                              {field.options?.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                          {field.field_type === "RADIO" && (
                            <div className="space-y-2">
                              {field.options?.map((option, index) => (
                                <label
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <input
                                    type="radio"
                                    name={field._id}
                                    value={option}
                                    checked={fieldValue === option}
                                    onChange={(e) =>
                                      handleEditFieldChange(
                                        field._id,
                                        e.target.value,
                                      )
                                    }
                                    className="text-amber-600"
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    },
                  )
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 ">
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
