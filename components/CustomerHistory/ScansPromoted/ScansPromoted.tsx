// components/ScansPromoted.tsx
import React from "react";
import Image from "next/image";
import legImage from "@/public/Kunden/legs.png";

const scanData = [
    {
        name: "Theo Brugger",
        date: "13.02.2025",
        location: "Zuhause",
    },
    {
        name: "Theo Brugger",
        date: "13.02.2025",
        location: "Bruneck",
    },
    {
        name: "Theo Brugger",
        date: "13.02.2025",
        location: "Bozen",
    },
    {
        name: "Theo Brugger",
        date: "13.02.2025",
        location: "Bozen",
    },
];

export default function ScansPromoted() {
    return (
        <div className="py-8 px-4 md:px-10">
            <h1 className="text-2xl font-bold capitalize">DURCHGEFÜHRTE SCANS</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {scanData.map((scan, index) => (
                    <div
                        key={index}
                        className=" flex flex-col "
                    >
                        <Image src={legImage} alt="Leg Scan" className="mb-4" width={160} height={100} />

                        <h3 className="text-lg font-semibold text-[#62A07C]">{scan.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">Erstellt am: {scan.date}</p>
                        <p className="text-gray-600 text-sm mb-4">Ort: {scan.location}</p>

                        <div>
                            <button className="bg-[#62A07C] px-10 hover:bg-[#62a07c77] cursor-pointer text-white text-sm  py-2 rounded transition">
                                Scan ansehen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
