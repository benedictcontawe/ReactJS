import { useMutation } from "@tanstack/react-query";
import apiClient from "../utils/api-client";

const useDeleteSeller = () => {
    return useMutation ( {
        mutationFn: (id) => apiClient.delete(`/users/${id}`).then((response) => response.data),
        onError: error => console.log("Sellers", "deleteSellerMutation", "onError", error), 
    } )
}

export default useDeleteSeller;