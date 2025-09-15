"use client";

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { createOrder as createOrderApi, saveInvoicePdf, pdfSendToCustomer, getSingleOrder, customOrderCreate } from '@/apis/productsOrder';
import { generatePdfFromElement, pdfPresets } from '@/lib/pdfGenerator';

export const useCreateOrder = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);

    const createOrder = useCallback(async (customerId: string, versorgungId: string, werkstattzettelId?: string) => {
        setIsCreating(true);
        setLastOrderId(null);
        try {
            const response = await createOrderApi(customerId, versorgungId, werkstattzettelId);
            setLastOrderId((response as any)?.data?.id ?? (response as any)?.id ?? response?.orderId);
            try { if (typeof window !== 'undefined') localStorage.removeItem('werkstattzettelId'); } catch { }
            toast.success('Order created successfully');
            return response;
        } catch (error) {
            console.error('Failed to create order', error);
            toast.error('Failed to create order');
            throw error;
        } finally {
            setIsCreating(false);
        }
    }, []);

    const createOrderAndGeneratePdf = useCallback(async (customerId: string, versorgungId: string, autoSendToCustomer: boolean = false) => {
        setIsCreating(true);
        setLastOrderId(null);
        try {
            const werkstattzettelId = typeof window !== 'undefined' ? localStorage.getItem('werkstattzettelId') || undefined : undefined;
            const response = await createOrderApi(customerId, versorgungId, werkstattzettelId);
            const orderId = (response as any)?.data?.id ?? (response as any)?.id ?? response?.orderId;
            if (!orderId) {
                throw new Error('Order ID not received from API');
            }
            setLastOrderId(orderId);
            try { if (typeof window !== 'undefined') localStorage.removeItem('werkstattzettelId'); } catch { }

            try {
                const orderResponse = await getSingleOrder(orderId);
                if (!orderResponse.success) {
                    throw new Error('Failed to fetch order data');
                }

                const updateEvent = new CustomEvent('orderDataUpdated', {
                    detail: { orderData: orderResponse.data }
                });
                window.dispatchEvent(updateEvent);

                await new Promise(resolve => setTimeout(resolve, 100));

                const pdfBlob = await generatePdfFromElement('invoice-print-area', pdfPresets.balanced);

                // Save the PDF
                const formData = new FormData();
                formData.append('invoice', pdfBlob, `order_${orderId}.pdf`);
                await saveInvoicePdf(orderId, formData);

                if (autoSendToCustomer) {
                    try {
                        await sendPdfToCustomer(orderId);
                        toast.success('Order created successfully!');
                    } catch (sendError) {
                        toast.success('Order created successfully!');
                        toast.error('PDF saved but failed to send to customer');
                    }
                } else {
                    toast.success('Order created successfully!');
                }
            } catch (pdfError) {
                console.error('Failed to generate/save PDF:', pdfError);
                toast.success('Order created successfully!');
                toast.error('PDF generation failed');
            }

            return response;
        } catch (error) {
            console.error('Failed to create order', error);
            toast.error('Failed to create order');
            throw error;
        } finally {
            setIsCreating(false);
        }
    }, []);

    const generatePdfFromInvoicePage = useCallback(async (orderId: string) => {
        try {
            // Use shared PDF generation utility
            const pdfBlob = await generatePdfFromElement('invoice-print-area', pdfPresets.balanced);

            const formData = new FormData();
            formData.append('invoice', pdfBlob, `order_${orderId}.pdf`);

            await saveInvoicePdf(orderId, formData);

        } catch (error) {
            console.error('Failed to generate and save PDF:', error);
            throw error;
        }
    }, []);

    const sendPdfToCustomer = useCallback(async (orderId: string) => {
        try {
            await pdfSendToCustomer(orderId, new FormData());
        } catch (error) {
            console.error('Failed to send PDF to customer', error);
            throw error;
        }
    }, []);


    // custom order create
    const customOrderCreates = useCallback(async (customerId: string, payload: Record<string, any>) => {
        try {
            const res = await customOrderCreate(customerId, payload);
            return res;
        } catch (error) {
            console.error('Failed to create custom order', error);
            throw error;
        }
    }, []);

    return {
        createOrder,
        createOrderAndGeneratePdf,
        generatePdfFromInvoicePage,
        sendPdfToCustomer,
        isCreating,
        lastOrderId,
        customOrderCreates
    } as const;
};


