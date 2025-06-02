import axiosClient from "@/lib/axiosClient";

interface SuggestionData {
    name: string;
    email: string;
    phone: string;
    firma: string;
    suggestion: string;
}

//post suggestion
export const postSuggestion = async (data: SuggestionData) => {
    try {
        const response = await axiosClient.post('/suggestions/improvement', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
