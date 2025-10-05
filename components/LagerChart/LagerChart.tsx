'use client'
import React, { useEffect } from 'react';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, } from 'recharts';

// Chart data
const chartData = [
    { year: '2020', Einkaufspreis: 50000, Verkaufspreis: 75000, Gewinn: 25000 },
    { year: '2021', Einkaufspreis: 60000, Verkaufspreis: 90000, Gewinn: 30000 },
    { year: '2022', Einkaufspreis: 70000, Verkaufspreis: 105000, Gewinn: 35000 },
    { year: '2023', Einkaufspreis: 80000, Verkaufspreis: 120000, Gewinn: 40000 },
    { year: '2024', Einkaufspreis: 90000, Verkaufspreis: 135000, Gewinn: 45000 }
];



export default function LagerChart() {


    useEffect(() => {
        console.log(chartData);


    }, []);





    interface TooltipPayload {
        name: string;
        value: number;
        color?: string;
        payload?: {
            name: string;
            value: number;
            color: string;
        };
    }



    // Custom tooltip component
    const CustomTooltips = ({ active, payload, label }: { active: boolean, payload?: TooltipPayload[], label: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-semibold">{`Jahr: ${label}`}</p>
                    {payload.map((entry, index: number) => (
                        <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
                            {`${entry.name}: ${entry.value.toLocaleString()} €`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full p-4 mx-auto">
            <h1 className="text-3xl font-bold mb-8">Übersicht Bestandswert</h1>
            <div className="">
                {/* bar chart  */}
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[650px] h-[300px] lg:h-[500px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right:0, left: 0, bottom: 20 }}
                                barGap={0}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltips active={true} payload={[]} label={''} />} />
                                <Legend iconType="circle" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: '15px' }} />
                                <Bar dataKey="Einkaufspreis" fill="#81E6D9" name="Einkaufspreis" radius={[4, 4, 0, 0]} barSize={50} />
                                <Bar dataKey="Verkaufspreis" fill="#38B2AC" name="Verkaufspreis" radius={[4, 4, 0, 0]} barSize={50} />
                                <Bar dataKey="Gewinn" fill="#4A6FA5" name="Gewinn" radius={[4, 4, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    )
}
