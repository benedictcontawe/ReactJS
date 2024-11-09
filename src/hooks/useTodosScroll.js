import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../utils/api-client";

const useTodosPagination = (query) => {
    const fetchTodos = (pageParam =  1) => apiClient
        .get("/todos", { params: {
            _limit: query.pageSize,
            _start: (pageParam - 1 ) * query.pageSize,
        } })
        .then((response) => response.data )
    return useInfiniteQuery({
        queryKey: ["todos", query],
        queryFn: fetchTodos,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : null;
        }
    });
}

export default useTodosPagination;