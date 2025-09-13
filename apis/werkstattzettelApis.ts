import axiosClient from "@/lib/axiosClient";

interface Werkstattzettel {
    employeeId: string;
    completionDays: string;
    pickupLocation: string;
    sameAsBusiness: boolean;
    showCompanyLogo: boolean;
    autoShowAfterPrint: boolean;
    autoApplySupply: boolean;
}


export const searchEmployee = async (page: number, limit: number, search: string) => {
    try {
        const response = await axiosClient.get(`/employees/search?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// create werkstattzettel /workshop-note/set
export const createWerkstattzettel = async (werkstattzettel: Werkstattzettel) => {
    try {
        const response = await axiosClient.post(`/workshop-note/set`, werkstattzettel);
        return response.data;
    } catch (error) {
        throw error;
    }
}