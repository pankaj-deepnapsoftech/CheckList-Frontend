
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";


export const useCompanies = () => {
    const qc = useQueryClient();

    const listQuery = useQuery({
        queryKey: ["companies"],
        queryFn: async () => {
            const res = await axiosHandler.get("/company/list-company");
            return res?.data?.data;
        },
    });


    const create = useMutation({
        mutationFn: (data) =>
            axiosHandler.post("/company/create-company", data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["companies"] });
        },
    });
 
   
    const update = useMutation({
        mutationFn: ({id, data}) => axiosHandler.put(`/company/update-company/${id}`,data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["companies"] });
        },
    })

    const remove = useMutation({
        mutationFn: (id) => axiosHandler.delete(`/company/delete-company/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["companies"] });
        },
    })

    return { listQuery, create, update, remove  };
}
