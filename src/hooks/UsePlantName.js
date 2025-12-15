import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosHandler from "../config/axiosconfig"
import { toast } from "react-toastify"



export const UsePlantName = (search,page) => {
    const qc = useQueryClient()
    const getPlantName = useQuery({
        queryKey: ["plant",page],
        queryFn: async () => {
            const res = await axiosHandler.get(`/plant/list-plant?page=${page}&&limit=10`);
            return res?.data?.data;
        }

    })

    const CreatePlantName = useMutation({
        mutationFn: async (data) => {
            try {
                const res = await axiosHandler.post("/plant/create-plant", data)
                toast.success(res?.data?.message)
            } catch (error) {
                toast.error(error?.response?.data?.message)
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["plant"] })
        }
    })


    const UpdatedPLant = useMutation({
        mutationFn: async ({ id, data }) => {
            try {
                const res = await axiosHandler.put(`/plant/update-plant/${id}`, data)
                toast.success(res?.data?.message)
            } catch (error) {
                toast.error(error?.response?.data?.message)
            }

        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["plant"] });
        },
    })

    const DeletePlantData = useMutation({

        mutationFn: async (id) => {
           try {
               const res = await axiosHandler.delete(`/plant/delete-plant/${id}`)
               toast.success(res?.data?.message)
           } catch (error) {
               toast.error(error?.response?.data?.message)
           }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["plant"] });
        },
    })

  const searchQuery = useQuery({
        queryKey: ["search-company", search],
        queryFn: async () => {
            const res = await axiosHandler.get(
                `/plant/search-plant?search=${search}`
            );
            return res.data.data;
        },
        enabled: !!search,
        placeholderData: keepPreviousData 
    });

    const AllPlantsData = useQuery({
      queryKey: ["plant"],
      queryFn: async (id) => {
        const res = await axiosHandler.get(`/plant/all-plants-data/${id}`);
        return res?.data?.data;
      },
      enabled:false
    });


    return {
      getPlantName,
      CreatePlantName,
      UpdatedPLant,
      DeletePlantData,
      searchQuery,
      AllPlantsData,
    };
}

export const usePlantsByCompany = (companyId) => {
  const query = useQuery({
    queryKey: ["plants-by-company", companyId],
    queryFn: async () => {
      const res = await axiosHandler.get(`/plant/all-plants-data/${companyId}`);
      console.log("This is my company id ==========>>>>>>",res)
      return res?.data?.data;
    },
    enabled: !!companyId,
  });
  return query;
}
