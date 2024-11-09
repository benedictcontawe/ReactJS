import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/api-client";

const fetchSellers = () => apiClient.get("/users").then((response) => response.data )

const useSellers = () => {
    return useQuery({
        queryKey: ["sellers"],
        queryFn: fetchSellers,
        gcTime: 600_000,//10m
        retry: 2,
        staleTime: 6 * 1000,
        refreshOnReconnect: true,
        refreshOnMount: true,
        refreshOnWindowFocus: true,
    });
}

export default useSellers;