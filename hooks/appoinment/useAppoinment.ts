import { useState, useCallback } from 'react';
import { createAppoinment, deleteAppointment, getMyAppointments, getSingleAppointment, updateAppointment } from '@/apis/appoinmentApis';
import toast from 'react-hot-toast';

interface Event {
    id: number;
    date: string;
    time: string;
    title: string;
    subtitle: string;
    type: string;
}

interface AppointmentData {
    id: string;
    customer_name: string;
    time: string;
    date: string;
    reason: string;
    assignedTo: string;
    details: string;
    isClient: boolean;
}



interface SubmittedAppointmentData {
    kunde: string;
    uhrzeit: string;
    selectedEventDate: string | undefined;
    termin: string;
    bemerk: string;
    mitarbeiter: string;
    isClientEvent: boolean;
    customerId?: string;
}

export const useAppoinment = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    
    // Debug logging when events state changes
    console.log('useAppoinment hook - events state changed:', events.length, 'events');

    // Fetch all appointments
    const fetchAppointments = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getMyAppointments({
                page: 1,
                limit: 100
            });
            const appointments = response?.data || [];

            if (appointments.length > 0) {
                const formattedEvents = appointments.map((apt: AppointmentData) => ({
                    id: apt.id,
                    date: new Date(apt.date).toISOString().split('T')[0],
                    time: apt.time,
                    title: apt.customer_name.toUpperCase(),
                    subtitle: apt.details?.toUpperCase(),
                    type: apt.isClient ? 'user' : 'others'
                }));
                setEvents(formattedEvents);
                console.log('Events state updated with', formattedEvents.length, 'events');
            }
        } catch (error) {
            toast.error('Failed to load appointments');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create new appointment
    const createNewAppointment = useCallback(async (data: SubmittedAppointmentData) => {
        const loadingToastId = toast.loading('Creating appointment...');
        try {
            if (!data.kunde || !data.uhrzeit || !data.selectedEventDate || !data.termin) {
                toast.dismiss(loadingToastId);
                toast.error('Please fill in all required fields');
                return false;
            }

            // Format time for display
            const timeDate = new Date(`2000-01-01T${data.uhrzeit}`);
            const formattedTime = timeDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).toLowerCase();

            // Create correct datetime - data.selectedEventDate is already ISO string
            const dateTime = createDateTimeWithOffset(formatDate(new Date(data.selectedEventDate || new Date())), data.uhrzeit);

            const appointmentData: any = {
                customer_name: data.kunde,
                time: formattedTime,
                date: dateTime.toISOString(),
                reason: data.termin,
                assignedTo: data.mitarbeiter || '',
                details: data.bemerk || '',
                isClient: Boolean(data.isClientEvent)
            };

            if (data.customerId) {
                appointmentData.customerId = data.customerId;
            }

            const response = await createAppoinment(appointmentData);

            if (response.success) {
                await fetchAppointments();
                setRefreshKey(prev => prev + 1);
                toast.dismiss(loadingToastId);
                toast.success('Appointment created successfully', {
                    duration: 3000,
                });
                return true;
            } else {
                toast.dismiss(loadingToastId);
                toast.error(response.message || 'Failed to create appointment');
                return false;
            }
        } catch (error: unknown) {
            toast.dismiss(loadingToastId);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';
            toast.error(errorMessage);
            return false;
        }
    }, [fetchAppointments]);

    // Delete appointment
    const deleteAppointmentById = useCallback(async (appointmentId: string) => {
        try {
            const response = await deleteAppointment(appointmentId);
            await fetchAppointments();
            setRefreshKey(prev => prev + 1);
            toast.success(response.message || 'Appointment deleted successfully');
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete appointment';
            toast.error(errorMessage);
            return false;
        }
    }, [fetchAppointments]);

    // Get single appointment
    const getAppointmentById = useCallback(async (appointmentId: string) => {
        try {
            const response = await getSingleAppointment(appointmentId);
            if (response?.success) {
                return response.appointment;
            }
            return null;
        } catch (error) {
            toast.error('Failed to load appointment details');
            return null;
        }
    }, []);

    // Update appointment
    const updateAppointmentById = useCallback(async (appointmentId: string, data: SubmittedAppointmentData) => {
        try {
            // Format time for display
            const timeDate = new Date(`2000-01-01T${data.uhrzeit}`);
            const formattedTime = timeDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).toLowerCase();

            // Create correct datetime - data.selectedEventDate is already ISO string
            const dateTime = createDateTimeWithOffset(formatDate(new Date(data.selectedEventDate || new Date())), data.uhrzeit);

            const appointmentData: any = {
                customer_name: data.kunde,
                time: formattedTime,
                date: dateTime.toISOString(),
                reason: data.termin,
                assignedTo: data.mitarbeiter || '',
                details: data.bemerk || '',
                isClient: data.isClientEvent
            };

            if (data.customerId) {
                appointmentData.customerId = data.customerId;
            }

            const response = await updateAppointment(appointmentId, appointmentData);

            if (response.success) {
                await fetchAppointments();
                setRefreshKey(prev => prev + 1);
                toast.success('Appointment updated successfully');
                return true;
            }
            return false;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update appointment';
            toast.error(errorMessage);
            return false;
        }
    }, [fetchAppointments]);

    // Helper function to create datetime with offset
    const createDateTimeWithOffset = (dateStr: string, timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const selectedDate = new Date(dateStr);
        const dateTime = new Date();
        dateTime.setFullYear(selectedDate.getFullYear());
        dateTime.setMonth(selectedDate.getMonth());
        dateTime.setDate(selectedDate.getDate());
        dateTime.setHours(parseInt(hours) + 2);
        dateTime.setMinutes(parseInt(minutes));
        dateTime.setSeconds(0);
        dateTime.setMilliseconds(0);

        return dateTime;
    };

    // Helper function to format date
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get events for a specific date
    const getEventsForDate = useCallback((date: Date) => {
        const dateStr = formatDate(date);
        return events.filter((event: Event) => {
            const eventDate = new Date(event.date);
            const eventDateStr = formatDate(eventDate);
            return eventDateStr === dateStr;
        });
    }, [events]);

    return {
        // State
        events,
        isLoading,
        refreshKey,
        
        // Functions
        fetchAppointments,
        createNewAppointment,
        deleteAppointmentById,
        getAppointmentById,
        updateAppointmentById,
        getEventsForDate,
        
        // Helper functions
        formatDate,
        createDateTimeWithOffset
    };
};
