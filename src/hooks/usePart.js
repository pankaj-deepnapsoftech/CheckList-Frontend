import { useQuery, useQueryClient } from "@tanstack/react-query"
import axiosHandler from "../config/axiosconfig";


export const UsePart = () => {
   const qc = useQueryClient()

    const getAllPart = useQuery({
        queryKey: ["all-parts-data"],
        queryFn: async () => {
            const res = await axiosHandler.get("/parts/all-parts-data");
            return res?.data?.data;
        }
    })


    return {getAllPart}
}