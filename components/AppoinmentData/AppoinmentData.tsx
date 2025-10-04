'use client'
import React, { useState, useEffect } from 'react'
import { getMyAppointments } from '@/apis/appoinmentApis';

// Remove eventData array and add interfaces
interface Appointment {
    id: number;
    date: string;
    time: string;
    customer_name: string;
    details: string;
    isClient: boolean;
    assignedTo?: string;
    reason?: string;
}

interface AppoinmentDataProps {
    onRefresh?: number;
}

export default function AppoinmentData({ onRefresh }: AppoinmentDataProps) {
    const [events, setEvents] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
                limit: 10
            });

            if (response?.data) {
                const now = new Date();
                const today = now.toISOString().split('T')[0];
                const currentTime = now.toTimeString().slice(0, 5); 

                const formattedEvents = response.data.map((apt: Appointment) => ({
                    id: apt.id,
                    date: new Date(apt.date).toISOString().split('T')[0],
                    time: apt.time,
                    customer_name: apt.customer_name.toUpperCase(),
                    details: apt.details?.toUpperCase(),
                    isClient: apt.isClient
                }));

                // Filter to get only upcoming events
                const upcomingEvents = formattedEvents.filter((event: Appointment) => {
                    const eventDate = event.date;
                    if (eventDate > today) {
                        return true; 
                    } else if (eventDate === today && event.time) {
                        return event.time > currentTime; 
                    }
                    return false; 
                });

                // Sort by date and time
                const sortedUpcoming = upcomingEvents.sort((a: Appointment, b: Appointment) => {
                    if (a.date !== b.date) {
                        return a.date.localeCompare(b.date);
                    }
                    return (a.time || '').localeCompare(b.time || '');
                });

                // Group appointments by date
                const appointmentsByDate: { [key: string]: Appointment[] } = {};
                sortedUpcoming.forEach((appointment: Appointment) => {
                    if (!appointmentsByDate[appointment.date]) {
                        appointmentsByDate[appointment.date] = [];
                    }
                    appointmentsByDate[appointment.date].push(appointment);
                });

                // Find the date with most appointments, or earliest date if tied
                let selectedDate = '';
                let maxAppointments = 0;
                
                for (const [date, appointments] of Object.entries(appointmentsByDate)) {
                    if (appointments.length > maxAppointments) {
                        maxAppointments = appointments.length;
                        selectedDate = date;
                    } else if (appointments.length === maxAppointments && appointments.length > 0) {
                        // If same number of appointments, choose the earliest date
                        if (!selectedDate || date < selectedDate) {
                            selectedDate = date;
                        }
                    }
                }

                // If we found a date with multiple appointments, show up to 2 from that date
                if (selectedDate && appointmentsByDate[selectedDate].length >= 2) {
                    setEvents(appointmentsByDate[selectedDate].slice(0, 2));
                } else {
                    // Otherwise, show the first 2 upcoming appointments
                    setEvents(sortedUpcoming.slice(0, 2));
                }
            }
        } catch (error) {
            console.error('Failed to load appointments:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const formatDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate();
    };

    return (
        <div className="space-y-4">
            <h1 className='text-2xl font-bold'>Nächsten Ereignisse</h1>

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
            ) : events.length > 0 ? (
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <div key={`${event.id}-${index}`} className="flex items-center gap-4">
                            <div className={`w-24 h-24 rounded-lg flex items-center justify-center text-white text-2xl font-bold ${event.isClient ? 'bg-black' : 'bg-[#62A07C]'}`}>
                                {/* {formatDay(event.date)} */}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="font-bold">{event.customer_name}</div>
                                <p className='text-sm text-gray-500'>{event.details}</p>
                                {event.assignedTo && (
                                    <p className='text-sm text-gray-600'>
                                        <span className="font-medium">Mitarbeiter:</span> {event.assignedTo}
                                    </p>
                                )}
                                {event.reason && (
                                    <p className='text-sm text-gray-600'>
                                        <span className="font-medium">Grund:</span> {event.reason}
                                    </p>
                                )}
                                {event.time && <div>
                                    <p className='text-sm font-semibold text-gray-500 uppercase'>
                                        {event.date.split('-')[2]}/{event.date.split('-')[1]}/{event.date.split('-')[0].slice(2)}, {event.time}
                                    </p>
                                </div>}

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>Keine bevorstehenden Termine</p>
                </div>
            )}
        </div>
    )
}
