import React, { useState, useMemo, useEffect } from "react";
import { Eye, RefreshCw, Save, Send, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAssignedTemplates } from "../hooks/Template Hooks/useAssignedTemplates";
import { useTemplateMaster } from "../hooks/Template Hooks/useTemplateMaster";
import { useTemplateSubmission } from "../hooks/Template Hooks/useTemplateSubmission";
import { useLogin } from "../hooks/useLogin";
import Select from "react-select";
import Pagination from "../Components/Pagination/Pagination";
import SearchableSelect from "../Components/SearchableDropDown/SearchableDropdown";

const FIELD_TYPES = {
  TEXT: "Text Input",
  NUMBER: "Number",
  CHECKBOX: "Checkbox",
  DROPDOWN: "Dropdown",
  RADIO: "Radio Buttons",
  DATE: "Date",
  TEXTAREA: "Text Area",
  IMAGE: "Image Uploader",
};

export default function AssignedTemplates() {
  const { logedinUser } = useLogin();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { assignedTemplatesQuery } = useAssignedTemplates(page);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingTemplateId, setViewingTemplateId] = useState("");
  const [currentSubmissionId, setCurrentSubmissionId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState(null);
  const { templateQuery } = useTemplateMaster(viewingTemplateId);
  const [assigned_user_id, setAssignedUser_id] = useState(null);
  const [User_plant_id,selectUser_Plant_id] = useState(null)
  // Fetch all submissions for the user (not filtered by template_id initially)
  const {
    getUserSubmissions,
    createSubmission,
    updateSubmission,
    submitSubmission,
  } = useTemplateSubmission(null, User_plant_id);


 

  // Redirect admin users
  useEffect(() => {
    if (logedinUser?.data?.is_admin) {
      navigate("/");
    }
  }, [logedinUser, navigate]);

  // Debug logging
  useEffect(() => {
    console.log("AssignedTemplates - Query State:", {
      isLoading: assignedTemplatesQuery.isLoading,
      isError: assignedTemplatesQuery.isError,
      error: assignedTemplatesQuery.error,
      data: assignedTemplatesQuery.data,
      status: assignedTemplatesQuery.status,
    });
  }, [
    assignedTemplatesQuery.isLoading,
    assignedTemplatesQuery.isError,
    assignedTemplatesQuery.data,
    assignedTemplatesQuery.status,
  ]);

  const templates = assignedTemplatesQuery.data || [];
  const selectedTemplate = templateQuery.data;
  const existingSubmissions = getUserSubmissions.data || [];
  console.log(existingSubmissions);
  const fields = useMemo(() => {
    const f = selectedTemplate?.fields || [];
    return [...f].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [selectedTemplate]);

  // Initialize formik with existing submission data or empty
  const getInitialFormValues = () => {
    if (viewingTemplateId && existingSubmissions.length > 0) {
      // First check for DRAFT, then SUBMITTED
      const draftSubmission = existingSubmissions.find(
        (sub) =>
          sub.template_id === viewingTemplateId && sub.status === "DRAFT",
      );
      const submittedSubmission = existingSubmissions.find(
        (sub) =>
          sub.template_id === viewingTemplateId && sub.status === "SUBMITTED",
      );
      const submission = draftSubmission || submittedSubmission;
      if (submission?.form_data) {
        return {
          ...submission.form_data,
          plant_id: submission.plant_id || submission.form_data?.plant_id || "",
        };
      }
    }
    // Initialize with empty values for each field
    const initialValues = {};
    if (fields.length > 0) {
      fields.forEach((field) => {
        const key = field._id || field.field_name;
        if (field.field_type === "CHECKBOX") {
          initialValues[key] = false;
        } else {
          initialValues[key] = "";
        }
      });
    }
    initialValues.plant_id = "";
    return initialValues;
  };

  const formik = useFormik({
    initialValues: getInitialFormValues(),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { plant_id, ...formData } = values;
      if (currentSubmissionId) {
        await updateSubmission.mutateAsync({
          id: currentSubmissionId,
          payload: {
            form_data: formData,
            status: "SUBMITTED",
            user_id: assigned_user_id,
            plant_id: plant_id || null,
          },
        });
      } else {
        const result = await createSubmission.mutateAsync({
          template_id: viewingTemplateId,
          form_data: formData,
          status: "SUBMITTED",
          user_id: assigned_user_id,
          plant_id: plant_id || null,
        });
        if (result?.data?._id) {
          setCurrentSubmissionId(result.data._id);
        }
      }
      setAssignedUser_id(null);
    },
  });

  // Load existing submission when template changes
  useEffect(() => {
    if (viewingTemplateId && selectedTemplate) {
      // Refetch submissions when template opens
      getUserSubmissions.refetch();
    }
  }, [viewingTemplateId, selectedTemplate]);

  // Update form when submissions are loaded
  useEffect(() => {
    if (
      viewingTemplateId &&
      existingSubmissions.length > 0 &&
      fields.length > 0
    ) {
      // First check for DRAFT, then SUBMITTED
      const draftSubmission = existingSubmissions.find(
        (sub) =>
          sub.template_id === viewingTemplateId && sub.status === "DRAFT",
      );
      const submittedSubmission = existingSubmissions.find(
        (sub) =>
          sub.template_id === viewingTemplateId && sub.status === "SUBMITTED",
      );
      const submission = draftSubmission || submittedSubmission;

      if (submission) {
        setCurrentSubmissionId(submission._id);
        setViewingSubmission(submission);
        // Set form values from existing submission
        if (submission.form_data) {
          formik.setValues({
            ...submission.form_data,
            plant_id:
              submission.plant_id || submission.form_data?.plant_id || "",
          });
        }
        // Set edit mode based on submission status
        setIsEditMode(submission.status === "DRAFT");
      } else {
        setCurrentSubmissionId(null);
        setViewingSubmission(null);
        setIsEditMode(false);
        // Reset form when no existing submission
        const initialValues = {};
        fields.forEach((field) => {
          const key = field._id || field.field_name;
          if (field.field_type === "CHECKBOX") {
            initialValues[key] = false;
          } else {
            initialValues[key] = "";
          }
        });
        initialValues.plant_id = "";
        formik.setValues(initialValues);
      }
    } else if (
      viewingTemplateId &&
      fields.length > 0 &&
      existingSubmissions.length === 0
    ) {
      setCurrentSubmissionId(null);
      setViewingSubmission(null);
      setIsEditMode(false);
      // Initialize empty form
      const initialValues = {};
      fields.forEach((field) => {
        const key = field._id || field.field_name;
        if (field.field_type === "CHECKBOX") {
          initialValues[key] = false;
        } else {
          initialValues[key] = "";
        }
      });
      initialValues.plant_id = "";
      formik.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewingTemplateId, existingSubmissions.length, fields.length]);

  const handleRefresh = () => {
    assignedTemplatesQuery.refetch();
    getUserSubmissions.refetch();
  };

  const openView = (template) => {
   
    setViewingTemplateId(template._id);
    setIsViewOpen(true);
    setIsEditMode(false);
   
    setAssignedUser_id(template?.assigned_users?.user_id);
  };

  const closeView = () => {
    setIsViewOpen(false);
    selectUser_Plant_id(null)
    setViewingTemplateId("");
    setCurrentSubmissionId(null);
    setViewingSubmission(null);
    setIsEditMode(false);
    formik.resetForm();
  };

  // const handleEdit = async () => {
   
  //   console.log(viewingSubmission);
  //   if (
  //     viewingSubmission &&
  //     viewingSubmission.status === "SUBMITTED" &&
  //     currentSubmissionId
  //   ) {
  //     try {
  //       await updateSubmission.mutateAsync({
  //         id: currentSubmissionId,
  //         payload: {
  //           form_data: viewingSubmission.form_data,
  //           status: "SUBMITTED",
  //           edit_count: viewingSubmission?.edit_count + 1,
  //         },
  //       });

  //       getUserSubmissions.refetch();
  //     } catch (error) {
  //       console.error("Error updating submission:", error);
  //     }
  //   }
  // };

  const handleSubmit = async () => {
    // Validate mandatory fields
    const mandatoryFields = fields.filter((f) => f.is_mandatory);
    const missingFields = mandatoryFields.filter((field) => {
      const key = field._id || field.field_name;
      const value = formik.values[key];
      return !value || (typeof value === "string" && value.trim() === "");
    });

    if (missingFields.length > 0) {
      alert(
        `Please fill all mandatory fields: ${missingFields.map((f) => f.field_name).join(", ")}`,
      );
      return;
    }

    try {
      let submissionId = currentSubmissionId;

      // Save first if not saved
      if (!submissionId) {
        const { plant_id, ...formData } = formik.values;
        const result = await createSubmission.mutateAsync({
          template_id: viewingTemplateId,
          form_data: formData,
          status: "SUBMITTED",
          user_id: assigned_user_id,
          plant_id: plant_id || null,
        });
        setIsViewOpen(false);
        submissionId = result?.data?._id;
        if (submissionId) {
          setCurrentSubmissionId(submissionId);
        }
      } else {
        // Update existing draft before submitting
        const { plant_id, ...formData } = formik.values;
        await updateSubmission.mutateAsync({
          id: submissionId,
          payload: {
            form_data: formData,
            status: "SUBMITTED",
            user_id: assigned_user_id,
            plant_id: plant_id || null,
            edit_count: viewingSubmission?.edit_count + 1,
          },
        });
      }
   
      // Submit the form
      if (submissionId) {
        await submitSubmission.mutateAsync(submissionId);
        // Refetch submissions to get updated status
        await getUserSubmissions.refetch();
        closeView();
         setIsViewOpen(false);
      }
      setAssignedUser_id(null);
    } catch (error) {
      console.error("Error submitting template:", error);
    }
  };

  const renderPreviewInput = (f, readOnly = false) => {
    const key = f?._id || f?.field_name;
    const commonClass = `mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`;

    switch (f.field_type) {
      case "NUMBER":
        return (
          <input
            type="number"
            name={key}
            value={formik.values[key] ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={commonClass}
            placeholder={`Enter ${f.field_name}`}
            disabled={readOnly}
            readOnly={readOnly}
          />
        );
      case "CHECKBOX":
        return (
          <label
            className={`mt-2 inline-flex items-center gap-2 text-sm text-gray-700 ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <input
              type="checkbox"
              name={key}
              checked={Boolean(formik.values[key])}
              onChange={formik.handleChange}
              disabled={readOnly}
            />
            {f.field_name}
            {f.is_mandatory && <span className="text-red-500">*</span>}
          </label>
        );
      case "DROPDOWN": {
        let opts = [];
        try {
          opts = f?.dropdown_options ? JSON.parse(f.dropdown_options) : [];
        } catch {
          opts = [];
        }

        const options = opts.map((o) => ({
          label: o,
          value: o,
        }));

        return (
          <Select
            options={options}
            placeholder="Select"
            isSearchable
            isDisabled={readOnly}
            value={
              options.find((opt) => opt.value === formik.values[key]) || null
            }
            onChange={(selected) =>
              formik.setFieldValue(key, selected ? selected.value : "")
            }
            onBlur={() => formik.setFieldTouched(key, true)}
            className="mt-1 text-sm"
            classNamePrefix="react-select"
          />
        );
      }

      case "RADIO": {
        let opts = [];
        try {
          opts = f?.dropdown_options ? JSON.parse(f.dropdown_options) : [];
        } catch {
          opts = [];
        }
        return (
          <div className="mt-2 space-y-2">
            {opts.map((o) => (
              <label
                key={o}
                className={`flex items-center gap-2 text-sm text-gray-700 ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <input
                  type="radio"
                  name={key}
                  value={o}
                  checked={formik.values[key] === o}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  disabled={readOnly}
                />
                <span>{o}</span>
              </label>
            ))}
          </div>
        );
      }
      case "DATE":
        return (
          <input
            type="date"
            name={key}
            value={formik.values[key] ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={commonClass}
            disabled={readOnly}
            readOnly={readOnly}
          />
        );
      case "TEXTAREA":
        return (
          <textarea
            name={key}
            value={formik.values[key] ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={commonClass}
            rows={3}
            placeholder={`Enter ${f.field_name}`}
            disabled={readOnly}
            readOnly={readOnly}
          />
        );
      case "IMAGE":
        return readOnly ? (
          formik.values[key] ? (
            <div className="mt-2">
              <img
                src={formik.values[key]}
                alt={f.field_name}
                className="max-w-xs rounded-lg border border-gray-300"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">No image uploaded</p>
          )
        ) : (
          <input
            type="file"
            accept="image/*"
            name={key}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  formik.setFieldValue(key, reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className={commonClass}
          />
        );
      case "TEXT":
      default:
        return (
          <input
            type="text"
            name={key}
            value={formik.values[key] ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={commonClass}
            placeholder={`Enter ${f.field_name}`}
            disabled={readOnly}
            readOnly={readOnly}
          />
        );
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              My Assigned Templates
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Templates assigned to you for review and completion.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            disabled={assignedTemplatesQuery.isLoading}
          >
            <RefreshCw
              size={18}
              className={assignedTemplatesQuery.isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mt-6">
          {assignedTemplatesQuery.isLoading ? (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
              <p className="text-gray-500">Loading templates...</p>
            </div>
          ) : assignedTemplatesQuery.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-600">
                Error loading templates:{" "}
                {assignedTemplatesQuery.error?.response?.data?.message ||
                  assignedTemplatesQuery.error?.message ||
                  "Unknown error"}
              </p>
              <button
                onClick={handleRefresh}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : templates.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
              <p className="text-gray-500">No templates assigned to you yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              {templates.map((template) => (
                <div
                  key={template._id}
                  className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {template.template_name}
                      </h3>
                      {template.template_type && (
                        <p className="mt-1 text-sm text-gray-500">
                          Type: {template.template_type}
                        </p>
                      )}
                      {template.fields && (
                        <p className="mt-1 text-xs text-gray-400">
                          Total Field: {template.fields.length}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => openView(template)}
                      className="ml-2 rounded-lg mt-4 p-2 border bg-green-50 border-green-300 flex items-center cursor-pointer  text-green-600 hover:bg-blue-50 transition-colors"
                      title="View Template"
                    >
                      <Eye size={20} /> &nbsp;View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Modal */}
        {isViewOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedTemplate?.template_name}
                  </h2>
                  {viewingSubmission &&
                    viewingSubmission.status === "SUBMITTED" &&
                    !isEditMode && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        Submitted
                      </span>
                    )}
                  {/* {viewingSubmission && viewingSubmission.status === "DRAFT" && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      Draft
                    </span>
                  )} */}
                </div>
                <div className="flex items-center gap-2">
                  {viewingSubmission &&
                    viewingSubmission.status === "SUBMITTED" &&
                    !isEditMode && (
                      <button
                        onClick={()=>  setIsEditMode(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <Edit size={18} />
                        Edit
                      </button>
                    )}
                  <button
                    onClick={closeView}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Template Name:
                    </span>{" "}
                    <span className="text-sm text-gray-900">
                      {selectedTemplate.template_name}
                    </span>
                  </div>
                  {selectedTemplate.template_type && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Type:
                      </span>{" "}
                      <span className="text-sm text-gray-900">
                        {selectedTemplate.template_type}
                      </span>
                    </div>
                  )}
                </div>

                <form onSubmit={formik.handleSubmit}>
                  <div className="mt-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        Template Fields
                    </h3>
                    {fields?.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No fields added yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="plant-select"
                            className="text-sm font-medium text-gray-700"
                          >
                            Select Plant
                          </label>

                          <div className="relative">
                            <SearchableSelect
                              id="plant-select"
                              placeholder="Search & select plant"
                              options={selectedTemplate?.plant_option || []}
                              value={formik.values.plant_name}
                              onChange={(val) => {
                                formik.setFieldValue("plant_id", val);
                                selectUser_Plant_id(val);
                              }}
                              getOptionLabel={(c) => c?.plant_name}
                              getOptionValue={(c) => c?._id}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {fields.map((field) => {
                          const key = field._id || field.field_name;
                          return (
                            <div
                              key={field._id}
                              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                            >
                              <div className="mb-2 flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                  {field.field_name}
                                </label>
                                {field.is_mandatory && (
                                  <span className="text-xs text-red-500">
                                    *
                                  </span>
                                )}
                                <span className="ml-auto text-xs text-gray-500">
                                  {FIELD_TYPES[field.field_type] ||
                                    field.field_type}
                                </span>
                              </div>

                              {renderPreviewInput(
                                field,
                                !isEditMode &&
                                  viewingSubmission?.status === "SUBMITTED",
                              )}
                              {formik.touched[key] && formik.errors[key] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {formik.errors[key]}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {isEditMode ||
                  !viewingSubmission ||
                  viewingSubmission.status === "DRAFT" ? (
                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                          createSubmission.isPending ||
                          updateSubmission.isPending ||
                          submitSubmission.isPending
                        }
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send size={18} />
                        {submitSubmission.isPending
                          ? "Submitting..."
                          : "Submit"}
                      </button>
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Pagination
        page={page}
        setPage={setPage}
        hasNextpage={templates?.length === 10}
      />
    </div>
  );
}
