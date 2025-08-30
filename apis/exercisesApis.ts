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




