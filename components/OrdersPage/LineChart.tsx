'use client'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, CartesianGrid } from 'recharts';

interface ChartData {
    date: string;
    value: number;
}

export default function LineChartComponent({ chartData }: { chartData: ChartData[] }) {

    // Find peak and dip
    const maxPoint = chartData.reduce((max, d) => d.value > max.value ? d : max, chartData[0]);
    const minPoint = chartData.reduce((min, d) => d.value < min.value ? d : min, chartData[0]);
    return (
        <div className="w-full min-w-[800px] md:min-w-0" style={{ minWidth: 800 }}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="1 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 5000]} ticks={[0, 1000, 2000, 3000, 4000, 5000]} tickFormatter={v => `${v} €`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={v => `${v} €`} />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} activeDot={{ r: 7, fill: '#f59e42' }} />
                    {/* Highlight peak */}
                    <ReferenceDot x={maxPoint.date} y={maxPoint.value} r={8} fill="#22c55e" stroke="#fff" strokeWidth={2} />
                    {/* Highlight dip */}
                    <ReferenceDot x={minPoint.date} y={minPoint.value} r={8} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
