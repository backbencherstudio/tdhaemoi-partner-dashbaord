'use client'
import React from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import AppoinmentData from '@/components/AppoinmentData/AppoinmentData';
import { useForm } from "react-hook-form"
import { useAppoinment } from '@/hooks/appoinment/useAppoinment';
import AppointmentModal from '@/components/AppointmentModal/AppointmentModal';
import { useWeeklyCalendar } from '@/hooks/calendar/useWeeklyCalendar';
import MiniCalendar from '@/components/AppoinmentData/MiniCalendar';

interface Event {
    id: number;
    date: string;
    time: string;
    title: string;
    subtitle: string;
    type: string;
    assignedTo: string;
    reason: string;
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

interface AppointmentFormData {
    kunde: string;
    uhrzeit: string;
    selectedEventDate: Date | undefined;
    termin: string;
    bemerk: string;
    mitarbeiter: string;
    isClientEvent: boolean;
}



const WeeklyCalendar = () => {
    const [showAddForm, setShowAddForm] = React.useState(false);
    const {
        currentDate,
        miniCalendarDate,
        showYearMonthPicker,
        isMobile,
        isNavigating,
        setShowYearMonthPicker,
        navigateWeek,
        navigateMiniCalendarMonth,
        handleYearMonthChange,
        handleMiniCalendarDateClick,
        weekDates,
        miniCalendarDays,
        today,
        monthNames,
        dayNames,
        dayNamesLong,
        isSameDay,
        isPastDate,
    } = useWeeklyCalendar();
    const [deleteConfirmation, setDeleteConfirmation] = React.useState<{
        show: boolean;
        appointmentId: number | null;
    }>({
        show: false,
        appointmentId: null
    });
    const [showFullSubtitle, setShowFullSubtitle] = React.useState<number | null>(null);
    const [selectedAppointment, setSelectedAppointment] = React.useState<AppointmentData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [visibleDaysCount, setVisibleDaysCount] = React.useState(4);
    const [selectedRowStartDate, setSelectedRowStartDate] = React.useState<Date | null>(null);
    const [currentSelectedDate, setCurrentSelectedDate] = React.useState<Date>(today);

    // Use the custom hook
    const {
        events,
        isLoading,
        refreshKey,
        fetchAppointments,
        createNewAppointment,
        deleteAppointmentById,
        getAppointmentById,
        updateAppointmentById,
        getEventsForDate,
        formatDate
    } = useAppoinment();

    const form = useForm<AppointmentFormData>({
        defaultValues: {
            kunde: '',
            uhrzeit: '',
            selectedEventDate: undefined,
            termin: '',
            bemerk: '',
            mitarbeiter: '',
            isClientEvent: false
        }
    });

    const editForm = useForm<AppointmentFormData>({
        defaultValues: {
            kunde: '',
            uhrzeit: '',
            selectedEventDate: undefined,
            termin: '',
            bemerk: '',
            mitarbeiter: '',
            isClientEvent: false
        }
    });

    React.useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Generate dates based on selected month from mini calendar or selected row
    const getSelectedMonthDates = () => {
        // If a specific date is selected from mini calendar, generate dates AFTER that date within the same month
        if (selectedRowStartDate) {
            const dates = [];
            const selectedYear = selectedRowStartDate.getFullYear();
            const selectedMonth = selectedRowStartDate.getMonth();
            const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
            
            // Generate dates after the selected date until end of month
            for (let i = 1; i <= 30; i++) { // Start from 1, not 0 (skip the selected date)
                const date = new Date(selectedRowStartDate);
                date.setDate(selectedRowStartDate.getDate() + i);
                
                // Stop if we've reached the next month
                if (date.getMonth() !== selectedMonth) {
                    break;
                }
                
                dates.push(date);
            }
            return dates;
        }

        // In Month View: Generate all remaining days of the month for See More functionality
        const selectedYear = miniCalendarDate.getFullYear();
        const selectedMonth = miniCalendarDate.getMonth();

        // Check if selected month is current month
        const isCurrentMonth = selectedYear === today.getFullYear() && selectedMonth === today.getMonth();

        // If it's current month, start from tomorrow (next day after today), otherwise start from 1st of selected month
        const startDate = isCurrentMonth ?
            new Date(today.getTime() + 24 * 60 * 60 * 1000) : // Tomorrow
            new Date(selectedYear, selectedMonth, 1);

        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

        // Generate all dates from start date to end of month
        const dates = [];
        for (let date = new Date(startDate); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
        }

        return dates;
    };

    const selectedMonthDates = getSelectedMonthDates();
    const visibleDates = selectedMonthDates.slice(0, visibleDaysCount);
    const hasMoreDates = visibleDaysCount < selectedMonthDates.length;


    const handleSeeMore = () => {
        setVisibleDaysCount(prev => Math.min(prev + 4, selectedMonthDates.length));
    };

    // Reset visible days when month changes in mini calendar
    React.useEffect(() => {
        setVisibleDaysCount(4);
        setSelectedRowStartDate(null); // Reset selected row when month changes
        setCurrentSelectedDate(today); // Reset to today when month changes
    }, [miniCalendarDate.getMonth(), miniCalendarDate.getFullYear()]);

    // Override the handleMiniCalendarDateClick to set selected row
    const handleMiniCalendarDateClickOverride = (date: Date) => {
        // Show the next 4 dates starting from the clicked date
        setSelectedRowStartDate(date);
        setCurrentSelectedDate(date); // Update current selected date
        setVisibleDaysCount(4); // Show the next 4 dates from clicked date
        handleMiniCalendarDateClick(date); // Call original function
    };

    const handleDateClick = (date: Date) => {
        // Prevent adding appointments to past dates
        if (isPastDate(date)) {
            alert('You cannot add appointments to past dates.');
            return;
        }

        form.reset();
        form.setValue('selectedEventDate', date);
        setShowAddForm(true);
    };


    const onSubmit = async (data: { selectedEventDate: string | undefined; isClientEvent: boolean; kunde: string; uhrzeit: string; termin: string; bemerk: string; mitarbeiter: string }) => {
        const success = await createNewAppointment(data);
        if (success) {
            form.reset();
            setShowAddForm(false);
        }
    };


    const deleteAppointments = async (appointmentId: string) => {
        const success = await deleteAppointmentById(appointmentId);
        if (success) {
            setDeleteConfirmation({ show: false, appointmentId: null });
        }
    };


    const handleAppointmentClick = async (appointmentId: number) => {
        const apt = await getAppointmentById(appointmentId.toString());
        if (apt) {
            setSelectedAppointment(apt);

            // Format date and time for form
            const date = new Date(apt.date);
            const formattedTime = apt.time.split(' ')[0];

            editForm.reset({
                kunde: apt.customer_name,
                uhrzeit: formattedTime,
                selectedEventDate: date,
                termin: apt.reason,
                bemerk: apt.details,
                mitarbeiter: apt.assignedTo,
                isClientEvent: apt.isClient
            });

            setIsEditModalOpen(true);
        }
    };

    const onUpdateSubmit = async (data: { selectedEventDate: string | undefined; isClientEvent: boolean; kunde: string; uhrzeit: string; termin: string; bemerk: string; mitarbeiter: string }) => {
        if (!selectedAppointment?.id) return;

        const success = await updateAppointmentById(selectedAppointment.id.toString(), data);
        if (success) {
            setIsEditModalOpen(false);
        }
    };

    return (
        <div className=" bg-white">
            <div className='p-4 sm:p-6'>
                <AppoinmentData onRefresh={refreshKey} />
            </div>

            {/* Header */}
            <div className=" bg-white border-b border-gray-200 z-40">
                <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-xl sm:text-2xl font-bold">TERMINKALENDER</h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center cursor-pointer gap-2 px-3 sm:px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 text-sm"
                            >
                                <span className="hidden sm:inline">TERMIN HINZUFÜGEN</span>
                                <span className="sm:hidden">TERMIN</span>
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-6 mb-10">
                    {/* MiniCalendar */}
                    <div className="flex-1">
                <MiniCalendar
                    isMobile={isMobile}
                    miniCalendarDate={miniCalendarDate}
                    showYearMonthPicker={showYearMonthPicker}
                    setShowYearMonthPicker={setShowYearMonthPicker}
                    navigateMiniCalendarMonth={navigateMiniCalendarMonth}
                    handleYearMonthChange={handleYearMonthChange}
                    miniCalendarDays={miniCalendarDays}
                    visibleDates={visibleDates}
                    today={today}
                    monthNames={monthNames}
                    dayNames={dayNames}
                    isSameDay={isSameDay}
                    isPastDate={isPastDate}
                            handleMiniCalendarDateClick={handleMiniCalendarDateClickOverride}
                    getEventsForDate={getEventsForDate}
                    currentDate={currentDate}
                            selectedRowStartDate={selectedRowStartDate}
                        />
                    </div>

                    {/* Selected Date Display */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {selectedRowStartDate ? 'Selected Date' : 'Month View'}
                            </h3>
                            <div className="text-center">
                                {selectedRowStartDate ? (
                                    // Show selected date
                                    <>
                                        <div className="text-4xl font-light mb-2 text-purple-600">
                                            {currentSelectedDate.getDate()}
                                        </div>
                                        <div className="text-sm mb-1 text-purple-600">
                                            {dayNamesLong[currentSelectedDate.getDay()]}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-4">
                                            {monthNames[currentSelectedDate.getMonth()]} {currentSelectedDate.getFullYear()}
                                        </div>
                                        
                                        {/* Show appointments for selected date */}
                                        {(() => {
                                            const selectedDateEvents = getEventsForDate(currentSelectedDate);
                                            return selectedDateEvents.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-700 mb-3">
                                                        Selected date has {selectedDateEvents.length} appointment{selectedDateEvents.length !== 1 ? 's' : ''}
                                                    </div>
                                                    
                                                    {/* Show appointment details */}
                                                    <div className="space-y-3">
                                                        {selectedDateEvents.map((event: Event, index: number) => (
                                                            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                                <div className="text-sm font-medium text-gray-800 mb-2">
                                                                    {event.title}
                                                                </div>
                                                                {event.time && (
                                                                    <div className="text-xs text-gray-600 mb-1">
                                                                        Time: {event.time}
                                                                    </div>
                                                                )}
                                                                {event.assignedTo && (
                                                                    <div className="text-xs text-gray-600 mb-1">
                                                                        Mitarbeiter: {event.assignedTo}
                                                                    </div>
                                                                )}
                                                                {event.reason && (
                                                                    <div className="text-xs text-gray-600">
                                                                        Grund: {event.reason}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-center mt-3">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full border border-white mr-2"></div>
                                                        <span className="text-xs text-gray-600">Has appointments</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        

                                        {/* Status indicator */}
                                        {/* <div className="mt-4 pt-4 border-t">
                                            <div className="text-xs px-3 py-1 rounded-full inline-block bg-purple-100 text-purple-800">
                                                Selected Date
                                            </div>
                                        </div> */}
                                    </>
                                ) : (
                                    // Show month view info with today as default selected date
                                    <>
                                        <div className="text-4xl font-light mb-2 text-[#62A07C]">
                                            {today.getDate()}
                                        </div>
                                        <div className="text-sm mb-1 text-[#62A07C]">
                                            {dayNamesLong[today.getDay()]}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-4">
                                            {monthNames[today.getMonth()]} {today.getFullYear()}
                                        </div>
                                        
                                        {/* Show appointments for today */}
                                        {(() => {
                                            const todayEvents = getEventsForDate(today);
                                            return todayEvents.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="text-sm text-gray-700 mb-3">
                                                        Today has {todayEvents.length} appointment{todayEvents.length !== 1 ? 's' : ''}
                                                    </div>
                                                    
                                                    {/* Show appointment details */}
                                                    <div className="space-y-3">
                                                        {todayEvents.map((event: Event, index: number) => (
                                                            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                                <div className="text-sm font-medium text-gray-800 mb-2">
                                                                    {event.title}
                                                                </div>
                                                                {event.time && (
                                                                    <div className="text-xs text-gray-600 mb-1">
                                                                        Time: {event.time}
                                                                    </div>
                                                                )}
                                                                {event.assignedTo && (
                                                                    <div className="text-xs text-gray-600 mb-1">
                                                                        Mitarbeiter: {event.assignedTo}
                                                                    </div>
                                                                )}
                                                                {event.reason && (
                                                                    <div className="text-xs text-gray-600">
                                                                        Grund: {event.reason}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-center mt-3">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full border border-white mr-2"></div>
                                                        <span className="text-xs text-gray-600">Has appointments</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        

                                        {/* Status indicator */}
                                        <div className="mt-4 pt-4 border-t">
                                            <div className="text-xs px-3 py-1 rounded-full inline-block bg-gray-100 text-gray-600">
                                                Month View
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>




                <div className={`${isMobile ? 'block' : 'flex gap-8'}`}>
                    {/* Monthly Calendar */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                            {visibleDates.map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                const isToday = isSameDay(date, today);
                                const dayColor = date.getDay() === 0 || date.getDay() === 6 ? 'text-red-500' : 'text-gray-600';

                                return (
                                    <div key={index} className="border-b border-gray-200 pb-6">
                                        {/* Date Header */}
                                        <div className={`flex items-center justify-between mb-4 p-3 rounded ${isPastDate(date) ? 'bg-gray-100 border border-gray-200' : 'bg-gray-50'
                                            }`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`text-3xl sm:text-4xl font-light ${dayColor} ${isPastDate(date) ? 'opacity-60' : ''
                                                    }`}>
                                                    {date.getDate()}
                                                </div>
                                                <div>
                                                    <div className={`text-sm ${dayColor} ${isPastDate(date) ? 'opacity-60' : ''
                                                        }`}>
                                                        {dayNamesLong[date.getDay()]}
                                                    </div>
                                                    <div className={`text-xs ${isPastDate(date) ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        {monthNames[date.getMonth()]} {date.getFullYear()}
                                                    </div>
                                                </div>
                                            </div>
                                            {isToday && (
                                                <div className="w-4 h-4 bg-[#62A07C] rounded-full"></div>
                                            )}
                                            {isPastDate(date) && (
                                                <div className="text-xs text-gray-400 italic">Past</div>
                                            )}
                                        </div>

                                        {/* Events List */}
                                        <div className="space-y-3">
                                            {isLoading ? (
                                                <div className="flex justify-center items-center py-4">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62A07C]"></div>
                                                </div>
                                            ) : (
                                                <>
                                                    {dayEvents.map((event: Event) => (
                                                        <div
                                                            key={event.id}
                                                            className="relative group"
                                                            onClick={() => handleAppointmentClick(event.id)}
                                                        >
                                                            <div className={`p-3 rounded-lg text-sm font-medium border-l-4 cursor-pointer ${event.type === 'user'
                                                                ? 'bg-gray-900 text-white border-gray-700'
                                                                : 'bg-[#62A07C] text-white border-green-700'
                                                                }`}>
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        {event.time && (
                                                                            <div className="text-xs opacity-90 mb-1">{event.time}</div>
                                                                        )}
                                                                        <h1 className="font-semibold">{event.title}</h1>
                                                                        {
                                                                            event.assignedTo && (
                                                                                <div className="text-xs opacity-90 mb-1">Mitarbeiter: {event.assignedTo}</div>
                                                                            )
                                                                        }
                                                                        {
                                                                            event.reason && (
                                                                                <div className="text-xs opacity-90 mb-1">Grund: {event.reason}</div>
                                                                            )
                                                                        }

                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setDeleteConfirmation({
                                                                                show: true,
                                                                                appointmentId: event.id
                                                                            });
                                                                        }}
                                                                        className="opacity-0 cursor-pointer group-hover:opacity-100 text-white bg-red-500 rounded-full p-1 ml-2"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDateClick(date);
                                                }}
                                                disabled={isPastDate(date)}
                                                className={`w-full cursor-pointer p-3 border-2 border-dashed rounded-lg text-sm transition-colors ${isPastDate(date)
                                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                                                    : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                title={isPastDate(date) ? 'Cannot add appointments to past dates' : 'Add new appointment'}
                                            >
                                                {isPastDate(date) ? 'Past Date' : '+ Termin hinzufügen'}
                                            </button>
                                            {dayEvents.length === 0 && (
                                                <div className="space-y-2 py-4">
                                                    {[...Array(6)].map((_, i) => (
                                                        <div key={i} className="h-px bg-gray-200"></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* See More Button - Always show when there are more days */}
                            {hasMoreDates && (
                                <div className="col-span-full flex justify-center mt-6">
                                    <button
                                        onClick={handleSeeMore}
                                        className="px-6 py-3 bg-[#62A07C] text-white rounded-lg hover:bg-[#4f8a65] transition-colors cursor-pointer"
                                    >
                                        See More ({selectedMonthDates.length - visibleDaysCount} more days)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showAddForm && (
                <AppointmentModal
                    isOpen
                    onClose={() => {
                        setShowAddForm(false);
                        form.reset();
                    }}
                    form={form}
                    onSubmit={onSubmit}
                    title="Neuer Termin"
                    buttonText="Termin bestätigen"
                />
            )}

            {/* Edit Event Modal */}
            {isEditModalOpen && (
                <AppointmentModal
                    isOpen
                    onClose={() => setIsEditModalOpen(false)}
                    form={editForm}
                    onSubmit={onUpdateSubmit}
                    title="Termin bearbeiten"
                    buttonText="Aktualisieren"
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.show && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Bestätigen Sie das Löschen</h3>
                        <p className="text-gray-600 mb-6">Sind Sie sicher, dass Sie diesen Termin löschen möchten?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteConfirmation({ show: false, appointmentId: null })}
                                className="px-4 py-2 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={async () => {
                                    if (!deleteConfirmation.appointmentId || isDeleting) return;
                                    try {
                                        setIsDeleting(true);
                                        await deleteAppointments(deleteConfirmation.appointmentId.toString());
                                    } finally {
                                        setIsDeleting(false);
                                    }
                                }}
                                disabled={isDeleting}
                                className={`px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isDeleting && <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />}
                                {isDeleting ? 'Bitte warten...' : 'Löschen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyCalendar;