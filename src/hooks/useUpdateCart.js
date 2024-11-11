import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../Network/api-client"

const useUpdateCart = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, type}) => apiClient.patch(`/cart/${type}/${id}`).then(response => response.data),
        onSuccess: () => {
            console.log("useIncreaseProduct", "onSuccess")
            queryClient.invalidateQueries({
                queryKey: ["cart"]
            })
        }
    })
}

export default useUpdateCart;