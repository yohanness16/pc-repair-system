import axios from "axios";
import { useAuth } from "../context/AuthContext";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api'
})

apiClient.interceptors.request.use(
    (config) => {
        const {user} = useAuth()  
        const token = user

        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClient