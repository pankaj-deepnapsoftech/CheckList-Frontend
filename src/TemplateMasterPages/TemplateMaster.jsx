import React, { useMemo, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useTemplateMaster } from "../hooks/Template Hooks/useTemplateMaster";

const FIELD_TYPES = [
  { label: "Text Input", value: "TEXT" },
  { label: "Number", value: "NUMBER" },
  { label: "Checkbox", value: "CHECKBOX" },
  { label: "Dropdown", value: "DROPDOWN" },
  { label: "Date", value: "DATE" },
  { label: "Text Area", value: "TEXTAREA" },
];

const TEMPLATE_TYPES = [
  { label: "New", value: "NEW" },
  { label: "Amendment", value: "AMENDMENT" },
];

export default function TemplateMaster() {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState("");
  const [editTemplateName, setEditTemplateName] = useState("");
  const [editTemplateType, setEditTemplateType] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateType, setNewTemplateType] = useState("");

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("TEXT");
  const [newIsMandatory, setNewIsMandatory] = useState(false);
  const [newDropdownOptions, setNewDropdownOptions] = useState("");
  const [draftFields, setDraftFields] = useState([]);
  const [draftPreviewValues, setDraftPreviewValues] = useState({});

  // Edit modal field states
  const [editFieldName, setEditFieldName] = useState("");
  const [editFieldType, setEditFieldType] = useState("TEXT");
  const [editIsMandatory, setEditIsMandatory] = useState(false);
  const [editDropdownOptions, setEditDropdownOptions] = useState("");
  const [editingFieldId, setEditingFieldId] = useState("");

  const { templatesQuery, templateQuery, createTemplate, addField, updateField, deleteField, updateTemplate, deleteTemplate } =
    useTemplateMaster(selectedTemplateId);

  const templates = templatesQuery.data || [];
  const selectedTemplate = templateQuery.data;
  const fields = useMemo(() => selectedTemplate?.fields || [], [selectedTemplate]);
  const [previewValues, setPreviewValues] = useState({});

  const setPreviewValue = (key, value) => {
    setPreviewValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderPreviewInput = (f) => {
    const key = f?._id || f?.field_name;
    const commonClass =
      "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

    switch (f.field_type) {
      case "NUMBER":
        return (
          <input
            type="number"
            value={previewValues[key] ?? ""}
            onChange={(e) => setPreviewValue(key, e.target.value)}
            className={commonClass}
            placeholder={`Enter ${f.field_name}`}
          />
        );
      case "CHECKBOX":
        return (
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={Boolean(previewValues[key])}
              onChange={(e) => setPreviewValue(key, e.target.checked)}
            />
            {f.field_name}
          </label>
        );
      case "DROPDOWN":
        {
          let opts = [];
          try {
            opts = f?.dropdown_options ? JSON.parse(f.dropdown_options) : [];
          } catch {
            opts = [];
          }
          return (
          <select
            value={previewValues[key] ?? ""}
            onChange={(e) => setPreviewValue(key, e.target.value)}
            className={commonClass}
          >
            <option value="">Select</option>
            {opts.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          );
        }
      case "DATE":
        return (
          <input
            type="date"
            value={previewValues[key] ?? ""}
            onChange={(e) => setPreviewValue(key, e.target.value)}
            className={commonClass}
          />
        );
      case "TEXTAREA":
        return (
          <textarea
            value={previewValues[key] ?? ""}
            onChange={(e) => setPreviewValue(key, e.target.value)}
            className={commonClass}
            rows={3}
            placeholder={`Enter ${f.field_name}`}
          />
        );
      case "TEXT":
      default:
        return (
          <input
            type="text"
            value={previewValues[key] ?? ""}
            onChange={(e) => setPreviewValue(key, e.target.value)}
            className={commonClass}
            placeholder={`Enter ${f.field_name}`}
          />
        );
    }
  };

  const setDraftPreviewValue = (key, value) => {
    setDraftPreviewValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderDraftPreviewInput = (f) => {
    const key = f?._tmpId || f?.field_name;
    const commonClass =
      "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

    switch (f.field_type) {
      case "NUMBER":
        return (
          <input
            type="number"
            value={draftPreviewValues[key] ?? ""}
            onChange={(e) => setDraftPreviewValue(key, e.target.value)}
            className={commonClass}
            placeholder={`Enter ${f.field_name}`}
          />
        );
      case "CHECKBOX":
        return (
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={Boolean(draftPreviewValues[key])}
              onChange={(e) => setDraftPreviewValue(key, e.target.checked)}
            />
            {f.field_name}
            {f.is_mandatory && <span className="text-red-500">*</span>}
          </label>
        );
      case "DROPDOWN":
        return (
          <select
            value={draftPreviewValues[key] ?? ""}
            onChange={(e) => setDraftPreviewValue(key, e.target.value)}
            className={commonClass}
          >
            <option value="">Select</option>
            {(f.dropdown_options || []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        );
      case "DATE":
        return (
          <input
            type="date"
            value={draftPreviewValues[key] ?? ""}
            onChange={(e) => setDraftPreviewValue(key, e.target.value)}
            className={commonClass}
          />
        );
      case "TEXTAREA":
        return (
          <textarea
            value={draftPreviewValues[key] ?? ""}
            onChange={(e) => setDraftPreviewValue(key, e.target.value)}
            className={commonClass}
            rows={3}
            placeholder={`Enter ${f.field_name}`}
          />
        );
      case "TEXT":
      default:
        return (
          <input
            type="text"
            value={draftPreviewValues[key] ?? ""}
            onChange={(e) => setDraftPreviewValue(key, e.target.value)}
            className={commonClass}
            placeholder={`Enter ${f.field_name}`}
          />
        );
    }
  };

  const openCreate = () => {
    setIsCreateOpen(true);
    setNewTemplateName("");
    setNewTemplateType("");
    setDraftFields([]);
    setDraftPreviewValues({});
    setNewFieldName("");
    setNewFieldType("TEXT");
    setNewIsMandatory(false);
    setNewDropdownOptions("");
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
  };

  const openEdit = (template) => {
    setEditingTemplateId(template._id);
    setEditTemplateName(template.template_name);
    setEditTemplateType(template.template_type || "");
    setIsEditOpen(true);
    // Select template to load its fields
    setSelectedTemplateId(template._id);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingTemplateId("");
    setEditTemplateName("");
    setEditTemplateType("");
    setEditingFieldId("");
    setEditFieldName("");
    setEditFieldType("TEXT");
    setEditIsMandatory(false);
    setEditDropdownOptions("");
  };

  const startEditField = (field) => {
    setEditingFieldId(field._id);
    setEditFieldName(field.field_name);
    setEditFieldType(field.field_type);
    setEditIsMandatory(field.is_mandatory);
    let opts = "";
    if (field.field_type === "DROPDOWN" && field.dropdown_options) {
      try {
        const parsed = JSON.parse(field.dropdown_options);
        opts = Array.isArray(parsed) ? parsed.join(", ") : "";
      } catch {
        opts = "";
      }
    }
    setEditDropdownOptions(opts);
  };

  const cancelEditField = () => {
    setEditingFieldId("");
    setEditFieldName("");
    setEditFieldType("TEXT");
    setEditIsMandatory(false);
    setEditDropdownOptions("");
  };

  const handleAddFieldInEdit = async (e) => {
    e.preventDefault();
    const name = (newFieldName || "").trim();
    if (!name) return;

    let dropdownOpts = null;
    if (newFieldType === "DROPDOWN") {
      dropdownOpts = (newDropdownOptions || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      if (dropdownOpts.length === 0) return;
    }

    await addField.mutateAsync({
      templateId: editingTemplateId,
      payload: {
        field_name: name,
        field_type: newFieldType,
        is_mandatory: Boolean(newIsMandatory),
        sort_order: fields.length,
        dropdown_options: newFieldType === "DROPDOWN" ? dropdownOpts : undefined,
      },
    });

    setNewFieldName("");
    setNewFieldType("TEXT");
    setNewIsMandatory(false);
    setNewDropdownOptions("");
  };

  const handleUpdateField = async (e) => {
    e.preventDefault();
    const name = (editFieldName || "").trim();
    if (!name) return;

    let dropdownOpts = null;
    if (editFieldType === "DROPDOWN") {
      dropdownOpts = (editDropdownOptions || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      if (dropdownOpts.length === 0) return;
    }

    await updateField.mutateAsync({
      fieldId: editingFieldId,
      payload: {
        field_name: name,
        field_type: editFieldType,
        is_mandatory: Boolean(editIsMandatory),
        dropdown_options: editFieldType === "DROPDOWN" ? dropdownOpts : undefined,
      },
    });

    cancelEditField();
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    await updateTemplate.mutateAsync({
      templateId: editingTemplateId,
      payload: {
        template_name: editTemplateName,
        template_type: editTemplateType || null,
      },
    });
    closeEdit();
  };

  const addDraftField = (e) => {
    e.preventDefault();
    const name = (newFieldName || "").trim();
    if (!name) return;

    let dropdownOpts = null;
    if (newFieldType === "DROPDOWN") {
      dropdownOpts = (newDropdownOptions || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      if (dropdownOpts.length === 0) return;
    }

    setDraftFields((prev) => [
      ...prev,
      {
        _tmpId: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        field_name: name,
        field_type: newFieldType,
        is_mandatory: Boolean(newIsMandatory),
        dropdown_options: dropdownOpts,
      },
    ]);

    setNewFieldName("");
    setNewFieldType("TEXT");
    setNewIsMandatory(false);
    setNewDropdownOptions("");
  };

  const removeDraftField = (tmpId) => {
    setDraftFields((prev) => prev.filter((f) => f._tmpId !== tmpId));
    setDraftPreviewValues((prev) => {
      const next = { ...prev };
      delete next[tmpId];
      return next;
    });
  };

  const saveNewTemplateWithFields = async (e) => {
    e.preventDefault();

    const res = await createTemplate.mutateAsync({
      template_name: newTemplateName,
      template_type: newTemplateType || null,
    });

    const createdId = res?.data?._id;
    if (!createdId) return;

    // create fields after template is created
    for (let i = 0; i < draftFields.length; i += 1) {
      const f = draftFields[i];
      const payload = {
        field_name: f.field_name,
        field_type: f.field_type,
        is_mandatory: f.is_mandatory,
        sort_order: i,
      };
      // Only include dropdown_options for DROPDOWN fields
      if (f.field_type === "DROPDOWN" && f.dropdown_options && f.dropdown_options.length > 0) {
        payload.dropdown_options = f.dropdown_options;
      }
      // eslint-disable-next-line no-await-in-loop
      await addField.mutateAsync({
        templateId: createdId,
        payload,
      });
    }

    setSelectedTemplateId(createdId);
    closeCreate();
  };

  return (
    <div className="min-h-full bg-gray-50 ">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Manage Template</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create templates and dynamically add fields for users to fill.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Create New Template
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* LEFT: Templates list */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">Templates</h2>
                {templatesQuery.isLoading && (
                  <span className="text-xs text-gray-400">Loading...</span>
                )}
              </div>

              <div className="mt-3 space-y-2">
                {templates.length === 0 && !templatesQuery.isLoading ? (
                  <div className="text-sm text-gray-500">No templates yet.</div>
                ) : (
                  templates.map((t) => (
                    <div
                      key={t._id}
                      className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                        selectedTemplateId === t._id
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedTemplateId(t._id)}
                        className="flex-1 text-left"
                      >
                        <div className="font-semibold">{t.template_name}</div>
                        <div className="text-[11px] text-gray-500">
                          {t.template_type || "—"}
                        </div>
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(t);
                          }}
                          className="rounded p-1 hover:bg-blue-100 text-blue-600"
                          title="Edit Template"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete "${t.template_name}"? This will also delete all its fields.`)) {
                              deleteTemplate.mutate(
                                { templateId: t._id },
                                {
                                  onSuccess: () => {
                                    if (selectedTemplateId === t._id) {
                                      setSelectedTemplateId("");
                                    }
                                  },
                                }
                              );
                            }
                          }}
                          className="rounded p-1 hover:bg-rose-100 text-rose-600"
                          title="Delete Template"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE: Field Builder */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Dynamic Field Builder</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a template and click “Add Field”.
                  </p>
                </div>
                {templateQuery.isFetching && selectedTemplateId && (
                  <span className="text-xs text-gray-400">Loading...</span>
                )}
              </div>

              {!selectedTemplateId ? (
                <div className="mt-4 rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                  Select a template from the left to start adding fields.
                </div>
              ) : (
                <>
                  <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <div className="text-xs text-gray-500">Selected Template</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {selectedTemplate?.template_name || "—"}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                    For new templates, use <b>Create New Template</b>. Here you can maintain fields of an existing template.
                  </div>

                  <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Field Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Type
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Mandatory
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {fields.length === 0 ? (
                          <tr>
                            <td className="px-3 py-3 text-sm text-gray-500" colSpan={4}>
                              No fields added yet.
                            </td>
                          </tr>
                        ) : (
                          fields.map((f) => (
                            <tr key={f._id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-sm text-gray-800 font-semibold">
                                {f.field_name}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-700">{f.field_type}</td>
                              <td className="px-3 py-2 text-sm text-gray-700">
                                {f.is_mandatory ? "Yes" : "No"}
                              </td>
                              <td className="px-3 py-2 text-right">
                                <button
                                  onClick={() =>
                                    deleteField.mutate({ fieldId: f._id })
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Form Preview */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Form Preview</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Ye preview user ko form fill karte time dikhega.
                  </p>
                </div>
              </div>

              {!selectedTemplateId ? (
                <div className="mt-4 rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                  Select a template to see form preview.
                </div>
              ) : fields.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-gray-200 p-6 text-sm text-gray-500">
                  No fields in this template yet.
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Template Name & Type */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="text-xs font-semibold text-gray-700">Template Name</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {selectedTemplate?.template_name || "—"}
                    </div>
                    {selectedTemplate?.template_type && (
                      <>
                        <div className="mt-2 text-xs font-semibold text-gray-700">Template Type</div>
                        <div className="mt-1 text-sm text-gray-800">
                          {selectedTemplate.template_type}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Fields */}
                  {fields.map((f) => (
                    <div key={f._id}>
                      {f.field_type !== "CHECKBOX" && (
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {f.field_name}
                          {f.is_mandatory && <span className="text-red-500"> *</span>}
                        </label>
                      )}
                      {renderPreviewInput(f)}
                    </div>
                  ))}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-60 cursor-not-allowed"
                      title="Preview only (submission will be part of execution module)"
                    >
                      Submit (Preview)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT DRAWER: Create New Template */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeCreate} />
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create New Template</h2>
                <p className="text-xs text-gray-500">
                  Fill Template details and add fields, then save.
                </p>
              </div>
              <button onClick={closeCreate} className="rounded-lg p-2 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveNewTemplateWithFields} className="h-full overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., Item Master – General"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Template Type</label>
                  <input
                    type="text"
                    value={newTemplateType}
                    onChange={(e) => setNewTemplateType(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., New / Amendment / Item Master – General"
                  />
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Add Field</h3>
                    <span className="text-xs text-gray-500">
                      Total: {draftFields.length}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-600">
                        Field Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Part Number"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-600">Field Type</label>
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {newFieldType === "DROPDOWN" && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600">
                          Dropdown Options <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={newDropdownOptions}
                          onChange={(e) => setNewDropdownOptions(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="Comma separated e.g. OK,Not OK,NA"
                        />
                        <p className="mt-1 text-[11px] text-gray-500">
                          Example: <b>Yes, No, NA</b>
                        </p>
                      </div>
                    )}
                    <div className="sm:col-span-1 flex items-end justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={newIsMandatory}
                          onChange={(e) => setNewIsMandatory(e.target.checked)}
                        />
                        Mandatory
                      </label>
                      <button
                        onClick={addDraftField}
                        type="button"
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Field
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Type
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Mandatory
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {draftFields.length === 0 ? (
                          <tr>
                            <td className="px-3 py-3 text-sm text-gray-500" colSpan={4}>
                              No draft fields added.
                            </td>
                          </tr>
                        ) : (
                          draftFields.map((f) => (
                            <tr key={f._tmpId} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-sm font-semibold text-gray-800">
                                {f.field_name}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-700">{f.field_type}</td>
                              <td className="px-3 py-2 text-sm text-gray-700">
                                {f.is_mandatory ? "Yes" : "No"}
                              </td>
                              <td className="px-3 py-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeDraftField(f._tmpId)}
                                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* LIVE FORM PREVIEW (DRAFT) */}
                <div className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Live Form Preview</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Jaise-jaise fields add karoge, yaha form banta hua dikhega — aur aap isko normal form ki tarah fill kar sakte ho.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    {/* Template Name & Type - Always visible */}
                    {(newTemplateName || newTemplateType) && (
                      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="text-xs font-semibold text-gray-700">Template Name</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                          {newTemplateName || "—"}
                        </div>
                        {newTemplateType && (
                          <>
                            <div className="mt-2 text-xs font-semibold text-gray-700">Template Type</div>
                            <div className="mt-1 text-sm text-gray-800">{newTemplateType}</div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Fields Preview */}
                    {draftFields.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                        {newTemplateName ? "Add fields to see the form preview." : "Enter template name and add fields to see the form preview."}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {draftFields.map((f) => (
                          <div key={f._tmpId}>
                            {f.field_type !== "CHECKBOX" && (
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                {f.field_name}
                                {f.is_mandatory && <span className="text-red-500"> *</span>}
                              </label>
                            )}
                            {renderDraftPreviewInput(f)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 mt-6 mb-20 border-t bg-white py-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeCreate}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTemplate.isPending || addField.isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {createTemplate.isPending || addField.isPending ? "Saving..." : "Save Template"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RIGHT DRAWER: Edit Template */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Edit Template</h2>
                <p className="text-xs text-gray-500">
                  Update template name and type.
                </p>
              </div>
              <button onClick={closeEdit} className="rounded-lg p-2 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateTemplate} className="h-full overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={editTemplateName}
                    onChange={(e) => setEditTemplateName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., Item Master – General"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Template Type</label>
                  <input
                    type="text"
                    value={editTemplateType}
                    onChange={(e) => setEditTemplateType(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., New / Amendment / Item Master – General"
                  />
                </div>

                {/* Add/Edit Field Section */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {editingFieldId ? "Edit Field" : "Add Field"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      Total: {fields.length}
                    </span>
                  </div>

                  <form
                    onSubmit={editingFieldId ? handleUpdateField : handleAddFieldInEdit}
                    className="mt-3 grid gap-3 sm:grid-cols-3"
                  >
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-600">
                        Field Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={editingFieldId ? editFieldName : newFieldName}
                        onChange={(e) =>
                          editingFieldId
                            ? setEditFieldName(e.target.value)
                            : setNewFieldName(e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Part Number"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-600">Field Type</label>
                      <select
                        value={editingFieldId ? editFieldType : newFieldType}
                        onChange={(e) =>
                          editingFieldId
                            ? setEditFieldType(e.target.value)
                            : setNewFieldType(e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-1 flex items-end justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={editingFieldId ? editIsMandatory : newIsMandatory}
                          onChange={(e) =>
                            editingFieldId
                              ? setEditIsMandatory(e.target.checked)
                              : setNewIsMandatory(e.target.checked)
                          }
                        />
                        Mandatory
                      </label>
                      {editingFieldId ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={cancelEditField}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={updateField.isPending}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                          >
                            {updateField.isPending ? "Updating..." : "Update"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="submit"
                          disabled={addField.isPending}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {addField.isPending ? "Adding..." : "Add"}
                        </button>
                      )}
                    </div>

                    {(editingFieldId ? editFieldType : newFieldType) === "DROPDOWN" && (
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium text-gray-600">
                          Dropdown Options <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={editingFieldId ? editDropdownOptions : newDropdownOptions}
                          onChange={(e) =>
                            editingFieldId
                              ? setEditDropdownOptions(e.target.value)
                              : setNewDropdownOptions(e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="Comma separated e.g. OK,Not OK,NA"
                        />
                        <p className="mt-1 text-[11px] text-gray-500">
                          Example: <b>Yes, No, NA</b>
                        </p>
                      </div>
                    )}
                  </form>

                  {/* Fields List */}
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Field
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Type
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                            Mandatory
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {fields.length === 0 ? (
                          <tr>
                            <td className="px-3 py-3 text-sm text-gray-500" colSpan={4}>
                              No fields in this template.
                            </td>
                          </tr>
                        ) : (
                          fields.map((f) => (
                            <tr
                              key={f._id}
                              className={`hover:bg-gray-50 ${
                                editingFieldId === f._id ? "bg-blue-50" : ""
                              }`}
                            >
                              <td className="px-3 py-2 text-sm font-semibold text-gray-800">
                                {f.field_name}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-700">{f.field_type}</td>
                              <td className="px-3 py-2 text-sm text-gray-700">
                                {f.is_mandatory ? "Yes" : "No"}
                              </td>
                              <td className="px-3 py-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {editingFieldId === f._id ? (
                                    <span className="text-xs text-blue-600">Editing...</span>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => startEditField(f)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                                      >
                                        <Edit2 size={12} />
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          deleteField.mutate({ fieldId: f._id })
                                        }
                                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                                      >
                                        <Trash2 size={12} />
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* LIVE FORM PREVIEW (EDIT MODE) */}
                <div className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Live Form Preview</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Template aur fields ka live preview — aap isko normal form ki tarah fill kar sakte ho.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    {/* Template Name & Type */}
                    {(editTemplateName || editTemplateType) && (
                      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="text-xs font-semibold text-gray-700">Template Name</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                          {editTemplateName || "—"}
                        </div>
                        {editTemplateType && (
                          <>
                            <div className="mt-2 text-xs font-semibold text-gray-700">Template Type</div>
                            <div className="mt-1 text-sm text-gray-800">{editTemplateType}</div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Fields Preview */}
                    {fields.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                        No fields in this template yet. Add fields to see the form preview.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {fields.map((f) => (
                          <div key={f._id}>
                            {f.field_type !== "CHECKBOX" && (
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                {f.field_name}
                                {f.is_mandatory && <span className="text-red-500"> *</span>}
                              </label>
                            )}
                            {renderPreviewInput(f)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 mt-6 border-t bg-white py-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateTemplate.isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {updateTemplate.isPending ? "Updating..." : "Update Template"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
