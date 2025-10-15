import axiosClient from "@/lib/axiosClient";

// create sammelbestellung
export const createSammelbestellung = async (number: number) => {
    try {

        const response = await axiosClient.post('/bestellubersicht', { number });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getSammelbestellung = async () => {
    try {
        const response = await axiosClient.get('/bestellubersicht');
        return response.data;
    } catch (error) {
        throw error;
    }
}