import { useQuery } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";



// Top cards data api 
export const useDashboardCards = () => {
  return useQuery({
    queryKey: ["dashboard-cards"],

    queryFn: async () => {
      const res = await axiosHandler.get("/dashboard/get-cards-data");
      return res?.data?.data;
    },

    staleTime: 1000 * 60 * 5,
    retry: 1,

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to load dashboard cards"
      );
    },
  });
};



export const useDashboardData = () => {
    return useQuery({
        queryKey : [""],

        queryFn: async () => {
            const res = await axiosHandler.get("");
            return res?.data?.data;
        },

        onError : (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to load this data"
            );
        },
    });
};