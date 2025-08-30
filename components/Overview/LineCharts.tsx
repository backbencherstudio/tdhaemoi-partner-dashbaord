'use client'
import React from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line, YAxis } from 'recharts';

export default function LineCharts() {
    const barData = [
        { category: 'Herren', scans: 13, purchases: 8 },
        { category: 'Damen', scans: 20, purchases: 16 },
        { category: 'Insgesamt', scans: 28, purchases: 24 }
    ];

    const lineData = [
        { year: '2016', revenue: 13, profit: 6 },
        { year: '2017', revenue: 17, profit: 8 },
        { year: '2018', revenue: 19, profit: 9 },
        { year: '2019', revenue: 22, profit: 12 },
        { year: '2020', revenue: 29, profit: 15 },
        { year: '2021', revenue: 30, profit: 16 },
        { year: '2022', revenue: 32, profit: 17 },
        { year: '2023', revenue: 36, profit: 19 },
        { year: '2024', revenue: 40, profit: 21 },
        { year: '2025', revenue: 45, profit: 24 }
    ];

    interface BarTooltipPayload {
        payload: {
            category: string;
            scans: number;
            purchases: number;
        };
        value: number;
    }

    interface LineTooltipPayload {
        payload: {
            year: string;
            revenue: number;
            profit: number;
        };
        value: number;
    }

    // Custom tooltip for the bar chart with proper typing
    const CustomBarTooltip = ({ active, payload }: { active: boolean, payload?: BarTooltipPayload[] }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-semibold">{payload[0].payload.category}</p>
                    <p className="text-sm">Scans: {payload[0].value}</p>
                    <p className="text-sm">Käufe: {payload[1].value}</p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for the line chart with proper typing
    const CustomLineTooltip = ({ active, payload }: { active: boolean, payload?: LineTooltipPayload[] }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-semibold">{payload[0].payload.year}</p>
                    <p className="text-sm text-cyan-500">Revenue: ${payload[0].value}M</p>
                    <p className="text-sm text-yellow-500">Profit: ${payload[1].value}M</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full ">
            {/* Top row - Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Left side key metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Metric 1 */}
                    <div className="bg-white justify-center p-6 rounded-lg shadow-md flex flex-col items-center text-center">

                        <h1 className="text-6xl font-bold mb-2">140</h1>
                        <p className="text-gray-700">Schuhverkäufe durch FeetFirst im Geschäft</p>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white justify-center p-6 rounded-lg shadow-md flex flex-col items-center text-center">

                        <h1 className="text-6xl font-bold mb-2">40</h1>
                        <p className="text-gray-700">Ihre Lieblingskategorie der Kunden waren Bequemschuhe</p>
                    </div>
                </div>

                {/* Right side - Bar chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-end gap-6 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span className="text-sm">Scans</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <span className="text-sm">Daraus folgende Käufe</span>
                        </div>
                    </div>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                barGap={5}
                            >
                                <CartesianGrid vertical={false} stroke="#eee" />
                                <XAxis dataKey="category" axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomBarTooltip active={true} payload={[]} />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                                <Bar dataKey="scans" fill="#5FB471" radius={[10, 10, 0, 0]} barSize={30} />
                                <Bar dataKey="purchases" fill="#D3D3D3" radius={[10, 10, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom row - Key metrics and line chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side key metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Metric 3 */}
                    <div className="bg-white justify-center p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                        <h1 className="text-6xl font-bold mb-2">35</h1>
                        <p className="text-gray-700">Verkäufe der Firma &quot;Salewa&quot; (Damit Bestwert aller Marken)</p>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-white justify-center p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                        <h1 className="text-6xl font-bold mb-2">1268</h1>
                        <p className="text-gray-700">Verkäufe seit Anfang der Nutzung von FeetFirst</p>
                    </div>
                </div>

                {/* Right side - Line chart */}
                <div className="bg-white w-full overflow-x-auto lg:overflow-hidden p-4 rounded-lg shadow-md relative ">
                    <div className="h-64 min-w-[768px] md:min-w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={lineData}
                                margin={{ top: 20, right: 20, left: 20, bottom: 25 }}
                            >
                                <CartesianGrid vertical={false} stroke="#eee" />
                                <XAxis
                                    dataKey="year"
                                    axisLine={{ stroke: '#e0e0e0' }}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis hide={true} />
                                <Tooltip content={<CustomLineTooltip active={true} payload={[]} />} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#00BCD4"
                                    strokeWidth={2}
                                    dot={{ stroke: '#00BCD4', strokeWidth: 2, r: 4, fill: 'white' }}
                                    activeDot={{ r: 6, stroke: '#00BCD4', strokeWidth: 2, fill: 'white' }}
                                    label={({ x, y, value, index }) => {
                                        // Only show labels for some points to avoid overcrowding
                                        if (index % 2 === 0 || index === lineData.length - 1) {
                                            return (
                                                <text
                                                    x={x}
                                                    y={y - 15}
                                                    fill="#00BCD4"
                                                    fontSize={12}
                                                    textAnchor="middle"
                                                >
                                                    ${value}M
                                                </text>
                                            );
                                        }
                                        return <text />;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#FFC107"
                                    strokeWidth={2}
                                    dot={{ stroke: '#FFC107', strokeWidth: 2, r: 4, fill: 'white' }}
                                    activeDot={{ r: 6, stroke: '#FFC107', strokeWidth: 2, fill: 'white' }}
                                    label={({ x, y, value, index }) => {
                                        if (index % 2 === 0 || index === lineData.length - 1) {
                                            return (
                                                <text
                                                    x={x}
                                                    y={y - 15}
                                                    fill="#FFC107"
                                                    fontSize={12}
                                                    textAnchor="middle"
                                                >
                                                    ${value}M
                                                </text>
                                            );
                                        }
                                        return <text />;
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center mt-4 gap-6 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-yellow-400"></div>
                            <span>Historical Profit</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-yellow-400"></div>
                            <span>Projected Profit</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-cyan-500"></div>
                            <span>Historical Revenue</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-1 bg-cyan-500"></div>
                            <span>Projected Revenue</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}