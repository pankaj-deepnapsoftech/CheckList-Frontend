import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosHandler from "../config/axiosconfig"
import { toast } from "react-toastify"

export const useNotifications = () => {
    const qc = useQueryClient()
    const getNotifications = useInfiniteQuery({
        queryKey: ["notification"],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosHandler.get(
                `/notification/get-notifications?page=${pageParam}&limit=5`
            );
            return {
                ...res.data,
                currentPage: pageParam,
            };
        },

        getNextPageParam: (data) => {
            if (data.currentPage < data.totalPages) {
                return data.currentPage + 1;
            }
            return undefined;
        },
    });
    

    const MarkasRead = useMutation({
        mutationFn:async (id)=>{
            const res = await axiosHandler.put(`notification/update-notification/${id}`,{
                status: "view"
            })
            return res?.data ;
        },
        onSuccess:(data)=>{
            toast.success(data?.message)
            qc.invalidateQueries({ queryKey: ["notification"]})
        },
        onError:(error)=>{
              toast.error(error?.response?.data?.message)
        }
    })


    const MarkAllasRead = useMutation({
        mutationFn:async (id)=>{
            const res = await axiosHandler.put(`notification/mark-all-notification`,{
                status: "view",
                reciverId:id
            })
            return res?.data ;
        },
        onSuccess:(data)=>{
            toast.success(data?.message)
            qc.invalidateQueries({ queryKey: ["notification"]})
        },
        onError:(error)=>{
              toast.error(error?.response?.data?.message)
        }
    })





    return { getNotifications, MarkasRead, MarkAllasRead }     
}