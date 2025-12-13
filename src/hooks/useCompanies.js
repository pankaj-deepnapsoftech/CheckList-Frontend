
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";


export const useCompanies = (search,page) => {
    const qc = useQueryClient();

    const listQuery = useQuery({
        queryKey: ["companies",page],
        queryFn: async () => {
            const res = await axiosHandler.get(`/company/list-company?page=${page}&&limit=10`);
            return res?.data?.data;
        },
        enabled: !search,
        placeholderData: keepPreviousData 
    });


    const create = useMutation({
        mutationFn: (data) =>
            axiosHandler.post("/company/create-company", data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["companies"] });
        },
    });


    const update = useMutation({
        mutationFn:async ({ id, data }) =>{
             const res = await axiosHandler.put(`/company/update-company/${id}`, data)
             console.log(res)
            },
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

    const searchQuery = useQuery({
        queryKey: ["search-company", search],
        queryFn: async () => {
            const res = await axiosHandler.get(
                `/company/search-company?search=${search}`
            );
            return res.data.data;
        },
        enabled: !!search,
        placeholderData: keepPreviousData 
    });



    return { listQuery, create, update, remove, searchQuery };
}
