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


// send  email data should be like this
export const getInboxEmail = async (page: number, limit: number) => {
    try {
        const response = await axiosClient.get(`/message/inbox?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// get all email 
export const getAllEmail = async (page: number, limit: number) => {
    try {
        const response = await axiosClient.get(`/message/sendbox?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

