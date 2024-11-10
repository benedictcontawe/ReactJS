import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../utils/api-client";

const useDeleteSeller = () => {
    const queryClient = useQueryClient();
    return useMutation ( {
        mutationFn: (updatedSeller) => apiClient.patch(`/users/${updatedSeller.id}`, updatedSeller).then((response) => { return response.data }),
        onSuccess: (updatedSeller) => {
            queryClient.setQueryData(["sellers"], (sellers) => sellers.map((mapSeller) =>
                mapSeller.id === updatedSeller.id ? updatedSeller : mapSeller
            ) )
        },
        onError: error => console.log("Sellers", "updateSellerMutation", "onError", error), 
    } )
}

export default useDeleteSeller;