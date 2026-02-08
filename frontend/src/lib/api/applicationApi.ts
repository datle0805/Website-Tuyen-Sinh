import api from '../api';

export interface ApplicationData {
    _id?: string;
    applicationNumber?: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    country: string;
    educationLevel: string;
    status?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    appointmentLocation?: string;
    appointmentNotes?: string;
    reviewNotes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const submitApplication = async (data: ApplicationData, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.post('/api/applications', data, config);
    return response.data;
};

export const getApplications = async () => {
    const response = await api.get('/api/applications');
    return response.data;
};

export const getApplicationById = async (id: string) => {
    const response = await api.get(`/api/applications/${id}`);
    return response.data;
};

export const updateApplication = async (id: string, data: Partial<ApplicationData>) => {
    const response = await api.patch(`/api/applications/${id}`, data);
    return response.data;
};

export const updateStatus = async (id: string, status: string, reviewNotes?: string) => {
    const response = await api.patch(`/api/applications/${id}/status`, { status, reviewNotes });
    return response.data;
};

export const setAppointment = async (id: string, appointmentInfo: any) => {
    const response = await api.patch(`/api/applications/${id}/appointment`, appointmentInfo);
    return response.data;
};
