import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosHandler from "../config/axiosconfig"
import { toast } from "react-toastify"

export const useCheckItem = () => {

    const qc = useQueryClient()

    const getCheckItemData = useQuery({
        queryKey: ["checkitem"],
        queryFn: async () => {
            const res = await axiosHandler.get(`/checkitem/get-checkitem`)
            return res?.data?.data;
        }
    })

    const CreateCheckItem = useMutation({
        mutationFn: async (values) => {
            const res = await axiosHandler.post(`/checkitem/create-checklist`, values)
            return res?.data
        },
        onSuccess:(data)=>{
          toast.success(data?.message)
          qc.invalidateQueries("checkitem")
        },
        onError:(error)=>{
            toast.error(error?.response?.data?.message)
        }
    })

      const updateCheckItem = useMutation({
        mutationFn: ({ id, data }) =>
          axiosHandler.put(`/checkitem/update-checklist/${id}`, data),

        onSuccess: () => {
          toast.success("Check Item updated sucessfully");
          qc.invalidateQueries({ queryKey: ["checkitem"] });
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to update role "
          );
        },
      });

        const removeItem = useMutation({
          mutationFn: (id) =>
            axiosHandler.delete(`/checkitem/delete-checklist/${id}`),

          onSuccess: () => {
            toast.success("Check Item deleted successfully ");
            qc.invalidateQueries({ queryKey: ["checkitem"] });
          },

          onError: (error) => {
            toast.error(
              error?.response?.data?.message || "Failed to delete role "
            );
          },
        });





    return { getCheckItemData, CreateCheckItem, updateCheckItem, removeItem };
}