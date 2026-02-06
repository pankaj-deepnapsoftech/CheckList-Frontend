import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const usePlcData = (filters = {}, options = {},page,limit) => {
  const qc = useQueryClient();
  const { device_id, model, status, startDate, endDate, timestampStart, timestampEnd, company_name, plant_name } = filters;
  const { live = true } = options; // live: false for history page (no auto-refresh)
  console.log("page",page)
  console.log("limit",limit)

  const getAllPlcData = useQuery({
    queryKey: ["plc-data", { device_id, model, status, startDate, endDate, timestampStart, timestampEnd },page,limit],
    queryFn: async () => {
      const params = {};
      if (device_id) params.device_id = device_id;
      if (model) params.model = model;
      if (status) params.status = status;
      if (company_name) params.company_name = company_name;
      if (plant_name) params.plant_name = plant_name;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (timestampStart) params.timestampStart = timestampStart;
      if (timestampEnd) params.timestampEnd = timestampEnd;
 if (page) params.page = page; 
 if (limit) params.limit = limit;


      const res = await axiosHandler.get("/plc-data", { params });
      return res?.data?.data || [];
    },
    refetchInterval: live ? 5000 : false, // Auto-refresh for live data only
    staleTime: live ? 0 : 60000, // 1 min stale for history
  });

  const createPlcData = useMutation({
    mutationFn: async (data) => {
      const res = await axiosHandler.post("/plc-data", data);
      return res?.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["plc-data"] });
      toast.success(data?.message || "PLC Data created successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create PLC data");
    },
  });

  const updatePlcData = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosHandler.put(`/plc-data/${id}`, data);
      return res?.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["plc-data"] });
      toast.success(data?.message || "PLC Data updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update PLC data");
    },
  });

  const deletePlcData = useMutation({
    mutationFn: async (id) => {
      const res = await axiosHandler.delete(`/plc-data/${id}`);
      return res?.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["plc-data"] });
      toast.success(data?.message || "PLC Data deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete PLC data");
    },
  });

  return {
    getAllPlcData,
    createPlcData,
    updatePlcData,
    deletePlcData,
  };
};
