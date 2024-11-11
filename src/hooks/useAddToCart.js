import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../Network/api-client"

const useAddToCart = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id, quantity}) => apiClient
            .post(`/cart/${id}`, {quantity: quantity })
            .then(response => response.data),
        onSuccess:() => {
            console.log("useAddToCart", "onSuccess")
            queryClient.invalidateQueries({
                queryKey: ["cart"]
            })
        }
    })
}

export default useAddToCart;