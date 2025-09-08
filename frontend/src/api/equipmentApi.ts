import { type AxiosInstance } from "axios"
import apiClient from "./axiosConfig";

export const createEquipment = async (
  apiClient: AxiosInstance,
  equipmentData: any
) => {
  const response = await apiClient.post("/equipment/create/", equipmentData);
  return response.data;
};

export const getAllEquipments = async (
    apiClient: AxiosInstance,
) => {
    const response = await apiClient.get('/equipment/show/')
    return response.data
}

export const getEquipmentById = async(
  apiClient: AxiosInstance, ticketId: any
) => {
  const response = await apiClient.get(`/equipment/show/${ticketId}`)
    return response.data
}