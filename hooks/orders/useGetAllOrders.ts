import { useState, useEffect } from 'react';
import { getAllOrders } from '@/apis/productsOrder';

export interface ApiOrderData {
    id: string;
    fußanalyse: number;
    einlagenversorgung: number;
    orderStatus: string;
    statusUpdate: string;
    invoice: string | null;
    createdAt: string;
    updatedAt: string;
    customer: {
        id: string;
        vorname: string;
        nachname: string;
        email: string;
        telefonnummer: string;
        wohnort: string;
        customerNumber: number;
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

export interface PaginationData {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface OrdersResponse {
    success: boolean;
    message: string;
    data: ApiOrderData[];
    pagination: PaginationData;
}

export const useGetAllOrders = (page: number = 1, limit: number = 10, days: number = 30) => {
    const [orders, setOrders] = useState<ApiOrderData[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async (pageNum: number, limitNum: number, daysNum: number) => {
        try {
            setLoading(true);
            setError(null);
            const response: OrdersResponse = await getAllOrders(pageNum, limitNum, daysNum);
            
            if (response.success) {
                setOrders(response.data);
                setPagination(response.pagination);
            } else {
                setError(response.message || 'Failed to fetch orders');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page, limit, days);
    }, [page, limit, days]);

    const refetch = () => {
        fetchOrders(page, limit, days);
    };

    return {
        orders,
        pagination,
        loading,
        error,
        refetch
    };
};
