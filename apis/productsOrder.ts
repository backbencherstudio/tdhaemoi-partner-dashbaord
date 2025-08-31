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

// get single order /customer-orders/3a63db17-8720-44ca-bfd9-8200e3618742
export const getSingleOrder = async (orderId: string) => {
    try {
        const response = await axiosClient.get(`/customer-orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


// pdf send to customer 
export const pdfSendToCustomer = async (orderId: string, formData: FormData) => {
    try {
        const response = await axiosClient.post(`/customer-orders/upload-invoice/${orderId}?sendToClient=true`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
