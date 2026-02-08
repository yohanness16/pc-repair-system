import type { Axios, AxiosInstance } from "axios"
import apiClient from "./axiosConfig"

export const registerUser = async (apiClient: AxiosInstance, newUserData: any) => {
    const response = await apiClient.post('/Staff/register/', newUserData)
    return response.data
}

export const getAllUsers = async (apiClient: AxiosInstance) => {
    const response = await apiClient.get('/Staff/list/')
    return response.data
}

export const resetUserPassword = async (apiClient: AxiosInstance, userId: any, payload: any) => {
    const response = await apiClient.post('/Staff/forgot/', payload)
    console.log(payload);
    
    return response.data
}

export const getUserById = async (apiClient: AxiosInstance, userId: any, newPassword: any) => {
    const response = await apiClient.get(`/Staff/list/${userId}/`)
    return response.data
}