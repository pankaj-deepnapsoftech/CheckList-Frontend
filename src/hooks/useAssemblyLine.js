import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const useAssemblyLine = (search, page) => {


    const qc = useQueryClient()


    const getAssemblyLineData = useQuery({
        queryKey: ["assembly", page],
        queryFn: async () => {
            const res = await axiosHandler.get(`/assembly/get-assembly?page=${page}&&limit=10`)
            return res?.data?.data;
        },
         enabled: !search,
        placeholderData: keepPreviousData,
    })

    const createAssemblyLine = useMutation({
        mutationFn: (data) => axiosHandler.post(`/assembly/create-assembly`, data),
        onSuccess: (data) => {
            toast.success(data?.message)
            qc.invalidateQueries({ queryKey: ["assembly"] })
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message)
        }
    })

    const searchQuery = useQuery({
        queryKey: ["search-assembly-line", search],
        queryFn: async () => {
            const res = await axiosHandler.get(
                `/assembly/search-assembly-line?search=${search}`
            );
            return res.data.data;
        },
        enabled: !!search,
        placeholderData: keepPreviousData,
    });


    return { createAssemblyLine, getAssemblyLineData, searchQuery };
}