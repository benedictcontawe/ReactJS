import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/api-client";

const useTodos = (userId) => {
    const parameters = {};
    if(userId) 
        parameters.userId
    const fetchTodos = () => apiClient
        .get("/todos", { params: parameters })
        .then((response) => response.data )
    return useQuery({ // users/1/todos
        queryKey: userId ? ["users", userId, "todos"] : ["todos"],
        queryFn: fetchTodos,
    });
}

export default useTodos;