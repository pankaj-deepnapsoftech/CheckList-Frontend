import { useQuery } from "@tanstack/react-query";
import axiosHandler from "../../config/axiosconfig";

export const useAssignedTemplates = () => {
  const assignedTemplatesQuery = useQuery({
    queryKey: ["assigned-templates"],
    queryFn: async () => {
      try {
        console.log("Fetching assigned templates...");
        const res = await axiosHandler.get("/template-master/assigned-templates");
        console.log("Assigned templates response:", res?.data);
        return res?.data?.data || [];
      } catch (error) {
        console.error("Error fetching assigned templates:", error);
        console.error("Error details:", error?.response?.data || error?.message);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return {
    assignedTemplatesQuery,
  };
};
