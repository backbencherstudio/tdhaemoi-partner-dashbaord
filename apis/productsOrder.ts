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

// invoice pdf save 
export const saveInvoicePdf = async (orderId: string, formData: FormData) => {
    try {
        const response = await axiosClient.post(`/customer-orders/upload-invoice-only/${orderId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


// pdf send to customer  /customer-orders/send-invoice/3990f6ed-77fe-4b7d-8f31-3c2f715e3114
export const pdfSendToCustomer = async (orderId: string, formData: FormData) => {
    try {
        const response = await axiosClient.post(`/customer-orders/send-invoice/${orderId}`);
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



