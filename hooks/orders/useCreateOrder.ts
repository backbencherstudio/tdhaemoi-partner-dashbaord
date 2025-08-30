"use client";

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { createOrder as createOrderApi } from '@/apis/productsOrderApis';

export const useCreateOrder = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);

    const createOrder = useCallback(async (customerId: string, versorgungId: string) => {
        setIsCreating(true);
        setLastOrderId(null);
        try {
            const response = await createOrderApi(customerId, versorgungId);
            setLastOrderId((response as any)?.data?.id ?? (response as any)?.id ?? null);
            toast.success('Order created successfully');
            return response;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to create order', error);
            toast.error('Failed to create order');
            throw error;
        } finally {
            setIsCreating(false);
        }
    }, []);

    return { createOrder, isCreating, lastOrderId } as const;
};


