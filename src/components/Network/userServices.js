import axios from 'axios'
import apiClient from './api-client'
import { jwtDecode } from 'jwt-decode';

const tokenName = "token";

export async function signUp(user, image) {
    const body = new FormData()
    body.append("name", user.name)
    body.append("email", user.email)
    body.append("password", user.password)
    body.append("deliveryAddress", user.deliveryAddress)
    body.append("image", image)
    const { data } = await apiClient.post("/user/signup", body)
    localStorage.setItem(tokenName, data.token);
}

export async function login(email, password) {
     const response = await apiClient.post (
        "/user/login", 
        { email, password }
    );
    localStorage.setItem(tokenName, response.data.token);
    return response
}

export function logout() {
    localStorage.removeItem(tokenName);
}

export function getUser() {
    try {
        const jwt = localStorage.getItem(tokenName)
        return jwtDecode(jwt)    
    } catch (error) {
        return null
    }
}