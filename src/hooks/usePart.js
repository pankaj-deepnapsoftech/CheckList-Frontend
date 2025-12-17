import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const UsePart = () => {
  const qc = useQueryClient();


   const getPartData = useQuery({
     queryKey: ["parts"],
     queryFn: async () => {
       const res = await axiosHandler.get("/parts/all-parts");
       return res?.data?.data;
     },
   });

  const getAllPart = useQuery({
    queryKey: ["parts"],
    queryFn: async () => {
      const res = await axiosHandler.get("/parts/all-parts-data");
      return res?.data?.data;
    },
  });



  const createPart = useMutation({
    mutationFn: async(data) => {
        const res = await axiosHandler.post("/parts/create-part", data)
        return res?.data ;
    },

    onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: ["parts"] });
      toast.success(data?.message);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create parts");
    },
  });

  const updateParts = useMutation({
    mutationFn: async({ id, data }) =>{
      const res = await axiosHandler.put(`/parts/update-part/${id}`, data)
      return res?.data;
    },

    onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: ["parts"] });
        toast.success(data?.message);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update parts");
    },
  });

  return { getAllPart, createPart, updateParts, getPartData };
};
