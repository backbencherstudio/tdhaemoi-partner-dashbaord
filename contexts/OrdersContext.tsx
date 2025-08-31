'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useGetAllOrders, ApiOrderData } from '@/hooks/orders/useGetAllOrders';
import { updateOrderStatus as updateOrderStatusApi, deleteOrder as deleteOrderApi, getSingleOrder, getAllOrders } from '@/apis/productsOrder';
import { useUpdateOrderStatus } from '@/hooks/orders/useUpdateOrderStatus';

export interface OrderData {
    id: string;
    bestellnummer: string;
    kundenname: string;
    status: string;           // This will be the API status (e.g., "Sarted")
    displayStatus: string;    // This will be the German display text (e.g., "Einlage vorbereiten")
    preis: string;
    zahlung: string;
    beschreibung: string;
    abholort: string;
    fertigstellung: string;
    productName: string;
    deliveryDate: string;
    isPrioritized: boolean;
    currentStep: number;
}

interface OrdersContextType {
    orders: OrderData[];
    prioritizedOrders: OrderData[];
    loading: boolean;
    error: string | null;
    pagination: any;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    togglePriority: (orderId: string) => Promise<void>;
    moveToNextStep: (orderId: string) => void;
    moveToPreviousStep: (orderId: string) => void;
    updateOrderStatus: (orderId: string, newStatus: string, newStep: number) => Promise<void>;
    refetch: () => void;
    deleteOrder: (orderId: string) => void;
    deleteOrderByUser: (orderId: string) => void;
    refreshOrderData: (orderId: string) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const steps = [
    "Einlage vorbereiten",
    "Einlage in Fertigung",
    "Einlage verpacken",
    "Einlage Abholbereit",
    "Einlage versandt",
    "Ausgeführte Einlagen"
];

// Map German status names to API status values
const germanStatusToApiStatus: Record<string, string> = {
    "Einlage vorbereiten": "Einlage_vorbereiten",
    "Einlage in Fertigung": "Einlage_in_Fertigung",
    "Einlage verpacken": "Einlage_verpacken",
    "Einlage Abholbereit": "Einlage_Abholbereit",
    "Einlage versandt": "Einlage_versandt",
    "Ausgeführte Einlagen": "Ausgeführte_Einlagen"
};

// Map API status values to German status names
const apiStatusToGermanStatus: Record<string, string> = {
    "Started": "Einlage vorbereiten",
    "Sarted": "Einlage vorbereiten", // Handle typo in API
    "In Progress": "Einlage in Fertigung",
    "Packaging": "Einlage verpacken",
    "Ready for Pickup": "Einlage Abholbereit",
    "Shipped": "Einlage versandt",
    "Completed": "Ausgeführte Einlagen",
    "Delivered": "Ausgeführte Einlagen",
    // New API status mappings
    "Einlage_vorbereiten": "Einlage vorbereiten",
    "Einlage_in_Fertigung": "Einlage in Fertigung",
    "Einlage_verpacken": "Einlage verpacken",
    "Einlage_Abholbereit": "Einlage Abholbereit",
    "Einlage_versandt": "Einlage versandt",
    "Ausgeführte_Einlagen": "Ausgeführte Einlagen"
};

// Helper function to check if an order should be prioritized based on its status
const shouldBePrioritized = (orderStatus: string): boolean => {
    const prioritizedStatuses = [
        'Einlage_vorbereiten',
        'Einlage_in_Fertigung',
        'Einlage_verpacken',
        'Einlage_Abholbereit',
        'Einlage_versandt'
    ];
    return prioritizedStatuses.includes(orderStatus);
};

// Helper function to map API data to OrderData
const mapApiDataToOrderData = (apiOrder: ApiOrderData): OrderData => {
    // Map orderStatus to step index (you can customize this mapping)
    const statusToStepMap: Record<string, number> = {
        'Sarted': 0,
        'Started': 0,
        'In Progress': 1,
        'Packaging': 2,
        'Ready for Pickup': 3,
        'Shipped': 4,
        'Completed': 5,
        'Delivered': 5,
        // New API status mappings
        'Einlage_vorbereiten': 0,
        'Einlage_in_Fertigung': 1,
        'Einlage_verpacken': 2,
        'Einlage_Abholbereit': 3,
        'Einlage_versandt': 4,
        'Ausgeführte_Einlagen': 5
    };

    const currentStep = statusToStepMap[apiOrder.orderStatus] || 0;
    const germanStatus = apiStatusToGermanStatus[apiOrder.orderStatus] || apiOrder.orderStatus;
    const isPrioritized = shouldBePrioritized(apiOrder.orderStatus);

    return {
        id: apiOrder.id,
        bestellnummer: apiOrder.customer.customerNumber.toString(),
        kundenname: `${apiOrder.customer.vorname} ${apiOrder.customer.nachname}`,
        status: apiOrder.orderStatus, // Show original API status in table
        displayStatus: germanStatus, // Keep German status for display purposes
        preis: `${(apiOrder.fußanalyse + apiOrder.einlagenversorgung).toFixed(2)} €`,
        zahlung: "Offen",
        beschreibung: apiOrder.product.versorgung || apiOrder.product.status,
        abholort: "Abholung Innsbruck oder Wird mit Post versandt",
        fertigstellung: new Date(apiOrder.createdAt).toLocaleDateString('de-DE'),
        productName: apiOrder.product.status || apiOrder.product.name,
        deliveryDate: new Date(apiOrder.updatedAt).toLocaleDateString('de-DE'),
        isPrioritized: isPrioritized, // Set based on status
        currentStep: currentStep,
    };
};

export function OrdersProvider({ children }: { children: ReactNode }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [prioritizedOrders, setPrioritizedOrders] = useState<OrderData[]>([]);

    const { orders: apiOrders, loading, error, pagination, refetch } = useGetAllOrders(currentPage, 10);
    const { updateStatus: updateOrderStatusHook } = useUpdateOrderStatus();

    // Load all prioritized orders from API on mount
    useEffect(() => {
        const loadPrioritizedOrders = async () => {
            try {
                // Get all orders from first few pages to find prioritized ones
                const allPrioritizedOrders: OrderData[] = [];

                // Check first 3 pages for prioritized orders
                for (let page = 1; page <= 3; page++) {
                    const response = await getAllOrders(page, 10, 7);
                    if (response.success && response.data.length > 0) {
                        const mappedOrders = response.data.map(mapApiDataToOrderData);
                        const prioritizedFromPage = mappedOrders.filter((order: OrderData) => order.isPrioritized);
                        allPrioritizedOrders.push(...prioritizedFromPage);
                    }

                    // If no more pages, break
                    if (response.pagination && !response.pagination.hasNextPage) break;
                }

                setPrioritizedOrders(allPrioritizedOrders);
            } catch (error) {
                console.error('Failed to load prioritized orders:', error);
            }
        };

        loadPrioritizedOrders();
    }, []);

    // Update orders when API data changes
    useEffect(() => {
        if (apiOrders.length > 0) {
            const mappedOrders = apiOrders.map(mapApiDataToOrderData);
            setOrders(mappedOrders);

            // Update prioritized orders - preserve existing prioritized orders and add new ones
            setPrioritizedOrders(prevPrioritized => {
                // Keep all existing prioritized orders that are not in current page
                const existingPrioritized = prevPrioritized.filter(order =>
                    !mappedOrders.some(newOrder => newOrder.id === order.id)
                );

                // Add new orders that should be prioritized from current page
                const newPrioritized = mappedOrders.filter(order => order.isPrioritized);

                return [...existingPrioritized, ...newPrioritized];
            });
        }
    }, [apiOrders]);

    // Don't filter here - use the actual prioritizedOrders state

    const togglePriority = async (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const isPrioritizing = !order.isPrioritized;

        if (isPrioritizing) {
            // When prioritizing, set status to "Einlage vorbereiten" and update API
            try {
                await updateOrderStatusHook(orderId, "Einlage_vorbereiten"); // API expects "Einlage_vorbereiten"

                setOrders(prevOrders =>
                    prevOrders.map(o =>
                        o.id === orderId
                            ? {
                                ...o,
                                isPrioritized: true,
                                currentStep: 0,
                                status: "Einlage_vorbereiten", // Show API status in table
                                displayStatus: "Einlage vorbereiten" // Keep German for display
                            }
                            : o
                    )
                );

                // Update prioritized orders
                setPrioritizedOrders(prevPrioritized => {
                    const updatedOrder = {
                        ...order,
                        isPrioritized: true,
                        currentStep: 0,
                        status: "Einlage_vorbereiten", // API status for table
                        displayStatus: "Einlage vorbereiten" // German for display
                    };

                    // Check if order already exists in prioritized orders
                    const existingIndex = prevPrioritized.findIndex(o => o.id === orderId);
                    if (existingIndex >= 0) {
                        // Update existing
                        return prevPrioritized.map(o => o.id === orderId ? updatedOrder : o);
                    } else {
                        // Add new
                        return [...prevPrioritized, updatedOrder];
                    }
                });
            } catch (error) {
                console.error('Failed to update order status:', error);
            }
        } else {
            // When removing priority, just update local state
            setOrders(prevOrders =>
                prevOrders.map(o =>
                    o.id === orderId
                        ? { ...o, isPrioritized: false }
                        : o
                )
            );

            // Remove from prioritized orders
            setPrioritizedOrders(prevPrioritized =>
                prevPrioritized.filter(o => o.id !== orderId)
            );
        }
    };

    const moveToNextStep = async (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order || order.currentStep >= steps.length - 1) return;

        const nextStep = order.currentStep + 1;
        const nextGermanStatus = steps[nextStep];
        const nextApiStatus = germanStatusToApiStatus[nextGermanStatus];

        if (!nextApiStatus) {
            console.error('Invalid next status:', nextGermanStatus);
            return;
        }

        try {
            // Update status via API
            await updateOrderStatusHook(orderId, nextApiStatus);

            // Update local state with the new API status
            setOrders(prevOrders =>
                prevOrders.map(o =>
                    o.id === orderId
                        ? {
                            ...o,
                            currentStep: nextStep,
                            status: nextApiStatus, // Show API status in table
                            displayStatus: nextGermanStatus // Keep German for display
                        }
                        : o
                )
            );

            // Also update prioritized orders if this order is prioritized
            setPrioritizedOrders(prevPrioritized =>
                prevPrioritized.map(o =>
                    o.id === orderId
                        ? {
                            ...o,
                            currentStep: nextStep,
                            status: nextApiStatus, // API status for table
                            displayStatus: nextGermanStatus // German for display
                        }
                        : o
                )
            );
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const moveToPreviousStep = async (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order || order.currentStep <= 0) return;

        const previousStep = order.currentStep - 1;
        const previousGermanStatus = steps[previousStep];
        const previousApiStatus = germanStatusToApiStatus[previousGermanStatus];

        if (!previousApiStatus) {
            console.error('Invalid previous status:', previousGermanStatus);
            return;
        }

        try {
            // Update status via API
            await updateOrderStatusHook(orderId, previousApiStatus);

            // Update local state with the new API status
            setOrders(prevOrders =>
                prevOrders.map(o =>
                    o.id === orderId
                        ? {
                            ...o,
                            currentStep: previousStep,
                            status: previousApiStatus, // Show API status in table
                            displayStatus: previousGermanStatus // Keep German for display
                        }
                        : o
                )
            );

            // Also update prioritized orders if this order is prioritized
            setPrioritizedOrders(prevPrioritized =>
                prevPrioritized.map(o =>
                    o.id === orderId
                        ? {
                            ...o,
                            currentStep: previousStep,
                            status: previousApiStatus, // API status for table
                            displayStatus: previousGermanStatus // German for display
                        }
                        : o
                )
            );
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const updateOrderStatus = async (orderId: string, newGermanStatus: string, newStep: number) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const newApiStatus = germanStatusToApiStatus[newGermanStatus];
        if (!newApiStatus) {
            console.error('Invalid German status:', newGermanStatus);
            return;
        }

        try {
            // Update status via API
            await updateOrderStatusHook(orderId, newApiStatus);

            // Update local state
            setOrders(prevOrders =>
                prevOrders.map(o =>
                    o.id === orderId
                        ? {
                            ...o,
                            status: newApiStatus, // API status for table
                            currentStep: newStep,
                            displayStatus: newGermanStatus // German for display
                        }
                        : o
                )
            );

            // Also update prioritized orders if this order is prioritized
            setPrioritizedOrders(prevPrioritized =>
                prevPrioritized.map(o =>
                    o.id === orderId
                        ? {
                            ...o,
                            status: newApiStatus, // API status for table
                            currentStep: newStep,
                            displayStatus: newGermanStatus // German for display
                        }
                        : o
                )
            );
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const deleteOrder = async (orderId: string) => {
        await deleteOrderApi(orderId);
        
        // Immediately remove from local state
        setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
        setPrioritizedOrders(prevPrioritized => prevPrioritized.filter(o => o.id !== orderId));
        
        // Also refetch to ensure sync with server
        refetch();
    };

    const deleteOrderByUser = async (orderId: string) => {
        await deleteOrderApi(orderId);
        
        // Immediately remove from local state
        setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
        setPrioritizedOrders(prevPrioritized => prevPrioritized.filter(o => o.id !== orderId));
        
        // Also refetch to ensure sync with server
        refetch();
    };

    // Function to refresh a single order's data
    const refreshOrderData = async (orderId: string) => {
        try {
            const response = await getSingleOrder(orderId);
            if (response.success) {
                const updatedOrder = mapApiDataToOrderData(response.data);

                // Update in orders array
                setOrders(prevOrders =>
                    prevOrders.map(o => o.id === orderId ? updatedOrder : o)
                );

                // Update in prioritized orders if it exists there, or add/remove based on new status
                setPrioritizedOrders(prevPrioritized => {
                    const existingIndex = prevPrioritized.findIndex(o => o.id === orderId);

                    if (updatedOrder.isPrioritized) {
                        // If order should be prioritized, add or update it
                        if (existingIndex >= 0) {
                            // Update existing
                            return prevPrioritized.map(o => o.id === orderId ? updatedOrder : o);
                        } else {
                            // Add new
                            return [...prevPrioritized, updatedOrder];
                        }
                    } else {
                        // If order should not be prioritized, remove it
                        return prevPrioritized.filter(o => o.id !== orderId);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to refresh order data:', error);
        }
    };

    return (
        <OrdersContext.Provider value={{
            orders,
            prioritizedOrders,
            loading,
            error,
            pagination,
            currentPage,
            setCurrentPage,
            togglePriority,
            moveToNextStep,
            moveToPreviousStep,
            updateOrderStatus,
            refetch,
            deleteOrder,
            deleteOrderByUser,
            refreshOrderData,
        }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
}

export { steps };
