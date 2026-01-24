import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const usePlcData = (filters = {}) => {
  const qc = useQueryClient();
  const { device_id, model, startDate, endDate, timestampStart, timestampEnd } = filters;

  const getAllPlcData = useQuery({
    queryKey: ["plc-data", { device_id, model, startDate, endDate, timestampStart, timestampEnd }],
    queryFn: async () => {
      const params = {};
      if (device_id) params.device_id = device_id;
      if (model) params.model = model;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (timestampStart) params.timestampStart = timestampStart;
      if (timestampEnd) params.timestampEnd = timestampEnd;

      const res = await axiosHandler.get("/plc-data", { params });
      return res?.data?.data || [];
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds for live data
    staleTime: 0, // Always consider data stale for live updates
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
