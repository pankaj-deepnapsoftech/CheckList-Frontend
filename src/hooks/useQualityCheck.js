import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const useQualityCheck = (filters = {}) => {
  const qc = useQueryClient();
  const { machine_name, product_name, status, company_name, plant_name, search } = filters;

  const getAllQualityChecks = useQuery({
    queryKey: ["quality-check", { machine_name, product_name, status, company_name, plant_name, search }],
    queryFn: async () => {
      const params = {};
      if (machine_name) params.machine_name = machine_name;
      if (product_name) params.product_name = product_name;
      if (status) params.status = status;
      if (company_name) params.company_name = company_name;
      if (plant_name) params.plant_name = plant_name;
      if (search) params.search = search;

      const res = await axiosHandler.get("/quality-check", { params });
      return res?.data?.data || [];
    },
  });

  const createQualityCheck = useMutation({
    mutationFn: async (data) => {
      const res = await axiosHandler.post("/quality-check", data);
      return res?.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quality-check"] });
      toast.success(data?.message || "Quality Check created successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create Quality Check");
    },
  });

  const useQualityCheck = () => {
  const queryClient = useQueryClient();

   const qcData = useQuery({
    queryKey: "qcData",
    queryFn: async () => {
      return axiosHandler.get();
    },
  });

   const qcDataPost = useMutation({
    mutationFn: async (data) => {
      return await axiosHandler.post("/plc-products", data);
    },
  });

  return {qcDataPost};
};

  const updateQualityCheck = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosHandler.put(`/quality-check/${id}`, data);
      return res?.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quality-check"] });
      toast.success(data?.message || "Quality Check updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update Quality Check");
    },
  });

  const deleteQualityCheck = useMutation({
    mutationFn: async (id) => {
      const res = await axiosHandler.delete(`/quality-check/${id}`);
      return res?.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["quality-check"] });
      toast.success(data?.message || "Quality Check deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete Quality Check");
    },
  });

  return {
    getAllQualityChecks,
    createQualityCheck,
    updateQualityCheck,
    deleteQualityCheck,
    useQualityCheck
  };
};





