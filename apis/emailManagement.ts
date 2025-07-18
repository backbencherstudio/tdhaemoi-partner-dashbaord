import axiosClient from "@/lib/axiosClient";


interface CreateEmailData {
    email: string;
    subject: string;
    content: string;
}


// compose email
export const composeEmail = async (data: CreateEmailData) => {
    try {
        const response = await axiosClient.post('/message', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// receive email
export const receiveEmail = async (page: number, limit: number, search: string) => {
    try {
        const response = await axiosClient.get(`/message/inbox?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// sent email
export const sentAllEmail = async (page: number, limit: number, search: string) => {
    try {
        const response = await axiosClient.get(`/message/sendbox?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// get a favorite email 
export const getFavoriteEmail = async (page: number, limit: number, search: string) => {
    try {
        const response = await axiosClient.get(`/message/favorites?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};



// add and remove favorite 
export const addAndRemoveFavoriteEmail = async (id: string) => {
    try {
        const response = await axiosClient.put(`/message/${id}/favorite`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// get single email
export const getSingleEmail = async (id: string) => {
    try {
        const response = await axiosClient.get(`/message/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// group email delete body te id pass korbo

export const groupEmailDelete = async (messageIds: string[]) => {
    try {
        const response = await axiosClient.delete('/message/permanent', { data: { messageIds } });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// single email delete
export const singleEmailDelete = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/message/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};