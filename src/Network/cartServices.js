import apiClient from "./api-client";

export function addToCartAPI(id, quantity) {
    return apiClient.post(`/cart/${id}`, {quantity: quantity });
}

export function getCartaPI() {
    return apiClient.get('/cart')
}

export function removeFromCartAPI(id) {
    return apiClient.patch(`/cart/remove/${id}`)
}