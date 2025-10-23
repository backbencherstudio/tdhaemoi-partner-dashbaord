'use client'
import React from 'react';

interface Event {
    id: string;
    date: string;
    time: string;
    title: string;
    subtitle: string;
    type: string;
    assignedTo: string;
    reason: string;
    duration?: number;
    customer_name?: string;
    customerId?: string;
    user?: {
        name: string;
        email: string;
    };
}

interface DayViewProps {
    selectedDate: Date | null;
    events: Event[];
    monthNames: string[];
    dayNamesLong: string[];
    isSelectedDate: boolean;
}

const DayView: React.FC<DayViewProps> = ({
    selectedDate,
    events,
    monthNames,
    dayNamesLong,
    isSelectedDate
}) => {
    if (!selectedDate) return null;

    const formatTime = (time: string) => {
        const t = time.trim().toLowerCase();
        const ampm = /^(\d{1,2}):(\d{2})\s*(am|pm)$/;
        const m = t.match(ampm);
        if (m) {
            let h = parseInt(m[1], 10);
            const min = m[2];
            const mod = m[3];
            if (mod === 'pm' && h !== 12) h += 12;
            if (mod === 'am' && h === 12) h = 0;
            return `${String(h).padStart(2, '0')}:${min}`;
        }
        // already 24h like 15:00
        const is24 = /^\d{1,2}:\d{2}$/.test(t);
        if (is24) return t.length === 4 ? `0${t}` : t;
        // last resort
        const d = new Date(`2000-01-01T${t}`);
        if (!isNaN(d.getTime())) {
            return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }
        return t;
    };

    const formatDuration = (duration: number) => {
        if (duration === 0.17) return '10 Min';
        if (duration === 0.5) return '30 Min';
        if (duration === 1) return '60 Min';
        return `${duration} Std`;
    };

    return (
        <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {isSelectedDate ? 'Selected Date' : 'Month View'}
                </h3>
                <div className="text-center">
                    {/* Date Display */}
                    <div className={`text-4xl font-light mb-2 ${isSelectedDate ? 'text-purple-600' : 'text-[#62A07C]'}`}>
                        {selectedDate.getDate()}
                    </div>
                    <div className={`text-sm mb-1 ${isSelectedDate ? 'text-purple-600' : 'text-[#62A07C]'}`}>
                        {dayNamesLong[selectedDate.getDay()]}
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                        {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </div>

                    {/* Events Display */}
                    {events.length > 0 ? (
                        <div className="mb-4">
                            <div className="text-sm text-gray-700 mb-3">
                                {isSelectedDate ? 'Selected date' : 'Today'} has {events.length} appointment{events.length !== 1 ? 's' : ''}
                            </div>

                            {/* Show appointment details */}
                            <div className="space-y-3">
                                {events.map((event: Event, index: number) => (
                                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <div className="text-sm font-medium text-gray-800 mb-2">
                                            {event.title}
                                        </div>
                                        {event.time && (
                                            <div className="text-xs text-gray-600 mb-1">
                                                Time: {formatTime(event.time)}
                                            </div>
                                        )}
                                        {event.assignedTo && (
                                            <div className="text-xs text-gray-600 mb-1">
                                                Mitarbeiter: {event.assignedTo}
                                            </div>
                                        )}
                                        {event.reason && (
                                            <div className="text-xs text-gray-600 mb-1">
                                                Grund: {event.reason}
                                            </div>
                                        )}
                                        {event.duration && (
                                            <div className="text-xs text-gray-600">
                                                Dauer: {formatDuration(event.duration)}
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
                    ) : (
                        <div className="mb-4">
                            <div className="text-sm text-gray-700 mb-3">
                                No appointments found
                            </div>
                            <div className="flex items-center justify-center mt-3">
                                <div className="w-3 h-3 bg-gray-300 rounded-full border border-white mr-2"></div>
                                <span className="text-xs text-gray-600">No appointments</span>
                            </div>
                        </div>
                    )}

                    {/* Status indicator */}
                    <div className="mt-4 pt-4 border-t">
                        <div className={`text-xs px-3 py-1 rounded-full inline-block ${
                            isSelectedDate 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {isSelectedDate ? 'Selected Date' : 'Month View'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayView;
