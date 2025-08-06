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