import apiClient from "./api-client";

export function checkoutAPI() {
    return apiClient.post("/order/checkout")
}