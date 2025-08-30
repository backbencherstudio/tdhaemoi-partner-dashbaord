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

// update customer information with JSON data
export const updateCustomerInfo = async (id: string, customerData: any) => {
    try {
        const response = await axiosClient.patch(`/customers/${id}`, customerData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// add new scanner file 
export const addNewScannerFile = async (customerId: string, scannerFileData: any) => {
    try {
        const response = await axiosClient.post(`/customers/screener-file/${customerId}`, scannerFileData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// update single scanner file 
export const updateSingleScannerFile = async (customerId: string, screenerId: string, scannerFileData: any) => {
    try {
        const response = await axiosClient.patch(`/customers/update-screener-file/${customerId}/${screenerId}`, scannerFileData);
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


// details diagnosis add and update 
export const detailsDiagnosis = async (id: string, ausfuhrliche_diagnose: any) => {
    try {
        const formData = new FormData();
        formData.append('ausfuhrliche_diagnose', ausfuhrliche_diagnose);

        const response = await axiosClient.patch(`/customers/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// use customer note add 
export const addCustomerNote = async (id: string, note: string, category: string = 'Notizen', date: string) => {
    try {
        const response = await axiosClient.post(`/customers-history/notizen/${id}`, {
            note,
            category,
            date
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// get customer note
export const getCustomerNote = async (id: string, page: number, limit: number, category: string) => {
    try {
        // Build query parameters dynamically
        const params = new URLSearchParams();
        params.append('customerId', id);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        // Only add category if it's not empty
        if (category && category.trim() !== '') {
            params.append('category', category);
        }

        const finalUrl = `customers-history?${params.toString()}`;
        const response = await axiosClient.get(finalUrl);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}


// delete customer note
export const deleteCustomerNote = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/customers-history/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// update customer note
export const updateCustomerNote = async (id: string, note: string, category: string = 'Notizen', date: string) => {
    try {
        const response = await axiosClient.patch(`/customers-history/${id}`, { note, category, date });
        return response.data;
    } catch (error) {
        throw error;
    }
}


// create order 
export const createOrder = async (customerId: string, versorgungId: string) => {
    try {
        const response = await axiosClient.post('/customer-orders/create', { customerId, versorgungId });
        return response.data;
    } catch (error) {
        throw error;
    }
}