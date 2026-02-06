import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosHandler from "../../config/axiosconfig";

export const useTemplateSubmission = (
  templateId = null,
  User_plant_id = null,
) => {
  const qc = useQueryClient();

  const getUserSubmissions = useQuery({
    queryKey: ["template-submissions", templateId, User_plant_id],
    queryFn: async () => {
      const params = templateId ? { template_id: templateId } : {};
      const res = await axiosHandler.get(
        `/template-submission?plant_id=${User_plant_id}`,
        { params },
      );
      return res?.data?.data || [];
    },
    enabled: !!User_plant_id,
    refetchOnWindowFocus: false,
  });

  const createSubmission = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosHandler.post("/template-submission", payload);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Template saved successfully");
      qc.invalidateQueries({ queryKey: ["template-submissions"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to save template");
    },
  });

  const updateSubmission = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axiosHandler.put(`/template-submission/${id}`, payload);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Template updated successfully");
      qc.invalidateQueries({ queryKey: ["template-submissions"] });
      qc.invalidateQueries({ queryKey: ["get-assign-template"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update template",
      );
    },
  });

  const submitSubmission = useMutation({
    mutationFn: async (id) => {
      const res = await axiosHandler.post(`/template-submission/${id}/submit`);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Template submitted successfully");
      qc.invalidateQueries({ queryKey: ["template-submissions"] });
      qc.invalidateQueries({ queryKey: ["assigned-templates"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to submit template",
      );
    },
  });

  const getLatestSubmission = useMutation({
    mutationFn: async (templateId) => {
      if (!templateId) return null;
      const res = await axiosHandler.get(
        `/template-submission/latest/${templateId}`,
      );
      return res?.data?.data;
    },
  });

  return {
    getUserSubmissions,
    createSubmission,
    updateSubmission,
    submitSubmission,
    getLatestSubmission,
  };
};
