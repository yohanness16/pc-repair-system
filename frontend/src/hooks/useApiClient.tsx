// useApiClient.ts
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export function useApiClient() {
  const { user } = useAuth();
  const accessToken = user?.access;
  const apiClient = axios.create({
    baseURL: "http://10.22.125.202:8000/api",
  });

  apiClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return apiClient;
}
