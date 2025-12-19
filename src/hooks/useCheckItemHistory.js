import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const useCheckItemHistory = () => {
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
        toast.error(
          error?.response?.data?.message || "Failed to update history"
        );
      },
    });


     const getAssemblyReportToday = useQuery({
       queryKey: ["CheckItem-History"],
       queryFn: async () => {
         const res = await axiosHandler.get(`/checkitem-history/get-all-data`);
         return res?.data?.data;
       },
     });


  return { getCheckItemHistory, updateCheckItemHistory, getAssemblyReportToday };
};
