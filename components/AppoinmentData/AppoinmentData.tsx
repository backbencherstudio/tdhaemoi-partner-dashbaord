'use client'
import React, { useState, useEffect } from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import { getMyAppointments } from '@/apis/appoinmentApis';

// Remove eventData array and add interfaces
interface Appointment {
    id: number;
    date: string;
    time: string;
    customer_name: string;
    details: string;
    isClient: boolean;
}

interface AppoinmentDataProps {
    onRefresh?: number;
}

export default function AppoinmentData({ onRefresh }: AppoinmentDataProps) {
    const [events, setEvents] = useState<Appointment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 2;

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Add this effect to listen for parent refreshes
    useEffect(() => {
        if (onRefresh) {
            fetchAppointments();
        }
    }, [onRefresh]);

    const fetchAppointments = async () => {
        try {
            setIsLoading(true);
            const response = await getMyAppointments({
                page: 1,
                limit: 100
            });
            
            if (response?.data) {
                const formattedEvents = response.data.map((apt: any) => ({
                    id: apt.id,
                    date: new Date(apt.date).toISOString().split('T')[0],
                    time: apt.time,
                    customer_name: apt.customer_name.toUpperCase(),
                    details: apt.details?.toUpperCase(),
                    isClient: apt.isClient
                }));
                setEvents(formattedEvents);
            }
        } catch (error) {
            console.error('Failed to load appointments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(events.length / itemsPerPage);
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const formatDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate();
    };

    return (
        <div className="space-y-4">
            <h1 className='text-2xl font-bold'>Wichtige Ereignisse</h1>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-black rounded"></div>
                    <span>Kundentermine</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#62A07C] rounded"></div>
                    <span>Anderes</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62A07C]"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {currentEvents.map((event, index) => (
                        <div key={`${event.id}-${index}`} className="flex items-center gap-4">
                            <div className={`w-24 h-24 rounded-lg flex items-center justify-center text-white text-2xl font-bold ${event.isClient ? 'bg-black' : 'bg-[#62A07C]'}`}>
                                {formatDay(event.date)}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold">{event.customer_name}</div>
                                {event.time && <div>
                                    <p className='text-sm font-semibold mt-2 text-gray-500 uppercase'>
                                        {event.date.split('-')[2]}/{event.date.split('-')[1]}/{event.date.split('-')[0].slice(2)}, {event.time}
                                    </p>
                                </div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                            </PaginationItem>
                        )}

                        {Array.from({ length: totalPages }).map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => paginate(index + 1)}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext onClick={() => paginate(currentPage + 1)} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}
