import axiosClient from "@/lib/axiosClient";

// create product
export const createProduct = async (productData: any) => {
    try {
        const response = await axiosClient.post('/store/create', productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// get all storages
export const getAllStorages = async () => {
    try {
        const response = await axiosClient.get('/store/my/get');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// get single storage
export const getSingleStorage = async (storageId: string) => {
    try {
        const response = await axiosClient.get(`/store/single/${storageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// update storage

// delete storage
export const deleteStorage = async (storageId: string) => {
    try {
        const response = await axiosClient.delete(`/store/delete/${storageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

    