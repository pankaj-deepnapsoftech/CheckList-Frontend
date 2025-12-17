
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";


export const useCompanies = (search, page , limit) => {
    const qc = useQueryClient();
 
    const listQuery = useQuery({
        queryKey: ["companies", page , limit],
        queryFn: async () => {
            const res = await axiosHandler.get(`/company/list-company?page=${page}&&limit=${limit}`);
            return res?.data?.data;
        },
        enabled: !search,
        placeholderData: keepPreviousData
    });


  const create = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axiosHandler.post("/company/create-company", data);
        toast.success(res?.data?.message);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const res = await axiosHandler.put(
          `/company/update-company/${id}`,
          data
        );
        toast.success(res?.data?.message);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id) => axiosHandler.delete(`/company/delete-company/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const searchQuery = useQuery({
    queryKey: ["search-company", search],
    queryFn: async () => {
      const res = await axiosHandler.get(
        `/company/search-company?search=${search}`
      );
      return res.data.data;
    },
    enabled: !!search,
    placeholderData: keepPreviousData,
  });

  const AllCompanyData = useQuery({
    queryKey: ["companies-all"],
    queryFn: async () => {
      const res = await axiosHandler.get("/company/all-companies");
      return res?.data?.data;
    },
    
  });

  



    return { listQuery, create, update, remove, searchQuery, AllCompanyData };
}
