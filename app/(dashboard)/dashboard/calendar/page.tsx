'use client'
import React from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import AppoinmentData from '@/components/AppoinmentData/AppoinmentData';
import { useForm } from "react-hook-form"
import { useAppoinment } from '@/hooks/appoinment/useAppoinment';
import AppointmentModal from '@/components/AppointmentModal/AppointmentModal';
import { useWeeklyCalendar } from '@/hooks/calendar/useWeeklyCalendar';

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

interface AppointmentFormData {
    kunde: string;
    uhrzeit: string;
    selectedEventDate: Date | undefined;
    termin: string;
    bemerk: string;
    mitarbeiter: string;
    isClientEvent: boolean;
}

const truncateWords = (text: string, limit: number) => {
    const words = text.split(' ');
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '....';
};

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

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

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
                <div className={`${isMobile ? 'block' : 'flex gap-8'}`}>

                    {/* Weekly Calendar */}
                    <div className="flex-1">
                        <div className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className='flex flex-col xl:flex-row xl:items-start items-center gap-4 justify-between'>
                                {/* Week Navigation */}
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => navigateWeek(-1)}
                                        disabled={isNavigating}
                                        className={`p-2 block lg:hidden rounded transition-colors ${isNavigating
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        title="Previous Week"
                                    >
                                        {isNavigating ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                                        ) : (
                                            <ChevronLeft className="w-5 h-5" />
                                        )}
                                    </button>
                                    <h2 className="text-base sm:text-lg font-semibold text-center mx-4">
                                        {isNavigating ? 'Loading...' : `Week of ${monthNames[weekDates[0].getMonth()].slice(0, 3)}. ${weekDates[0].getDate()}, ${weekDates[0].getFullYear()}`}
                                    </h2>
                                    <button
                                        onClick={() => navigateWeek(1)}
                                        disabled={isNavigating}
                                        className={`p-2 block lg:hidden rounded transition-colors ${isNavigating
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        title="Next Week"
                                    >
                                        {isNavigating ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                                        ) : (
                                            <ChevronRight className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>


                                {/* Mini Calendar - Hidden on mobile */}
                                {!isMobile && (
                                    <div className="2xl:w-96 flex-shrink-0 relative">
                                        <div className="text-center mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <button
                                                    onClick={() => navigateMiniCalendarMonth(-1)}
                                                    className="p-1 cursor-pointer hover:bg-gray-100 rounded"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => setShowYearMonthPicker(!showYearMonthPicker)}
                                                    className="font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                                >
                                                    {monthNames[miniCalendarDate.getMonth()]} {miniCalendarDate.getFullYear()}
                                                </button>

                                                <button
                                                    onClick={() => navigateMiniCalendarMonth(1)}
                                                    className="p-1 cursor-pointer hover:bg-gray-100 rounded"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Year/Month Picker */}
                                        {showYearMonthPicker && (
                                            <div className="absolute top-16 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                                    <select
                                                        value={miniCalendarDate.getFullYear()}
                                                        onChange={(e) => handleYearMonthChange(parseInt(e.target.value), miniCalendarDate.getMonth())}
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    >
                                                        {years.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                                                    <select
                                                        value={miniCalendarDate.getMonth()}
                                                        onChange={(e) => handleYearMonthChange(miniCalendarDate.getFullYear(), parseInt(e.target.value))}
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    >
                                                        {monthNames.map((month, index) => (
                                                            <option key={index} value={index}>{month}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => setShowYearMonthPicker(false)}
                                                    className="w-full py-1 border rounded text-sm cursor-pointer hover:bg-gray-100 transform duration-300"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                            {dayNames.map(day => (
                                                <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
                                            ))}
                                            {miniCalendarDays.map((date, index) => {
                                                const isCurrentMonth = date.getMonth() === miniCalendarDate.getMonth();
                                                const isToday = isSameDay(date, today);
                                                const isSelected = weekDates.some(weekDate => isSameDay(weekDate, date));
                                                const isCurrentWeek = weekDates.some(weekDate =>
                                                    Math.abs(date.getTime() - weekDate.getTime()) < 7 * 24 * 60 * 60 * 1000
                                                );
                                                const isPast = isPastDate(date);

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-2 cursor-pointer hover:bg-gray-200 rounded transition-colors ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                                                            } ${isToday ? 'bg-[#62A07C] text-white font-bold' : ''
                                                            } ${isSelected && !isToday ? 'bg-blue-100 border-2 border-blue-300' : ''
                                                            } ${isCurrentWeek && !isSelected && !isToday ? 'bg-blue-50 border border-blue-200' : ''
                                                            } ${isPast && !isToday && !isSelected ? 'opacity-50 text-gray-500' : ''
                                                            }`}
                                                        onClick={() => handleMiniCalendarDateClick(date)}
                                                        title={`${date.toDateString()} - Click to navigate to this week`}
                                                    >
                                                        {date.getDate()}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Mini Calendar */}
                                {/* {isMobile && (
                                    <div className="w-full mt-4">
                                        <div className="text-center mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <button
                                                    onClick={() => navigateMiniCalendarMonth(-1)}
                                                    className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>

                                                <button
                                                    onClick={() => setShowYearMonthPicker(!showYearMonthPicker)}
                                                    className="font-semibold cursor-pointer hover:bg-gray-100 px-3 py-2 rounded"
                                                >
                                                    {monthNames[miniCalendarDate.getMonth()]} {miniCalendarDate.getFullYear()}
                                                </button>

                                                <button
                                                    onClick={() => navigateMiniCalendarMonth(1)}
                                                    className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

    
                                        {showYearMonthPicker && (
                                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-4">
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                                    <select
                                                        value={miniCalendarDate.getFullYear()}
                                                        onChange={(e) => handleYearMonthChange(parseInt(e.target.value), miniCalendarDate.getMonth())}
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    >
                                                        {years.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                                                    <select
                                                        value={miniCalendarDate.getMonth()}
                                                        onChange={(e) => handleYearMonthChange(miniCalendarDate.getFullYear(), parseInt(e.target.value))}
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    >
                                                        {monthNames.map((month, index) => (
                                                            <option key={index} value={index}>{month}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => setShowYearMonthPicker(false)}
                                                    className="w-full py-2 border rounded text-sm cursor-pointer hover:bg-gray-100 transform duration-300"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                            {dayNames.map(day => (
                                                <div key={day} className="p-3 font-medium text-gray-600">{day}</div>
                                            ))}
                                            {miniCalendarDays.map((date, index) => {
                                                const isCurrentMonth = date.getMonth() === miniCalendarDate.getMonth();
                                                const isToday = isSameDay(date, today);
                                                const isSelected = weekDates.some(weekDate => isSameDay(weekDate, date));
                                                const isCurrentWeek = weekDates.some(weekDate =>
                                                    Math.abs(date.getTime() - weekDate.getTime()) < 7 * 24 * 60 * 60 * 1000
                                                );
                                                const isPast = isPastDate(date);

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-3 cursor-pointer hover:bg-gray-200 rounded text-sm transition-colors ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                                                            } ${isToday ? 'bg-[#62A07C] text-white font-bold' : ''
                                                            } ${isSelected && !isToday ? 'bg-blue-100 border-2 border-blue-300' : ''
                                                            } ${isCurrentWeek && !isSelected && !isToday ? 'bg-blue-50 border border-blue-200' : ''
                                                            } ${isPast && !isToday && !isSelected ? 'opacity-50 text-gray-500' : ''
                                                            }`}
                                                        onClick={() => handleMiniCalendarDateClick(date)}
                                                        title={`${date.toDateString()} - Click to navigate to this week`}
                                                    >
                                                        {date.getDate()}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )} */}
                            </div>

                            {weekDates.map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                const isToday = isSameDay(date, today);
                                const dayColor = index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600';

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
                                                        {dayNamesLong[index]}
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
                                                                        <div className="font-semibold">{event.title}</div>
                                                                        {event.subtitle && (
                                                                            <div className="text-xs  opacity-90 mt-1">
                                                                                {event.subtitle.split(' ').length > 50 ? (
                                                                                    <div>
                                                                                        {showFullSubtitle === event.id ? (
                                                                                            <>
                                                                                                {event.subtitle}
                                                                                                <button
                                                                                                    onClick={(e) => {
                                                                                                        e.stopPropagation();
                                                                                                        setShowFullSubtitle(null);
                                                                                                    }}
                                                                                                    className="ml-1 cursor-pointer underline hover:no-underline"
                                                                                                >
                                                                                                    Read less
                                                                                                </button>
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                {truncateWords(event.subtitle, 15)}
                                                                                                <button
                                                                                                    onClick={(e) => {
                                                                                                        e.stopPropagation();
                                                                                                        setShowFullSubtitle(event.id);
                                                                                                    }}
                                                                                                    className="ml-1 cursor-pointer underline hover:no-underline"
                                                                                                >
                                                                                                    Read more
                                                                                                </button>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    event.subtitle
                                                                                )}
                                                                            </div>
                                                                        )}
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