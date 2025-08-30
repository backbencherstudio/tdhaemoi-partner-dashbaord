import axiosClient from "@/lib/axiosClient";

// create order 
export const createOrder = async (customerId: string, versorgungId: string) => {
    try {
        const response = await axiosClient.post('/customer-orders/create', { customerId, versorgungId });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// get single order 
export const getSingleOrder = async (orderId: string) => {
    try {
        const response = await axiosClient.get(`/customer-orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
