import axiosClient from "@/lib/axiosClient";

// create sammelbestellung
export const createSammelbestellung = async (sammelbestellungData: any) => {
    try {
        const response = await axiosClient.post('/sammelbestellungen', sammelbestellungData);
        return response.data;
    } catch (error) {
        throw error;
    }
}