import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";

import React from "react";

const useQualityCheck = () => {
  const queryClient = useQueryClient();

   const qcData = useQuery({
    queryKey: "qcData",
    queryFn: async () => {
      return axiosHandler.get();
    },
  });

   const qcDataPost = useMutation({
    mutationFn: async (data) => {
      return await axiosHandler.post("/plc-products", data);
    },
  });

  return {qcDataPost};
};

export default useQualityCheck;
