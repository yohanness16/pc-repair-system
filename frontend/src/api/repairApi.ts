import { type AxiosInstance } from "axios"

export const updateEquipmentStatus = async (
  apiClient: AxiosInstance,
  status: any,
  id: any
) => {
  const response = await apiClient.post(`/Repairs/complete/${id}`, {status: status});
  return response.data;
};