import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../../config/axiosconfig";
import { toast } from "react-toastify";

export const useReleaseGroup = () => {
  const qc = useQueryClient();


    const getReleaseGroup = useQuery({
      queryKey: ["release"],
      queryFn: async () => {
        const res = await axiosHandler.get("release-group/get");
        return res?.data?.data;
      },
    });



   const postReleaseGroup = useMutation({
        mutationFn: async (values) => {

            const res = await axiosHandler.post(
              `/release-group/create`,
              values,
            );
            return res?.data
        },
        onSuccess: (data) => {
            toast.success(data?.message)
            qc.invalidateQueries({ queryKey: [""] })
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message)
        }
    })

  return {
    postReleaseGroup,
    getReleaseGroup,
  };
  
};
