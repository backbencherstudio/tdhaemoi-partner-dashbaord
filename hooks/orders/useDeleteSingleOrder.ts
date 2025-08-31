import { useState } from 'react';
import { deleteOrder } from '@/apis/productsOrder';

export const useDeleteSingleOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteSingleOrder = async (orderId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await deleteOrder(orderId);
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to delete order');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting order';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return { deleteSingleOrder, loading, error, clearError };
};
