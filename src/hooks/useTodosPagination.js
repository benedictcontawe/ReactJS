import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiClient from "../utils/api-client";

const useTodosPagination = (query) => {
    const parameters = {
        _limit: query.pageSize,
        _start: (query.page - 1 ) * query.pageSize,
    };
    const fetchTodos = () => apiClient
        .get("/todos", { params: parameters })
        .then((response) => response.data )
    return useQuery({
        queryKey: ["todos", query],
        queryFn: fetchTodos,
        placeholderData: keepPreviousData
    });
}

export default useTodosPagination;