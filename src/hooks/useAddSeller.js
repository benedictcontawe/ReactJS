import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../utils/api-client";

const useAddSeller = () => {
    const queryClient = useQueryClient();
    return useMutation ( {
        mutationFn: (newSeller) => apiClient.post("/users", newSeller).then(response => response.data),
        onMutate: (newSeller) => {
            console.log("Sellers", "addSellerMutation", "onMutate", newSeller)
            const previousSellers = queryClient.getQueryData(["sellers"])
            queryClient.setQueryData(["sellers"], (sellers) => [
                newSeller, 
                ...sellers,
           ])
           return { previousSellers }
        },
        onSuccess: (savedSeller, newSeller) => {
            /* Method 1: Invalid cahced data, Not working
            queryClient.invalidateQueries({
                queryKey: ["sellers"],
            })
            Method 2: Update the cached data, working for Pessemistic Approach
            queryClient.setQueryData(["sellers"], (sellers) => [
                savedSeller, 
                ...sellers,
           ])
            */
           queryClient.setQueriesData(["sellers", (sellers) => sellers?.map(seller => seller === newSeller ? savedSeller : seller)])
        },
        onError: (error, newSeller, context) => { console.log("Sellers", "addSellerMutation", "onError", error) 
            if(!context) {
                return;
            }
            queryClient.setQueryData(["sellers"], context.previousSellers)
        }, 
    } )
}

export default useAddSeller;