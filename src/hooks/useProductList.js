import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../Network/api-client";

const useProductList = (query) => {
    const fetchFunction = ({pageParam = 1}) => apiClient
    .get("/products", {params: {... query, page: pageParam}})
    .then(response => response.data);

    return useInfiniteQuery({
        queryKey: ["Products", query],
        queryFn: fetchFunction,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : null;
        }
    })
}

export default useProductList;