'use client'
import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import AppoinmentData from '@/components/AppoinmentData/AppoinmentData';

const WeeklyCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
    const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);
    const [events, setEvents] = useState([
        {
            id: 1,
            date: '2025-05-22',
            time: '9:30',
            title: 'MEETING HERR MÜLLER',
            subtitle: 'ABFLUGTERMIN HERR BAUER',
            type: 'user'
        },
        {
            id: 2,
            date: '2025-05-18',
            title: 'STERNENSTUNDE',
            type: 'user'
        },
        {
            id: 3,
            date: '2025-05-19',
            time: '7:40',
            title: 'FUSSANALYSE HERR MUSTERMANN',
            subtitle: 'LAUFANALYSE FRAU MEYER',
            type: 'others'
        }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerDate, setDatePickerDate] = useState(new Date());
    const [newEvent, setNewEvent] = useState({
        kunde: '',
        uhrzeit: '',
        selectedEventDate: '',
        termin: '',
        bemerk: '',
        mitarbeiter: ''
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

    // Navigate date picker month
    const navigateDatePickerMonth = (direction: number) => {
        const newDate = new Date(datePickerDate);
        newDate.setMonth(datePickerDate.getMonth() + direction);
        setDatePickerDate(newDate);
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

    // Generate date picker calendar
    const generateDatePickerCalendar = () => {
        const year = datePickerDate.getFullYear();
        const month = datePickerDate.getMonth();
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

    // Handle year/month change
    const handleYearMonthChange = (year: number, month: number) => {
        const newDate = new Date(year, month, 1);
        setMiniCalendarDate(newDate);
        setCurrentDate(newDate);
        setShowYearMonthPicker(false);
    };

    const weekDates = getWeekDates();
    const miniCalendarDays = generateMiniCalendar();
    const datePickerDays = generateDatePickerCalendar();
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

    const formatDateDisplay = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = formatDate(date);
        return events.filter(event => event.date === dateStr);
    };

    const handleDateClick = (date: Date) => {
        if (isMobile) {
            setShowDatePicker(true);
        } else {
            setCurrentDate(date);
        }
        setNewEvent({ ...newEvent, selectedEventDate: formatDate(date) });
        setShowAddForm(true);
    };

    const handleMiniCalendarDateClick = (date: Date) => {
        setCurrentDate(date);
        setMiniCalendarDate(date);
    };

    const handleDatePickerSelect = (date: Date) => {
        const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const formattedDate = formatDate(selectedDate);
        setNewEvent({ ...newEvent, selectedEventDate: formattedDate });
        setShowDatePicker(false);
    };

    const handleAddEvent = () => {
        if (newEvent.kunde && newEvent.selectedEventDate) {
            const event = {
                id: Date.now(),
                date: newEvent.selectedEventDate,
                time: newEvent.uhrzeit,
                title: newEvent.kunde.toUpperCase(),
                subtitle: newEvent.bemerk.toUpperCase(),
                type: 'custom'
            };
            setEvents([...events, event]);
            setNewEvent({ kunde: '', uhrzeit: '', selectedEventDate: '', termin: '', bemerk: '', mitarbeiter: '' });
            setShowAddForm(false);
        }
    };

    const handleDeleteEvent = (eventId: number) => {
        setEvents(events.filter(event => event.id !== eventId));
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
                                            {dayEvents.map((event) => (
                                                <div key={event.id} className="relative group">
                                                    <div className={`p-3 rounded-lg text-sm font-medium border-l-4 ${event.type === 'others' ? 'bg-gray-900 text-white border-blue-500' :
                                                        event.type === 'user' ? 'bg-[#62A07C] text-white border-green-700' :
                                                            event.type === 'others' ? 'bg-gray-900 text-white border-purple-500' :
                                                                'bg-gray-800 text-white border-gray-600'
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
                                                                onClick={() => handleDeleteEvent(event.id)}
                                                                className="opacity-0 cursor-pointer group-hover:opacity-100 text-white hover:bg-red-500 rounded-full p-1 ml-2"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Event Button */}
                                            <button
                                                onClick={() => handleDateClick(date)}
                                                className="w-full cursor-pointer p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 text-sm transition-colors"
                                            >
                                                + Termin hinzufügen
                                            </button>

                                            {/* Decorative lines for empty space */}
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
                                    onClick={() => setShowAddForm(false)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Kunde"
                                    value={newEvent.kunde}
                                    onChange={(e) => setNewEvent({ ...newEvent, kunde: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        type="time"
                                        placeholder="Uhrzeit"
                                        value={newEvent.uhrzeit}
                                        onChange={(e) => setNewEvent({ ...newEvent, uhrzeit: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Date Picker */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowDatePicker(true)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between hover:bg-gray-50"
                                    >
                                        <span className={newEvent.selectedEventDate ? 'text-gray-900' : 'text-gray-500'}>
                                            {newEvent.selectedEventDate ? formatDateDisplay(new Date(newEvent.selectedEventDate)) : 'Datum wählen'}
                                        </span>
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <select
                                value={newEvent.termin}
                                onChange={(e) => setNewEvent({ ...newEvent, termin: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Kundentermin</option>
                                <option value="meeting">Meeting</option>
                                <option value="others">Analyse</option>
                                <option value="consultation">Beratung</option>
                            </select>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Mitarbeiter"
                                    value={newEvent.mitarbeiter}
                                    onChange={(e) => setNewEvent({ ...newEvent, mitarbeiter: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="relative">
                                <textarea
                                    placeholder="Betreff"
                                    value={newEvent.bemerk}
                                    onChange={(e) => setNewEvent({ ...newEvent, bemerk: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className='flex justify-center'>
                                <button
                                    onClick={handleAddEvent}
                                    className="px-6 py-2 border bg-green-600 text-white rounded-3xl text-sm cursor-pointer hover:bg-green-700 transform duration-300"
                                >
                                    Termin bestätigen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Date Picker Modal */}
            {showDatePicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
                    <div className="bg-white rounded-lg w-full max-w-sm">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Datum auswählen</h3>
                                <button
                                    onClick={() => setShowDatePicker(false)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Month/Year Navigation */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => navigateDatePickerMonth(-1)}
                                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <h4 className="font-semibold">
                                    {monthNames[datePickerDate.getMonth()]} {datePickerDate.getFullYear()}
                                </h4>
                                <button
                                    onClick={() => navigateDatePickerMonth(1)}
                                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                {dayNames.map(day => (
                                    <div key={day} className="p-2 font-medium text-gray-600">{day}</div>
                                ))}
                                {datePickerDays.map((date, index) => {
                                    const isCurrentMonth = date.getMonth() === datePickerDate.getMonth();
                                    const isToday = isSameDay(date, today);
                                    const isSelected = newEvent.selectedEventDate === formatDate(date);

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleDatePickerSelect(date)}
                                            className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                                                } ${isToday ? 'bg-green-500 text-white hover:bg-green-600' : ''
                                                } ${isSelected && !isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
                                                }`}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Quick Date Buttons */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleDatePickerSelect(today)}
                                    className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                                >
                                    Heute
                                </button>
                                <button
                                    onClick={() => {
                                        const tomorrow = new Date(today);
                                        tomorrow.setDate(today.getDate() + 1);
                                        handleDatePickerSelect(tomorrow);
                                    }}
                                    className="flex-1 py-2 px-3 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                                >
                                    Morgen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyCalendar;