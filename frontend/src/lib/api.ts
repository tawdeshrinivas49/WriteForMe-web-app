import axios from 'axios';
import { useUser } from '@/store/useUser';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach JWT from store
apiClient.interceptors.request.use(
  (config) => {
    const token = useUser.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – 401 redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useUser.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ====== AUTH ======
export const loginWithDigilocker = () => {
  window.location.href = `${API_BASE_URL}/auth/digilocker/init`;
};

// ====== REQUESTS ======
export const createRequest = async (data: any) => {
  const response = await apiClient.post('/requests', data);
  return response.data;
};

export const getRequests = async () => {
  const response = await apiClient.get('/requests');
  return response.data;
};

export const getRequestById = async (id: string) => {
  const response = await apiClient.get(`/requests/${id}`);
  return response.data;
};

export const verifyStartPin = async (id: string, pin: string) => {
  const response = await apiClient.post(`/requests/${id}/verify-start-pin`, { pin });
  return response.data;
};

export const verifyCompletionPin = async (id: string, pin: string) => {
  const response = await apiClient.post(`/requests/${id}/verify-completion-pin`, { pin });
  return response.data;
};

// ====== OCR ======
export const uploadAdmitCard = async (file: File) => {
  const formData = new FormData();
  formData.append('admitCard', file);
  const response = await apiClient.post('/ocr/upload-admit-card', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ====== DASHBOARD (existing) ======
export const fetchStudentDashboard = async () => {
  const response = await apiClient.get('/users/dashboard/student');
  return response.data;
};

export const fetchVolunteerDashboard = async () => {
  const response = await apiClient.get('/users/dashboard/volunteer');
  return response.data;
};

// ====== MATCHING ======
export const findVolunteers = async (requestId: string, radiusKm: number = 10) => {
  const response = await apiClient.get(`/matching/find-volunteers/${requestId}?radiusKm=${radiusKm}`);
  return response.data;
};

export const assignVolunteer = async (requestId: string, volunteerId?: string, userId?: string) => {
  const payload: any = { requestId };
  if (volunteerId) payload.volunteerId = volunteerId;
  if (userId) payload.userId = userId;
  const response = await apiClient.post('/matching/assign', payload);
  return response.data;
};

export const getEligibleRequestsForVolunteer = async (radiusKm: number = 10) => {
  const response = await apiClient.get(`/matching/available-requests?radiusKm=${radiusKm}`);
  return response.data;
};

// fetching history endpoint

// export const fetchUserHistory = async () => {
//   const response = await apiClient.get('/users/history'); // if you create this endpoint
//   return response.data;
// };
