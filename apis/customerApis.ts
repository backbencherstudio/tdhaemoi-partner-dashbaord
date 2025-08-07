import axiosClient from "@/lib/axiosClient";

// add customer
export const addCustomer = async (customerData: FormData) => {
    try {
        const response = await axiosClient.post('/customers', customerData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// get all customers
export const getAllCustomers = async (page: number, limit: number) => {
    try {
        const response = await axiosClient.get(`/customers?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// get single customer
export const getSingleCustomer = async (id: string) => {
    try {
        const response = await axiosClient.get(`/customers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// update customers
export const updateSingleCustomer = async (id: string, customerData: FormData) => {
    try {
        const response = await axiosClient.patch(`/customers/${id}`, customerData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
