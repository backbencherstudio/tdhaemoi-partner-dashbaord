import axiosClient from "@/lib/axiosClient";


// create price /customer-price
export const createPrice = async (priceData: any) => {
    try {
        const response = await axiosClient.post('/customer-price', priceData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// get all prices 
export const getAllPrices = async (page: number, limit: number) => {
    try {
        const response = await axiosClient.get(`/customer-price?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// get price by id 
export const getPriceById = async (id: string) => {
    try {
        const response = await axiosClient.get(`/customer-price/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// update price 
export const updatePrice = async (id: string, priceData: any) => {
    try {
        const response = await axiosClient.patch(`/customer-price/${id}`, priceData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// delete price 
export const deletePrice = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/customer-price/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}