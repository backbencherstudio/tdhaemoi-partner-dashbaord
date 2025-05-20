'use client'
import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, } from 'recharts';


const data = [
    {
        year: '2025',
        Einkaufspreis: 15000,
        Verkaufspreis: 32000,
        Gewinn: 17000,
    },
    {
        year: '2024',
        Einkaufspreis: 12000,
        Verkaufspreis: 26000,
        Gewinn: 14000,
    },
];


export default function LagerChart() {
    const [windowWidth, setWindowWidth] = React.useState(
        typeof window !== 'undefined' ? window.innerWidth : 0
    );

    React.useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getRadius = () => {
        if (windowWidth < 768) return 80;
        return 120;
    };



    const pieData = [
        { name: 'Frühlings- Sommerschuhe', value: 35, color: '#50B8D3' },
        { name: 'Herbstschuhe- Winterschuhe', value: 40, color: '#2988B8' },
        { name: 'Laufschuhe', value: 10, color: '#1D4A89' },
        { name: 'Bergschuhe', value: 15, color: '#1A2D5D' }
    ];

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: { active: boolean, payload: any }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-semibold">{payload[0].name}</p>
                    <p className="text-sm">{payload[0].value}%</p>
                </div>
            );
        }
        return null;
    };


    // Custom tooltip component
    const CustomTooltips = ({ active, payload, label }: { active: boolean, payload: any, label: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-semibold">{`Jahr: ${label}`}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
                            {`${entry.name}: ${entry.value.toLocaleString()} €`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: { cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, percent: number, index: number, name: string, value: number }) => {
        const RADIAN = Math.PI / 180;
        const innerLineRadius = outerRadius + 10;
        const outerLineRadius = outerRadius + 30;
        const innerX = cx + innerLineRadius * Math.cos(-midAngle * RADIAN);
        const innerY = cy + innerLineRadius * Math.sin(-midAngle * RADIAN);
        const outerX = cx + outerLineRadius * Math.cos(-midAngle * RADIAN);
        const outerY = cy + outerLineRadius * Math.sin(-midAngle * RADIAN);

        const textAnchor = outerX > cx ? 'start' : 'end';

        const percentRadius = outerRadius + 40;
        const percentX = cx + percentRadius * Math.cos(-midAngle * RADIAN);
        const percentY = cy + percentRadius * Math.sin(-midAngle * RADIAN);

        const labelRadius = outerRadius + 40;
        const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
        const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN) + (outerY > cy ? 18 : -18);

        return (
            <g>
                {/* Connecting line */}
                <line
                    x1={innerX}
                    y1={innerY}
                    x2={outerX}
                    y2={outerY}
                    stroke="#999"
                    strokeWidth={1}
                />

                {/* Percentage */}
                <text
                    x={percentX}
                    y={outerY}
                    fill="#333"
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="bold"
                >
                    {`${value}%`}
                </text>

                {/* Category name */}
                <text
                    x={labelX}
                    y={labelY}
                    fill="#333"
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                    fontSize="11"
                >
                    {name}
                </text>
            </g>
        );
    };
    return (
        <div className="w-full p-4 mx-auto">
            <h1 className="text-3xl font-bold mb-8">Ihre Kunden im Geschäft</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                {/* Right pie chart */}
                <div className="h-[300px] lg:h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={renderCustomizedLabel}
                                outerRadius={getRadius()}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip active={true} payload={[]} />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>


                {/* bar chart  */}
                <div className="w-full p-4 h-[300px] lg:h-[500px]">
                    <h2 className="text-2xl font-bold mb-4">Preis und Gewinn Übersicht</h2>
                    <ResponsiveContainer width="100%" height="100%" >
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                            barGap={0}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltips active={true} payload={[]} label={''} />} />
                            <Legend iconType="circle" verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: '15px' }} />
                            <Bar dataKey="Einkaufspreis" fill="#81E6D9" name="Einkaufspreis" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Verkaufspreis" fill="#38B2AC" name="Verkaufspreis" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Gewinn" fill="#4A6FA5" name="Gewinn" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
