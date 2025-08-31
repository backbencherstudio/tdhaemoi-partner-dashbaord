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


// get all orders  customer-orders?page=1&limit=10&days=7
export const getAllOrders = async (page: number, limit: number, days: number) => {
    try {
        const response = await axiosClient.get(`/customer-orders?page=${page}&limit=${limit}&days=${days}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// update order status
export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
    try {
        const response = await axiosClient.patch(`/customer-orders/status/${orderId}`, { orderStatus });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// delete order 
export const deleteOrder = async (orderId: string) => {
    try {
        const response = await axiosClient.delete(`/customer-orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

