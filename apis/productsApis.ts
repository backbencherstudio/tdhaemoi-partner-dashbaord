import axiosClient from "@/lib/axiosClient";

// get categories products
export const getCategoriesProducts = async (
    params?: {
        limit?: number;

    }
) => {
    try {
        const queryParams = new URLSearchParams({
            limit: (params?.limit || 12).toString(),
        });
        const response = await axiosClient.get(`/products/categories?${queryParams}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};



