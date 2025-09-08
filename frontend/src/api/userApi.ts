import type { AxiosInstance } from "axios"

export const registerUser = async (apiClient: AxiosInstance, newUserData: any) => {
    const response = await apiClient.post('/Staff/register/', newUserData)
    return response.data
}

export const getAllUsers = async (apiClient: AxiosInstance, newUserData: any) => {
    const response = await apiClient.post('/Staff/register/', newUserData)
    return response.data
}