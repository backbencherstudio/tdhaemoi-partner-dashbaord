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


// add customer versorgung 
export const addCustomerVersorgung = async (customerId: string, versorgungId: string) => {
    try {
        const response = await axiosClient.post(`/customers/assign-versorgungen/${customerId}/${versorgungId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


// add customer question
export const addCustomerQuestion = async (questionData: any) => {
    try {
        const response = await axiosClient.post('/einlagen-finder', questionData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// get customer question options 
export const getCustomerQuestionOptions = async (customerId: string) => {
    try {
        const response = await axiosClient.get(`/einlagen-finder/answer/${customerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}



export const searchCustomers = async (searchData: any, page: number, limit: number, name: string, email: string, phone: string) => {
    try {
        const response = await axiosClient.get(`/customers/search?limit=${limit}&search=${searchData}&location=${searchData}&email=${email}&phone=${phone}&location=${searchData}&name=${name}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}