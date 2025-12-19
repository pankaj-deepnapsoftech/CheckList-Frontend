
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";


export const useDashboard = () => {
  
    const qc = useQueryClient();

    const getCardData = useQuery({
            queryKey: ["dashboard"],
            queryFn: async () => {
                const res = await axiosHandler.get(`/dashboard/get-cards-data`)
                return res?.data?.data;
            }
        })

     return { 
        getCardData 
    }   

}
