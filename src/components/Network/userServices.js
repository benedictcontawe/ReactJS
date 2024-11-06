import apiClient from './api-client'

export function signUp(user, image) {
    const body = new FormData()
    body.append("name", user.name)
    body.append("email", user.email)
    body.append("password", user.password)
    body.append("deliveryAddress", user.deliveryAddress)
    body.append("image", image)
    
    return apiClient.post("/user/signup", body)
}