'use client'
import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AppoinmentData from '@/components/AppoinmentData/AppoinmentData';
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { createAppoinment, deleteAppointment, getMyAppointments } from '@/apis/appoinmentApis';
import toast from "react-hot-toast";

interface Event {
    id: number;
    date: string;
    time: string;
    title: string;
    subtitle: string;
    type: string;
}

const WeeklyCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
    const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);
    const [events, setEvents] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        show: boolean;
        appointmentId: number | null;
    }>({
        show: false,
        appointmentId: null
    });

    const form = useForm<{
        kunde: string;
        uhrzeit: string;
        selectedEventDate: string;
        termin: string;
        bemerk: string;
        mitarbeiter: string;
        isClientEvent: boolean;
    }>({
        defaultValues: {
            kunde: '',
            uhrzeit: '',
            selectedEventDate: '',
            termin: '',
            bemerk: '',
            mitarbeiter: '',
            isClientEvent: false
        }
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsMobile(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setIsLoading(true);
            const response = await getMyAppointments({
                page: 1,
                limit: 100
            });
            const appointments = response?.data || [];

            if (appointments.length > 0) {
                const formattedEvents = appointments.map((apt: any) => ({
                    id: apt.id,
                    date: new Date(apt.date).toISOString().split('T')[0],
                    time: apt.time,
                    title: apt.customer_name.toUpperCase(),
                    subtitle: apt.details?.toUpperCase(),
                    type: apt.isClient ? 'user' : 'others'
                }));
                setEvents(formattedEvents);
            }
        } catch (error) {
            toast.error('Failed to load appointments');
        } finally {
            setIsLoading(false);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    const getWeekStart = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    // Get week dates
    const getWeekDates = () => {
        const weekStart = getWeekStart(currentDate);
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    // Navigate weeks
    const navigateWeek = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    // Navigate mini calendar month
    const navigateMiniCalendarMonth = (direction: number) => {
        const newDate = new Date(miniCalendarDate);
        newDate.setMonth(miniCalendarDate.getMonth() + direction);
        setMiniCalendarDate(newDate);
        setCurrentDate(newDate);
    };


    //  mini calendar
    const generateMiniCalendar = () => {
        const year = miniCalendarDate.getFullYear();
        const month = miniCalendarDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const handleYearMonthChange = (year: number, month: number) => {
        const newDate = new Date(year, month, 1);
        setMiniCalendarDate(newDate);
        setCurrentDate(newDate);
        setShowYearMonthPicker(false);
    };

    const weekDates = getWeekDates();
    const miniCalendarDays = generateMiniCalendar();
    const today = getTodayDate();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const dayNamesLong = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = formatDate(date);
        return events.filter((event: Event) => {
            const eventDate = new Date(event.date);
            const eventDateStr = formatDate(eventDate);
            return eventDateStr === dateStr;
        });
    };

    const handleDateClick = (date: Date) => {
        form.reset();

        if (isMobile) {
            setShowDatePicker(true);
        }
        form.setValue('selectedEventDate', formatDate(date));
        setShowAddForm(true);
    };

    const handleMiniCalendarDateClick = (date: Date) => {
        setCurrentDate(date);
        setMiniCalendarDate(date);
    };



    const onSubmit = async (data: {
        kunde: string;
        uhrzeit: string;
        selectedEventDate: string;
        termin: string;
        bemerk: string;
        mitarbeiter: string;
        isClientEvent: boolean;
    }) => {
        const loadingToastId = toast.loading('Creating appointment...');
        try {
            if (!data.kunde || !data.uhrzeit || !data.selectedEventDate || !data.termin) {
                toast.dismiss(loadingToastId);
                toast.error('Please fill in all required fields');
                return;
            }

            const timeDate = new Date(`2000-01-01T${data.uhrzeit}`);
            const formattedTime = timeDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).toLowerCase();

            const [hours, minutes] = data.uhrzeit.split(':');
            const dateTime = new Date(data.selectedEventDate);
            dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const appointmentData = {
                customer_name: data.kunde,
                time: formattedTime,
                date: dateTime.toISOString(),
                reason: data.termin,
                assignedTo: data.mitarbeiter || '',
                details: data.bemerk || '',
                isClient: Boolean(data.isClientEvent),
                userId: "user-uuid-1"
            };

            const response = await createAppoinment(appointmentData);

            if (response.success) {
                const updatedResponse = await getMyAppointments({
                    page: 1,
                    limit: 100
                });

                if (updatedResponse.data) {
                    const formattedEvents = updatedResponse.data.map((apt: any) => ({
                        id: apt.id,
                        date: new Date(apt.date).toISOString().split('T')[0],
                        time: apt.time,
                        title: apt.customer_name.toUpperCase(),
                        subtitle: apt.details?.toUpperCase(),
                        type: apt.isClient ? 'user' : 'others'
                    }));
                    setEvents(formattedEvents);
                }

                form.reset();
                setShowAddForm(false);
                toast.dismiss(loadingToastId);
                toast.success('Appointment created successfully', {
                    duration: 3000,
                });
            } else {
                toast.dismiss(loadingToastId);
                toast.error(response.message || 'Failed to create appointment');
            }
        } catch (error: any) {
            toast.dismiss(loadingToastId);
            const errorMessage = error.response?.data?.message || 'Failed to create appointment';
            toast.error(errorMessage);
        }
    };


    const deleteAppointments = async (appointmentId: string) => {
        try {
            const response = await deleteAppointment(appointmentId);
            const updatedResponse = await getMyAppointments({
                page: 1,
                limit: 100
            });

            if (updatedResponse.data) {
                const formattedEvents = updatedResponse.data.map((apt: any) => ({
                    id: apt.id,
                    date: new Date(apt.date).toISOString().split('T')[0],
                    time: apt.time,
                    title: apt.customer_name.toUpperCase(),
                    subtitle: apt.details?.toUpperCase(),
                    type: apt.isClient ? 'user' : 'others'
                }));
                setEvents(formattedEvents);
            }

            setDeleteConfirmation({ show: false, appointmentId: null });
            toast.success(response.message || 'Appointment deleted successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete appointment');
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    return (
        <div className=" bg-white">
            <div className='p-4 sm:p-6'>
                <AppoinmentData />
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
                                <div className="flex  items-center justify-between mb-4">
                                    <button
                                        onClick={() => navigateWeek(-1)}
                                        className="p-2 hover:bg-gray-100 rounded md:hidden"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <h2 className="text-base sm:text-lg font-semibold text-center">
                                        Week of {monthNames[weekDates[0].getMonth()].slice(0, 3)}. {weekDates[0].getDate()}, {weekDates[0].getFullYear()}
                                    </h2>
                                    <button
                                        onClick={() => navigateWeek(1)}
                                        className="p-2 hover:bg-gray-100 rounded md:hidden"
                                    >
                                        <ChevronRight className="w-5 h-5" />
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

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-2 cursor-pointer hover:bg-gray-200 rounded ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                                                            } ${isToday ? 'bg-[#62A07C] text-white' : ''
                                                            } ${isSelected && !isToday ? 'bg-blue-100' : ''
                                                            }`}
                                                        onClick={() => handleMiniCalendarDateClick(date)}
                                                    >
                                                        {date.getDate()}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {weekDates.map((date, index) => {
                                const dayEvents = getEventsForDate(date);
                                const isToday = isSameDay(date, today);
                                const dayColor = index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600';

                                return (
                                    <div key={index} className="border-b border-gray-200 pb-6">
                                        {/* Date Header */}
                                        <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded">
                                            <div className="flex items-center gap-4">
                                                <div className={`text-3xl sm:text-4xl font-light ${dayColor}`}>
                                                    {date.getDate()}
                                                </div>
                                                <div>
                                                    <div className={`text-sm ${dayColor}`}>
                                                        {dayNamesLong[index]}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {monthNames[date.getMonth()]} {date.getFullYear()}
                                                    </div>
                                                </div>
                                            </div>
                                            {isToday && (
                                                <div className="w-4 h-4 bg-[#62A07C] rounded-full"></div>
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
                                                        <div key={event.id} className="relative group">
                                                            <div className={`p-3 rounded-lg text-sm font-medium border-l-4 ${event.type === 'user'
                                                                ? 'bg-[#62A07C] text-white border-green-700'
                                                                : 'bg-gray-900 text-white border-gray-700'
                                                                }`}>
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        {event.time && (
                                                                            <div className="text-xs opacity-90 mb-1">{event.time}</div>
                                                                        )}
                                                                        <div className="font-semibold">{event.title}</div>
                                                                        {event.subtitle && (
                                                                            <div className="text-xs opacity-90 mt-1">{event.subtitle}</div>
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
                                                                        className="opacity-0 cursor-pointer group-hover:opacity-100 text-white hover:bg-red-500 rounded-full p-1 ml-2"
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
                                                className="w-full cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 text-sm transition-colors"
                                            >
                                                + Termin hinzufügen
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
                <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Neuer Termin</h3>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        form.reset();
                                    }}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="isClientEvent"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <FormLabel>Kundentyp</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        console.log('Switch value changed to:', checked); 
                                                    }}
                                                    className="data-[state=checked]:bg-[#61A07B] cursor-pointer"
                                                />
                                            </FormControl>
                                            <span className="text-sm text-gray-500">
                                                {field.value ? 'Kunde' : 'Andere'}
                                            </span>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="kunde"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kunde<span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Kunde" {...field} />
                                            </FormControl>
                                            {form.formState.errors.kunde && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {form.formState.errors.kunde.message}
                                                </p>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="uhrzeit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Uhrzeit</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="selectedEventDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Datum</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(new Date(field.value), "PPP")
                                                                ) : (
                                                                    <span>Datum wählen</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="termin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kundentermin</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Kundentermin wählen" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="meeting">Meeting</SelectItem>
                                                    <SelectItem value="analyse">Analyse</SelectItem>
                                                    <SelectItem value="consultation">consultation</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="mitarbeiter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mitarbeiter</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mitarbeiter" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bemerk"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Betreff</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Betreff"
                                                    className="resize-none h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-center">
                                    <Button
                                        type="submit"
                                        className="bg-[#61A07B] hover:bg-[#528c68] text-white rounded-3xl"
                                    >
                                        Termin bestätigen
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
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
                                onClick={() => deleteConfirmation.appointmentId &&
                                    deleteAppointments(deleteConfirmation.appointmentId.toString())}
                                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyCalendar;