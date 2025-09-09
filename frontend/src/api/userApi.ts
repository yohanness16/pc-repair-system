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

export const resetUserPassword = async (apiClient: AxiosInstance, payload: any) => {

}

export const getUserById = async (apiClient: AxiosInstance, userId: any, newPassword: any) => {
    const allUsers = await getAllUsers(apiClient).then((response) => response.data)
    const user = allUsers.filter((u) => u.id === userId)
    return user
}