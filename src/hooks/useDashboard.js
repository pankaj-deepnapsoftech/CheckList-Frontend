import { useQuery } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

/* ---------------- Dashboard Cards API ---------------- */
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

/* ---------------- Monthly Inspection Trend API ---------------- */
export const useMonthlyInspectionTrend = () => {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return useQuery({
    queryKey: ["monthly-inspection-trend"],

    queryFn: async () => {
      const res = await axiosHandler.get("/dashboard/get-monthly-trend");
      const rawData = res?.data?.data || [];

      // Normalize data to Jan–Dec
      const filledData = MONTHS.map((month, index) => {
        const found = rawData.find((item) => item.month === index + 1);

        return {
          month,
          checked: found?.checked_count || 0,
          unchecked: found?.unchecked_count || 0,
          error: found?.error_count || 0,
        };
      });

      return filledData;
    },

    staleTime: 1000 * 60 * 5,
    retry: 1,

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load monthly inspection trend"
      );
    },
  });
};

export const useAssemblyStatus = () => {
  return useQuery({
    queryKey: ["assembly-status"],

    queryFn: async () => {
      const res = await axiosHandler.get("/dashboard/get-assembly-status");
      return res?.data?.data || [];
    },

    staleTime: 1000 * 60 * 5,
    retry: 1,

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to load inspection data"
      );
    },
  });
};

/* ---------------- Assembly Monthly API ---------------- */
export const useAssemblyMonthly = () => {
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return useQuery({
    queryKey: ["assembly-monthly"],

    queryFn: async () => {
      const res = await axiosHandler.get("/dashboard/get-assembly-monthly");
      const rawData = res?.data?.data || [];

      // Normalize Jan–Dec
      return MONTHS.map((label, index) => {
        const found = rawData.find((item) => item.month === index + 1);

        return {
          label,
          running: found?.running_count || 0,
          fault: found?.fault_count || 0,
        };
      });
    },

    staleTime: 1000 * 60 * 5,
    retry: 1,

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to load assembly monthly data"
      );
    },
  });
};



/* ---------------- Inspection Overview API ---------------- */
export const useInspectionOverview = () => {
  return useQuery({
    queryKey: ["inspection-overview"],

    queryFn: async () => {
      const res = await axiosHandler.get("/dashboard/get-assembly-errors");
      const data = res?.data?.data || {};

      return {
        topErrorProcesses: data?.top_error_processes || [],
        summary: {
          errorAssemblies: data?.assembly_summary?.error_assemblies || 0,
          stillErrorAssemblies:
            data?.assembly_summary?.still_error_assemblies || 0,
          resolvedAssemblies:
            data?.assembly_summary?.resolved_assemblies || 0,
        },
      };
    },

    staleTime: 1000 * 60 * 5,
    retry: 1,

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load inspection overview data"
      );
    },
  });
};

