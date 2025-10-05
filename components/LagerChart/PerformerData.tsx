'use client'
import React, { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface PerformerDataItem {
    model: string
    verkaufe: number
    umsatzanteil: number
}

const topPerformerData: PerformerDataItem[] = [
    { model: 'Modell B', verkaufe: 230, umsatzanteil: 12.7 },
    { model: 'Modell C', verkaufe: 210, umsatzanteil: 10.7 },
    { model: 'Modell A', verkaufe: 195, umsatzanteil: 8.2 },
    { model: 'Modell D', verkaufe: 160, umsatzanteil: 7.9 },
    { model: 'Modell E', verkaufe: 115, umsatzanteil: 6.1 }
]

const lowPerformerData: PerformerDataItem[] = [
    { model: 'Modell F', verkaufe: 45, umsatzanteil: 2.1 },
    { model: 'Modell G', verkaufe: 38, umsatzanteil: 1.8 },
    { model: 'Modell H', verkaufe: 32, umsatzanteil: 1.5 },
    { model: 'Modell I', verkaufe: 28, umsatzanteil: 1.3 },
    { model: 'Modell J', verkaufe: 22, umsatzanteil: 1.0 }
]

export default function PerformerData() {
    const [activeTab, setActiveTab] = useState<'top' | 'low'>('top')
    const currentData = activeTab === 'top' ? topPerformerData : lowPerformerData

    // Responsive tweaks
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)
    const isSmall = windowWidth < 768

    useEffect(() => {
        const onResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-semibold text-gray-800">{`${label}`}</p>
                    <p className="text-sm text-gray-600">
                        Verkäufe: <span className="font-medium">{payload[0].value}</span>
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="mt-5">

            {/* Tabs */}
            <div className="flex mb-6">
                <button
                    onClick={() => setActiveTab('top')}
                    className={`px-4 py-2 rounded-l-lg cursor-pointer font-medium text-sm  transition-colors ${activeTab === 'top'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Top-Performer
                </button>
                <button
                    onClick={() => setActiveTab('low')}
                    className={`px-4 py-2 rounded-r-lg cursor-pointer font-medium text-sm  transition-colors ${activeTab === 'low'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Low-Performer
                </button>
            </div>

            {/* Chart and Table */}
            {/* On laptop widths allow horizontal scrolling */}
            <div className="md:overflow-x-auto">
                <div className="rounded-lg border border-gray-200 p-4">
                    <h1 className='text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6'>Top-Performer Modelle/Aufträge</h1>
                    <div className='flex flex-col md:flex-row gap-6 md:gap-8 md:min-w-[900px] '>
                        {/* Chart */}
                        <div className="flex-1 ">
                            <div className="h-[240px] md:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={currentData}
                                        layout="vertical"
                                        margin={{ top: 10, right: isSmall ? 10 : 30, left: isSmall ? 0 : 0, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis
                                            type="number"
                                            domain={[0, 250]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: isSmall ? 11 : 12, fill: '#666' }}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="model"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: isSmall ? 11 : 12, fill: '#666' }}
                                            width={isSmall ? 65 : 80}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="verkaufe"
                                            fill="#10B981"
                                            radius={[0, 4, 4, 0]}
                                            barSize={isSmall ? 12 : (windowWidth > 1024 ? 14 : 16)}
                                            name="Verkäufe"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="w-full md:w-4/12 h-[240px] md:h-[300px]">
                            <div className="bg-gray-50 rounded-lg p-3 md:p-4 h-full flex flex-col">
                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-2 md:mb-3">
                                    <div className="text-xs md:text-sm font-medium text-gray-700 text-center">Verkäufe</div>
                                    <div className="text-xs md:text-sm font-medium text-gray-700 text-center">
                                        Umsatzanteil
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    {currentData.map((item, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                                            <div className="text-center font-medium text-gray-800">
                                                {item.verkaufe}
                                            </div>
                                            <div className="text-center font-medium text-gray-800">
                                                {item.umsatzanteil}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
