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
        const response = await axiosClient.get(`/store/get/${storageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// update storage /store/update/9082a642-7a88-4b5c-a34c-9ad08c062c82

export const updateStorage = async (storageId: string, storageData: any) => {
    try {
        const response = await axiosClient.patch(`/store/update/${storageId}`, storageData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// delete storage
export const deleteStorage = async (storageId: string) => {
    try {
        const response = await axiosClient.delete(`/store/delete/${storageId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

    