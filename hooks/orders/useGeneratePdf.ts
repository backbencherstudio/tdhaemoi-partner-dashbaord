"use client";

import { useCallback, useState } from 'react';
import { getSingleOrder } from '@/apis/productsOrderApis';
import toast from 'react-hot-toast';

export interface OrderPdfData {
    id: string;
    customerId: string;
    partnerId: string;
    fußanalyse: number;
    einlagenversorgung: number;
    totalPrice: number;
    productId: string;
    orderStatus: string;
    statusUpdate: string;
    invoice: any;
    createdAt: string;
    updatedAt: string;
    customer: {
        id: string;
        customerNumber: number;
        vorname: string;
        nachname: string;
        email: string;
        telefonnummer: string;
        wohnort: string;
    };
    partner: {
        id: string;
        name: string;
        email: string;
        image: string;
        role: string;
    };
    product: {
        id: string;
        name: string;
        rohlingHersteller: string;
        artikelHersteller: string;
        versorgung: string;
        material: string;
        langenempfehlung: Record<string, number>;
        status: string;
        diagnosis_status: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

export const useGeneratePdf = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [orderData, setOrderData] = useState<OrderPdfData | null>(null);

    const fetchOrderData = useCallback(async (orderId: string) => {
        try {
            setIsGenerating(true);
            const response = await getSingleOrder(orderId);
            if (response.success) {
                setOrderData(response.data);
                return response.data;
            } else {
                toast.error('Failed to fetch order data');
                return null;
            }
        } catch (error) {
            console.error('Failed to fetch order data:', error);
            toast.error('Failed to fetch order data');
            return null;
        } finally {
            setIsGenerating(false);
        }
    }, []);

    return {
        isGenerating,
        orderData,
        fetchOrderData
    };
};