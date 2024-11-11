import apiClient from "./api-client";

export function increaseProductAPI(id) {
    return apiClient.patch(`/cart/increase/${id}`)
}

export function decreaseProductAPI(id) {
    return apiClient.patch(`/cart/decrease/${id}`)
}