import  { type AxiosInstance } from "axios";
import apiClient from "./axiosConfig";

export const register = async (userData: any) => {
    
    const response = await apiClient.post(`/Staff/register/`, userData)
    return response.data
}

export const login = async ( apiClient: AxiosInstance, userData: any) => {
    const response = await apiClient.post(`/Staff/login/`, userData)
    return response.data
}