import axiosClient from "@/lib/axiosClient";

// get all exercises 
export const getAllExercises = async () => {
    try {
        const response = await axiosClient.get('/v2/exercises');
        return response.data;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        throw error;
    }
}


// send exercises to customer email

export const sendExercisesToCustomerEmail = async (pdf: File, email: string) => {
    try {
        const response = await axiosClient.post('/exercises', { pdf, email }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending exercises to customer email:', error);
        throw error;
    }
}




