'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderData {
    id: string;
    bestellnummer: string;
    kundenname: string;
    status: string;
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
    togglePriority: (orderId: string) => void;
    moveToNextStep: (orderId: string) => void;
    updateOrderStatus: (orderId: string, newStatus: string, newStep: number) => void;
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

const initialOrders: OrderData[] = [
    {
        id: "1",
        bestellnummer: "10014",
        kundenname: "Max Mustermann",
        status: "Einlage vorbereiten",
        preis: "170,00 €",
        zahlung: "Offen / Bezahlt / Krankenkasse (anklickbar zur Änderung)",
        beschreibung: "Freitextfeld, z.B. Versorgung mit Alltagseinlage / Sporteinlage / Businesseinlage",
        abholort: "Abholung Innsbruck oder Wird mit Post versandt",
        fertigstellung: "23.05.2025",
        productName: "Alltagseinlage",
        deliveryDate: "22.02.2026",
        isPrioritized: true,
        currentStep: 0,
    },
    {
        id: "2",
        bestellnummer: "1002",
        kundenname: "Erika Musterfrau",
        status: "Einlage in Fertigung",
        preis: "120,00€",
        zahlung: "Bezahlt",
        beschreibung: "Sporteinlage",
        abholort: "Wird mit Post versandt",
        fertigstellung: "25.05.2024",
        productName: "Sporteinlage",
        deliveryDate: "22.02.2026",
        isPrioritized: true,
        currentStep: 1,
    },
    {
        id: "3",
        bestellnummer: "1003",
        kundenname: "Hans Beispiel",
        status: "Einlage verpacken",
        preis: "150,00€",
        zahlung: "Bezahlt",
        beschreibung: "Business-Einlage",
        abholort: "Abholung Innenbereich",
        fertigstellung: "28.05.2024",
        productName: "Businesseinlage",
        deliveryDate: "10.02.2025",
        isPrioritized: true,
        currentStep: 2,
    }
];

export function OrdersProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<OrderData[]>(initialOrders);

    const prioritizedOrders = orders.filter(order => order.isPrioritized);

    const togglePriority = (orderId: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId
                    ? { 
                        ...order, 
                        isPrioritized: !order.isPrioritized,
                        currentStep: !order.isPrioritized ? 0 : order.currentStep,
                        status: !order.isPrioritized ? steps[0] : order.status
                    }
                    : order
            )
        );
    };

    const moveToNextStep = (orderId: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.id === orderId && order.currentStep < steps.length - 1) {
                    const nextStep = order.currentStep + 1;
                    return {
                        ...order,
                        currentStep: nextStep,
                        status: steps[nextStep]
                    };
                }
                return order;
            })
        );
    };

    const updateOrderStatus = (orderId: string, newStatus: string, newStep: number) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId
                    ? { ...order, status: newStatus, currentStep: newStep }
                    : order
            )
        );
    };

    return (
        <OrdersContext.Provider value={{
            orders,
            prioritizedOrders,
            togglePriority,
            moveToNextStep,
            updateOrderStatus,
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