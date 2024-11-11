import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../Network/api-client"

const useRemoveFromCart = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({id}) => apiClient.patch(`/cart/remove/${id}`).then(response => response.data),
        onSuccess:() => {
            console.log("useRemoveFromCart", "onSuccess")
            queryClient.invalidateQueries({
                queryKey: ["cart"]
            })
        }
    })
}

export default useRemoveFromCart;