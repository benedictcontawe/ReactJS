import apiClient from "./api-client";

export function addToCartAPI(id, quantity) {
    return apiClient.post(`/cart/${id}`, {quantity: quantity });
}