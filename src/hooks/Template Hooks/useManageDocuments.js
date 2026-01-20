import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../../config/axiosconfig";
import { toast } from "react-toastify";

export const useManageDocuments = () => {
  const qc = useQueryClient();

  const getDocuments = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await axiosHandler.get(`/document/get`);
      return res?.data?.data;
    },
  });

  const postDocuments = useMutation({
    mutationFn: async () => {
      const res = await axiosHandler.post(`/document/create`);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const updateDocuments = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosHandler.put(`/document/update/id/${id}`, data);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      qc.invalidateQueries({ queryKey: ["documents"] });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const removeDocuments = useMutation({
    mutationFn: async (id) => {
      const res = await axiosHandler.delete(`/document/delete/id/${id}`);
      return res?.data;
    },

    onSuccess: (data) => {
      toast.success(data?.message);
      qc.invalidateQueries({ queryKey: ["documents"] });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  return {
    getDocuments,
    postDocuments,
    updateDocuments,
    removeDocuments,
  };
};
