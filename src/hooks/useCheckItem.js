import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosHandler from "../config/axiosconfig"
import { toast } from "react-toastify"

export const useCheckItem = (search, page, limit) => {

  const qc = useQueryClient()

  const getCheckItemData = useQuery({
    queryKey: ["checkitem", page, limit],
    queryFn: async () => {
      const res = await axiosHandler.get(`/checkitem/get-checkitem?page=${page}&&limit=${limit}`)
      return res?.data?.data;
    }
  })

  const searchQuery = useQuery({
    queryKey: ["search-checkitem", search],
    queryFn: async () => {
      const res = await axiosHandler.get(
        `/checkitem/search-checkitem?search=${search}`
      );
      return res.data.data;
    },
    enabled: !!search,
    placeholderData: keepPreviousData,
  });

  const CreateCheckItem = useMutation({
    mutationFn: async (values) => {
      const res = await axiosHandler.post(`/checkitem/create-checklist`, values)
      return res?.data
    },
    onSuccess: (data) => {
      toast.success(data?.message)
      qc.invalidateQueries("checkitem")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message)
    }
  })

  const GetCategory = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const res = await axiosHandler.get(`types/get-types`);
      return res?.data?.data;
    },
    placeholderData: keepPreviousData
  })

  const AddCategroy = useMutation({
    mutationFn: async (data) => {

      const body = {};
      if (data.newMethod) body.checking_method = data.newMethod;
      if (data.newUom) body.uom = data.newUom;
      if (data.newTime) body.checking_time = data.newTime;
       
      const res = await axiosHandler.post(`types/create-types`, body);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      qc.invalidateQueries({ queryKey: ["types"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });





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

  return {
    getCheckItemData,
    CreateCheckItem,
    updateCheckItem,
    removeItem,
    searchQuery,
    AddCategroy,
    GetCategory
  };
}