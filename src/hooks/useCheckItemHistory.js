import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const useCheckItemHistory = (page = 1, limit = 10) => {
  const qc = useQueryClient();

  const getCheckItemHistory = useQuery({
    queryKey: ["CheckItem-History"],
    queryFn: async () => {
      const res = await axiosHandler.get(`/checkitem-history/get-all-data`);
      return res?.data?.data;
    },
  });

  const updateCheckItemHistory = useMutation({
    mutationFn: ({ id, data }) =>
      axiosHandler.put(
        `/checkitem-history/update-checklist-history/${id}`,
        data
      ),

    onSuccess: (res) => {
      toast.success(res?.data?.message || "History updated successfully");

      qc.invalidateQueries({
        queryKey: ["CheckItem-History"],
      });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update history");
    },
  });

  const getAssemblyReportData = useQuery({
    queryKey: ["AssemblyReport-Data", page, limit],
    queryFn: async () => {
      const res = await axiosHandler.get(
        `/assembly/assembly-checked-data?page=${page}&&limit=${limit}`
      );
      return res?.data?.data;
    },
  });

  const getAssemblyCardsData = useQuery({
    queryKey: ["AssemblyCardsData"],
    queryFn: async () => {
      const res = await axiosHandler.get(`/assembly/assembly-cards-data`);
      return res?.data?.data;
    },
  });
  

  return {
    getCheckItemHistory,
    updateCheckItemHistory,
    getAssemblyReportData,
    getAssemblyCardsData,
  };
};
