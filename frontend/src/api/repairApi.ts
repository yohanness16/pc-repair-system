import { type AxiosInstance } from "axios"

export const updateEquipmentStatus = async (
  apiClient: AxiosInstance,
  id: any,
  payload: any
) => {
  console.log(payload);
  
  
  const response = await apiClient.patch(`/Repairs/complete/${id}/`, payload);
  return response.data;
};

// export const updateEquipmentStatusForStaff = async (
//   apiClient: AxiosInstance,
//   status: any,
//   id: any
// ) => {
//   const response = await apiClient.patch(`/Repairs/complete/${id}`, {status: status});
//   return response.data;
// };