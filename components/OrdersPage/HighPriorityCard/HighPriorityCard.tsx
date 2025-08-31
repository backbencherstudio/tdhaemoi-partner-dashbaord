'use client'

import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import legImg1 from '@/public/images/order/1.png'
import legImg2 from '@/public/images/order/2.png'
import { useOrders, steps } from '@/contexts/OrdersContext';
import toast from 'react-hot-toast';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

export default function HighPriorityCard() {
    const { prioritizedOrders, moveToNextStep, moveToPreviousStep, refreshOrderData } = useOrders();
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        orderId: string;
        orderName: string;
        currentStatus: string;
        newStatus: string;
    } | null>(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        slidesToScroll: 1,
        align: 'start',
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 4 }
        }
    })

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])


    // Get status color based on current step
    const getStatusColor = (currentStep: number) => {
        const colors = [
            'bg-[#FF0000]',
            'bg-[#FFA617]',
            'bg-[#96F30080]',
            'bg-[#4CAF50]',
            'bg-[#2196F3]',
            'bg-[#9C27B0]',
        ];
        return colors[currentStep] || 'bg-gray-500';
    };


    const handleNextStep = (orderId: string) => {
        const order = prioritizedOrders.find(o => o.id === orderId);
        if (!order) return;

        const nextStep = order.currentStep + 1;
        if (nextStep >= steps.length) return;

        const nextGermanStatus = steps[nextStep];

        setPendingAction({
            orderId: orderId,
            orderName: order.kundenname,
            currentStatus: order.displayStatus,
            newStatus: nextGermanStatus
        });
        setShowConfirmModal(true);
    };

    const handlePreviousStep = (orderId: string) => {
        const order = prioritizedOrders.find(o => o.id === orderId);
        if (!order) return;

        const previousStep = order.currentStep - 1;
        if (previousStep < 0) return;

        const previousGermanStatus = steps[previousStep];

        setPendingAction({
            orderId: orderId,
            orderName: order.kundenname,
            currentStatus: order.displayStatus,
            newStatus: previousGermanStatus
        });
        setShowConfirmModal(true);
    };

    // Execute step change after confirmation
    const executeStepChange = async () => {
        if (!pendingAction) return;

        try {
            const order = prioritizedOrders.find(o => o.id === pendingAction.orderId);
            if (!order) return;

            // Determine if it's a next or previous step
            const isNextStep = steps.indexOf(pendingAction.newStatus) > steps.indexOf(pendingAction.currentStatus);
            
            if (isNextStep) {
                await moveToNextStep(pendingAction.orderId);
            } else {
                await moveToPreviousStep(pendingAction.orderId);
            }

            setSelectedOrderId(pendingAction.orderId);

            toast.success(`Status erfolgreich geändert: ${pendingAction.currentStatus} → ${pendingAction.newStatus}`);

            // Refresh the order data to get the latest status
            setTimeout(() => {
                refreshOrderData(pendingAction.orderId);
            }, 500);
        } catch (error) {
            console.error('Failed to change step:', error);
            toast.error('Fehler beim Ändern des Status');
        } finally {
            setShowConfirmModal(false);
            setPendingAction(null);
        }
    };

    const handleCardClick = (orderId: string) => {
        setSelectedOrderId(orderId);
    };

    const getActiveStep = () => {
        if (!selectedOrderId) return -1;

        const selectedOrder = prioritizedOrders.find(order => order.id === selectedOrderId);
        return selectedOrder ? selectedOrder.currentStep : -1;
    };

    const activeStep = getActiveStep();

    // Don't render if no prioritized orders
    if (prioritizedOrders.length === 0) {
        return null;
    }

    return (
        <div className='flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-10'>
            <h1 className='text-xl sm:text-2xl font-bold'>Einlagen mit hoher Priorität</h1>
            <div className='relative px-2 sm:px-4'>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex lg:justify-center">
                        {prioritizedOrders.map((card, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2">
                                <div
                                    className={"border-2 p-2 sm:p-3 flex flex-col gap-2 cursor-pointer transition-all duration-200"}
                                    onClick={() => handleCardClick(card.id)}
                                >
                                    <div className='flex justify-center items-center'>
                                        <Image
                                            width={200}
                                            height={200}
                                            src={legImg2}
                                            alt='legs'
                                            className='w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48'
                                        />
                                    </div>
                                    <h2 className='text-lg sm:text-xl font-semibold'>{card.productName}</h2>
                                    <p className="text-sm sm:text-base">{card.kundenname}</p>
                                    <p className="text-xs sm:text-sm"><span className='font-bold'>Bestellnr:</span> {card.bestellnummer}</p>
                                    <p className="text-xs sm:text-sm"><span className='font-bold'>Liefertermin:</span> {card.deliveryDate}</p>

                                    <div className="flex gap-2 mt-2">
                                        {/* Back Button - Only show if not in first step */}
                                        {card.currentStep > 0 && (
                                            <button
                                                className="border cursor-pointer px-2 py-1 sm:py-2 rounded-md text-xs flex items-center gap-1 sm:gap-2 justify-center hover:bg-gray-100 transform duration-300 bg-gray-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePreviousStep(card.id);
                                                }}
                                                title="Zum vorherigen Schritt wechseln"
                                            >
                                                <svg className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                <span className="hidden sm:inline">Zurück</span>
                                                <span className="sm:hidden">Zurück</span>
                                            </button>
                                        )}
                                        
                                        {/* Next Step Button */}
                                        <button
                                            className={`border cursor-pointer px-2 py-1 sm:py-2 rounded-md text-xs flex items-center gap-1 sm:gap-2 justify-center hover:bg-gray-100 transform duration-300 flex-1 ${card.currentStep >= steps.length - 1 ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNextStep(card.id);
                                            }}
                                            disabled={card.currentStep >= steps.length - 1}
                                            title={card.currentStep >= steps.length - 1 ? "Bereits im letzten Schritt" : "Zum nächsten Schritt wechseln"}
                                        >
                                           
                                            <span className="hidden sm:inline">{card.currentStep >= steps.length - 1 ? "Abgeschlossen" : "Nächster Schritt"}</span>
                                            <span className="sm:hidden">{card.currentStep >= steps.length - 1 ? "Fertig" : "Nächster"}</span>
                                            <GoArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                    <button className={`${getStatusColor(card.currentStep)} px-2 py-1 sm:py-2 rounded-md text-xs flex items-center gap-1 sm:gap-2 justify-center font-medium`}>
                                        {card.displayStatus}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Navigation Arrows */}
                {prioritizedOrders.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            className="absolute cursor-pointer left-1 sm:left-2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-1 sm:p-2 transition-all duration-300 rounded-full shadow-lg hover:bg-gray-100 z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute cursor-pointer right-1 sm:right-2 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white transition-all duration-300 p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                open={showConfirmModal}
                onOpenChange={setShowConfirmModal}
                title="Status ändern bestätigen"
                description="Sind Sie sicher, dass Sie den Status für den Auftrag"
                orderName={pendingAction?.orderName}
                currentStatus={pendingAction?.currentStatus || ''}
                newStatus={pendingAction?.newStatus || ''}
                onConfirm={executeStepChange}
            />
        </div>
    )
}
