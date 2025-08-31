import { useState } from 'react';
import { updateOrderStatus } from '@/apis/productsOrder';

export const useUpdateOrderStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStatus = async (orderId: string, status: string) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await updateOrderStatus(orderId, status);
            
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to update order status');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating order status';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        updateStatus,
        loading,
        error,
        clearError
    };
};
