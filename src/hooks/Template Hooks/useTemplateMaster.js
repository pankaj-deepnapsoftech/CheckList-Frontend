import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosHandler from "../../config/axiosconfig";

export const useTemplateMaster = (selectedTemplateId) => {
  const qc = useQueryClient();

  const templatesQuery = useQuery({
    queryKey: ["template-master", "templates"],
    queryFn: async () => {
      const res = await axiosHandler.get("/template-master/templates");
      return res?.data?.data || [];
    },
  });

  const templateStatusListQuery = useQuery({
    queryKey: ["template-master", "template-status"],
    queryFn: async () => {
      const res = await axiosHandler.get("/template-master/template-status");
      return res?.data?.data || [];
    },
  });

  const templateQuery = useQuery({
    queryKey: ["template-master", "template", selectedTemplateId],
    enabled: Boolean(selectedTemplateId),
    queryFn: async () => {
      const res = await axiosHandler.get(`/template-master/templates/${selectedTemplateId}`);
      return res?.data?.data;
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosHandler.post("/template-master/templates", payload);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Template created");
      qc.invalidateQueries({ queryKey: ["template-master", "templates"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create template");
    },
  });

  const addField = useMutation({
    mutationFn: async ({ templateId, payload }) => {
      const res = await axiosHandler.post(`/template-master/templates/${templateId}/fields`, payload);
      return res?.data;
    },
    onSuccess: (data, variables) => {
     
      qc.invalidateQueries({ queryKey: ["template-master", "template", variables.templateId] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add field";
      console.error("Add Field Error:", error?.response?.data || error);
      toast.error(errorMessage);
    },
  });

  const updateField = useMutation({
    mutationFn: async ({ fieldId, payload }) => {
      const res = await axiosHandler.put(`/template-master/fields/${fieldId}`, payload);
      return res?.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Field updated");
      qc.invalidateQueries({ queryKey: ["template-master", "template", selectedTemplateId] });
      qc.invalidateQueries({ queryKey: ["template-master", "templates"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update field");
    },
  });

  const deleteField = useMutation({
    mutationFn: async ({ fieldId }) => {
      const res = await axiosHandler.delete(`/template-master/fields/${fieldId}`);
      return res?.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Field deleted");
      qc.invalidateQueries({ queryKey: ["template-master", "template", selectedTemplateId] });
      qc.invalidateQueries({ queryKey: ["template-master", "templates"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete field");
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ templateId, payload }) => {
      const res = await axiosHandler.put(`/template-master/templates/${templateId}`, payload);
      return res?.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Template updated");
      qc.invalidateQueries({ queryKey: ["template-master", "templates"] });
      qc.invalidateQueries({ queryKey: ["template-master", "template", variables.templateId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update template");
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async ({ templateId }) => {
      const res = await axiosHandler.delete(`/template-master/templates/${templateId}`);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Template deleted");
      qc.invalidateQueries({ queryKey: ["template-master", "templates"] });
      qc.invalidateQueries({ queryKey: ["template-master", "template"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete template");
    },
  });

  const assignWorkflow = useMutation({
    mutationFn: async ({ templateId, workflowId }) => {
      const res = await axiosHandler.post(`/template-master/templates/${templateId}/assign-workflow`, {
        workflowId,
      });
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Workflow assigned successfully");
      qc.invalidateQueries({ queryKey: ["template-master", "templates"] });
      qc.invalidateQueries({ queryKey: ["template-master", "template"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to assign workflow");
    },
  });

  return {
    templatesQuery,
    templateStatusListQuery,
    templateQuery,
    createTemplate,
    addField,
    updateField,
    deleteField,
    updateTemplate,
    deleteTemplate,
    assignWorkflow,
  };
};

