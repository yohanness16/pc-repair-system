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

export const requestEquipmentApproval = async (apiClient: AxiosInstance, requestData: any) => {
  const response = await apiClient.post('/Repairs/request/', requestData);
  return response.data;
};

/**
 * 2. ADMIN: Approves or rejects a new equipment creation request.
 */
export const getAllRepairs = async (apiClient: AxiosInstance, ) => {
  const response = await apiClient.post(`/Repairs/repairs/`);
  return response.data;
};

export const approveOrRejectCreation = async (apiClient: AxiosInstance, equipmentId: any, isApproved: any, rejectionReason: any) => {
  const allRepairs = getAllRepairs(apiClient)
  const data: [] = await allRepairs
  // const specifcRepair = data.filter((rep) => rep.equipmentId === equipmentId)
  const payload = { approved: isApproved, reason: rejectionReason };
  const response = await apiClient.post(`/Repairs/approve/${equipmentId}/`, payload);
  return response.data;
};



/**
 * 3. STAFF: Submits a completed repair report for admin approval.
 * (This uses the existing update function, just with a specific status).
 */
export const requestRepairCompletion = async (apiClient: AxiosInstance, id: any, reportData: any) => {
    const payload = { ...reportData, status: 'pending_completion' };
    const response = await apiClient.patch(`/equipments/${id}/`, payload);
    return response.data;
};

/**
 * 4. ADMIN: Approves or rejects a repair completion request.
 */
export const approveOrRejectCompletion = async (apiClient: AxiosInstance, id: any, isApproved: any, rejectionReason = null) => {
    const payload = { approved: isApproved, reason: rejectionReason };
    const response = await apiClient.post(`/equipments/${id}/approve-completion/`, payload);
    return response.data;
};