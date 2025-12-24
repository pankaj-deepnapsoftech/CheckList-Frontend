import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosHandler from "../config/axiosconfig"
import { toast } from "react-toastify"

export const useNotifications = () => {
    const qc = useQueryClient()
    const getNotifications = useQuery({
        queryKey: ["notification"],
        queryFn: async()=>{
            const res = await axiosHandler.get(`/notification/get-notifications`)
            return res?.data?.data ;
        }
    })
    

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