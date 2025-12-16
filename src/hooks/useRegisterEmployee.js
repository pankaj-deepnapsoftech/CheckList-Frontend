import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";


export const RegisterEmployee = (search, page, enabled = true) => {
  const qc = useQueryClient();

  const getAllEmployee = useQuery({
    queryKey: ["employees", page],
    queryFn: async () => {
      const res = await axiosHandler.get(
        `/users/get-employees?page=${page}&&limit=10`
      );
      return res?.data?.data;
    },
    enabled: !search,
    placeholderData: keepPreviousData,
  });

  const createEmployee = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axiosHandler.post("/users/register-user", data);
        toast.success(res?.data?.message);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const searchEmployee = useQuery({
      queryKey: ["search-employee", search],
      queryFn: async () => {
        const res = await axiosHandler.get(
          `/users/search-employee?search=${search}`
        );
        return res.data.data;
      },
      enabled: !!search,
      placeholderData: keepPreviousData,
    });

    const updateEmployee = useMutation({
        mutationFn: async ({ id, data }) => {
          try {
            const res = await axiosHandler.put(
              `/users/update-user-by-admin/${id}`,
              data
            );
            toast.success(res?.data?.message);
          } catch (error) {
            console.log(error);
          }
        },
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["employees"] });
        },
      });
  return {
    getAllEmployee,
    createEmployee,
    searchEmployee,
    updateEmployee,
  };
};