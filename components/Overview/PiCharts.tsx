'use client'
import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Label } from 'recharts';

export default function PiCharts() {
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
                {/* Left pie chart */}
                <div className="h-[300px] lg:h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
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
            </div>
        </div>
    );
}