import apiClient from "./api-client";

export function getSuggestionsAPI(search) {
    return apiClient.get(`/products/suggestions?search=${search}`)
    /*
    const fetchProductsBySearch = () => 
        apiClient.get(`/products/suggestions?search=${search}`).then((res) => res.data);
     
    return useQuery({
    queryKey: ["products", "suggestions", search],
    queryFn: fetchProductsBySearch,
    staleTime: 10_000,
    enabled: search.trim() !== "",
    });
    */
}