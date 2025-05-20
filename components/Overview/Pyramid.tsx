'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Cell,
  ResponsiveContainer
} from 'recharts';

const data = [
  {
    name: 'Poor',
    value: 10,
    color: '#D97E00' // Orange
  },
  {
    name: 'Fair',
    value: 30,
    color: '#C13F60' // Reddish
  },
  {
    name: 'Good',
    value: 40,
    color: '#82A6C2' // Blue
  },
  {
    name: 'Excellent',
    value: 20,
    color: '#142C51' // Dark blue
  }
];

export default function Pyramid() {
  // Reverse data for pyramid order (bottom-up)
  const reversedData = [...data].reverse();

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={reversedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barCategoryGap={5}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#555', fontSize: 14 }}
          />
          <Tooltip />
          <Bar dataKey="value" barSize={40} radius={[10, 10, 0, 0]}>
            {
              reversedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))
            }
            <LabelList
              dataKey="value"
              position="right"
              formatter={(val: number) => `${val}%`}
              style={{ fill: 'black', fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm font-medium">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: d.color }}
            ></span>
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
