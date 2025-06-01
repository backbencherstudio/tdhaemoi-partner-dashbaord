import axiosClient from "@/lib/axiosClient";

// create appoinment
export const createAppoinment = async (appointmentData: {
    customer_name: string;
    time: string;
    date: string;
    reason: string;
    assignedTo: string;
    details: string;
    isClient: boolean;
    userId: string;
}) => {
    try {
        const response = await axiosClient.post('/appointment', appointmentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// get my appointments
export const getMyAppointments = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const queryParams = new URLSearchParams({
            page: (params?.page || 1).toString(),
            limit: (params?.limit || 10).toString(),
            search: params?.search || ''
        });

        const response = await axiosClient.get(`/appointment/my?${queryParams}`);

        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// delete appointment
export const deleteAppointment = async (appointmentId: string) => {
    try {
        const response = await axiosClient.delete(`/appointment/${appointmentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

