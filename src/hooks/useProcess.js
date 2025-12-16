import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import axiosHandler from "../config/axiosconfig"


export const useProcess = (search,page) => {

     const qc = useQueryClient()

    const  getProcessData = useQuery({
        queryKey:["process",page],
        queryFn: async() =>  {
            const res = await axiosHandler.get(`/process/get-process-list?page=${page}&&limit=10`)
            return res?.data?.data ;
        },
        enabled:!search 
          
    })

    const PostProcessData = useMutation({
        mutationFn: async(value)=>{
            try {
                const res = await axiosHandler.post(`/process/create-process`,value)
                toast.success(res?.data?.message)
            } catch (error) {
               console.log(error) 
            }
        },
         onSuccess:()=>{
            qc.invalidateQueries({queryKey:["process"]})
         }
    })
    const UpdateProcess = useMutation({
        mutationFn: async ({value,id}) => {
            try {
                const res = await axiosHandler.put(`/process/update-process/${id}`, value)
                toast.success(res?.data?.message)
            } catch (error) {
                toast.error(error?.message)
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["process"] })
        }
    })
    const DeleteProcess = useMutation({
        mutationFn: async ( id ) => {
            try {
                const res = await axiosHandler.delete(`/process/delete-process/${id}`)
                toast.success(res?.data?.message)
            } catch (error) {
                toast.error(error?.message)
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["process"] })
        }
    })

      const searchQuery = useQuery({
          queryKey: ["saerch-process-list", search],
        queryFn: async () => {
          const res = await axiosHandler.get(
            `/process/saerch-process-list?search=${search}`
          );
          return res?.data?.data;
        },
        enabled: !!search,
        placeholderData: keepPreviousData,
      });


    return { getProcessData, PostProcessData, UpdateProcess, DeleteProcess, searchQuery } ;
}