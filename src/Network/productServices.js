import apiClient from "./api-client";

export function getSuggestionsAPI(search) {
    return apiClient.get(`/products/suggestions?search=${search}`)
}