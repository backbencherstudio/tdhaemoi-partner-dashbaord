'use client'
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function ScanChart() {
    const [data] = useState([
        { hour: '9 Uhr', scans: 6 },
        { hour: '10 Uhr', scans: 4 },
        { hour: '11 Uhr', scans: 12 },
        { hour: '12 Uhr', scans: 2 },
        { hour: '13 Uhr', scans: 6 },
        { hour: '14 Uhr', scans: 10 },
        { hour: '15 Uhr', scans: 12 },
        { hour: '16 Uhr', scans: 2 },
        { hour: '17 Uhr', scans: 4 },
        { hour: '18 Uhr', scans: 6 },
        { hour: '19 Uhr', scans: 6 }
    ]);

    // States for dropdowns
    const [location, setLocation] = useState('Bozen');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLocationOpen, setIsLocationOpen] = useState(false);

    // List of available locations (example)
    const locations = ['Bozen', 'Meran', 'Brixen', 'Bruneck'];

    // Custom tooltip component
    // Define proper type for the tooltip payload
    interface TooltipPayload {
        payload: {
            hour: string;
            scans: number;
        };
        value: number;
    }

    // Custom tooltip component with proper typing
    const CustomTooltip = ({ active, payload }: { active: boolean, payload?: TooltipPayload[] }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-semibold">{payload[0].payload.hour}</p>
                    <p className="text-sm">Scans: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full  mx-auto">
            <h1 className="text-2xl font-bold mb-4">Scan-Verhalten im Tagesverlauf</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Location dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                        className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white hover:bg-gray-50"
                    >
                        {location} <ChevronDown size={16} />
                    </button>

                    {isLocationOpen && (
                        <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg w-full">
                            {locations.map((loc) => (
                                <div
                                    key={loc}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setLocation(loc);
                                        setIsLocationOpen(false);
                                    }}
                                >
                                    {loc}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date dropdown */}
                <div className="relative">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date || new Date())}
                        dateFormat="dd.MM.yyyy"
                        customInput={
                            <button className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white hover:bg-gray-50">
                                {selectedDate.toLocaleDateString('de-DE')} <Calendar size={16} />
                            </button>
                        }
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                    />
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>Scans</span>
                </div>
            </div>

            {/* Chart container */}
            <div className="w-full overflow-x-auto">
                <div className="h-64 md:h-80 mt-10" style={{ minWidth: '768px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis allowDecimals={false} />
                            <Tooltip content={<CustomTooltip active={true} payload={[]} />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                            <Bar dataKey="scans" fill="#5FB471" radius={[10, 10, 0, 0]} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

    
        </div>
    );
}
