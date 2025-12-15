import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await axiosHandler.get("/users/logout-user");
    },
    onSuccess: () => {
      qc.clear(); 
      navigate("/login");
    },
  });

  return logoutMutation;
};