import React from 'react'

export default function Pyramid() {
  const pyramidData = [
    {
      title: "APRIL",
      data: [
        { label: "Excellent", percentage: 20, color: "#2C5F7C" },
        { label: "Good", percentage: 40, color: "#A8CCDB" },
        { label: "Fair", percentage: 30, color: "#C73E1D" },
        { label: "Poor", percentage: 10, color: "#FF8C42" }
      ]
    },
    {
      title: "MAY",
      data: [
        { label: "Excellent", percentage: 36, color: "#2C5F7C" },
        { label: "Good", percentage: 30, color: "#A8CCDB" },
        { label: "Fair", percentage: 28, color: "#C73E1D" },
        { label: "Poor", percentage: 6, color: "#FF8C42" }
      ]
    },
    {
      title: "JUNE",
      data: [
        { label: "Excellent", percentage: 22, color: "#2C5F7C" },
        { label: "Good", percentage: 50, color: "#A8CCDB" },
        { label: "Fair", percentage: 21, color: "#C73E1D" },
        { label: "Poor", percentage: 7, color: "#FF8C42" }
      ]
    }
  ];

  const PyramidChart = ({ title, data }: { title: string, data: { label: string, percentage: number, color: string }[] }) => {

    const orderedData = [
      data.find(item => item.label === "Poor"),
      data.find(item => item.label === "Fair"),
      data.find(item => item.label === "Good"),
      data.find(item => item.label === "Excellent")
    ].filter(Boolean);

    return (
      <div className="">


        {/* Pyramid Container */}
        <div className="p-6">
          <div className="relative mx-auto" style={{ width: '280px', height: '220px' }}>
            <svg width="280" height="220" viewBox="0 0 280 220">
              <defs>
                {/* Diagonal line patterns for each segment */}
                <pattern id={`poorPattern-${title}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill="#FF8C42" />
                  <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
                </pattern>

                <pattern id={`fairPattern-${title}`} patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill="#C73E1D" />
                  <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.1)" />
                </pattern>

                <pattern id={`goodPattern-${title}`} patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(-45)">
                  <rect width="5" height="5" fill="#A8CCDB" />
                  <line x1="0" y1="2.5" x2="5" y2="2.5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                </pattern>

                <pattern id={`excellentPattern-${title}`} patternUnits="userSpaceOnUse" width="6" height="6">
                  <rect width="6" height="6" fill="#2C5F7C" />
                  <polygon points="3,1 4,3 3,5 2,3" fill="rgba(255,255,255,0.1)" />
                </pattern>
              </defs>

              {orderedData.map((segment, index) => {
                const maxWidth = 200;
                const minWidth = 50;
                const widthReduction = (maxWidth - minWidth) / (orderedData.length - 1);
                const segmentWidth = maxWidth - (index * widthReduction);

                const x = (280 - segmentWidth) / 2;
                const y = 165 - (index * 32);

                const patternMap = {
                  'Poor': `poorPattern-${title}`,
                  'Fair': `fairPattern-${title}`,
                  'Good': `goodPattern-${title}`,
                  'Excellent': `excellentPattern-${title}`
                };

                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={y}
                      width={segmentWidth}
                      height="32"
                      fill={`url(#${patternMap[segment?.label as keyof typeof patternMap]})`}
                      stroke="none"
                    />

                    <text
                      x={x + segmentWidth + 12}
                      y={y + 20}
                      fontSize="16"
                      fontWeight="600"
                      fill="#333"
                    >
                      {segment?.percentage}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex justify-center mt-4 space-x-6">
            {[
              { label: "Poor", color: "#FF8C42" },
              { label: "Fair", color: "#C73E1D" },
              { label: "Good", color: "#A8CCDB" },
              { label: "Excellent", color: "#2C5F7C" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Month title */}
          <h3 className="text-center text-lg font-bold text-gray-800 mt-4">
            {title}
          </h3>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-10">
      <div className="">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 tracking-wider">
          BERWERTUNGEN IHRER KUNDEN
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pyramidData.map((pyramid, index) => (
            <div key={index} className="rounded-lg  overflow-hidden">
              <PyramidChart title={pyramid.title} data={pyramid.data} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}