"use client"
import React, { useEffect, useState } from "react";
import { getAllExercises } from "@/apis/exercisesApis";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CheckIcon, MailIcon, PrinterIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";




interface Exercise {
    id: number;
    title: string;
    sub_title: string;
    category: string;
    duration: string;
    image: string;
    instructions: string[];
}

// Helper to paginate exercises
function paginate<T>(array: T[], pageSize: number): T[][] {
    return array.reduce((acc, val, i) => {
        if (i % pageSize === 0) acc.push([]);
        acc[acc.length - 1].push(val);
        return acc;
    }, [] as T[][]);
}

export default function FootExercises() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllExercises().then((data) => setExercises(data?.exercises || []));
    }, []);

    // Group by category
    const categories = exercises.reduce((acc: Record<string, Exercise[]>, ex: Exercise) => {
        acc[ex.category] = acc[ex.category] || [];
        acc[ex.category].push(ex);
        return acc;
    }, {});

    const handleSelect = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handlePrint = async () => {
        setLoading(true);
        const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
        for (let i = 0; i < pages.length; i++) {
            const pageDiv = document.getElementById(`print-page-${i}`);
            if (!pageDiv) continue;
            const canvas = await html2canvas(pageDiv, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pageWidth;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        }
        pdf.save("fussuebungen.pdf");
        setLoading(false);
    };

    const selectedExercises = exercises.filter((ex: Exercise) => selected.includes(ex.id));
    const pages = paginate(selectedExercises, 3);

    return (
        <div className="mb-20">
            {/* Loading Spinner Overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <h1 className='text-3xl font-bold'>Fußübungen</h1>
            <p className='text-base text-gray-500 mt-2'>Wähle gezielt Übungen aus und erstelle einen individuellen Plan für deinen Kunden.</p>
            {/* search bar  with search icon */}
            <div className='mt-4'>
                <div className='relative w-fit'>
                    <input type='text' placeholder='Kundenname eingeben' className='w-full p-2 rounded-md border border-gray-300 pl-10' />
                    {/* SearchIcon can be added here if needed */}
                    <SearchIcon className='w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500' />
                </div>
            </div>

            {Object.entries(categories).map(([cat, items], catIdx) => (
                <div key={cat} className={`${catIdx !== 0 ? 'mt-20' : 'mt-10'}`}>
                    <h2 className="text-2xl font-bold text-center mb-8">{cat}</h2>
                    <Accordion type="single" collapsible value={expanded ?? undefined} onValueChange={setExpanded}>
                        {items.map((ex: Exercise) => (
                            <div key={ex.id} className="relative flex items-stretch mb-4">
                                <div className="flex-1">
                                    <AccordionItem
                                        value={String(ex.id)}
                                        className="border border-gray-300 rounded-lg bg-white"
                                    >
                                        <AccordionTrigger className="flex items-center justify-center px-4 py-3 pr-16 text-center">
                                            <div className="flex flex-col gap-2 items-center w-full">
                                                <span className="font-bold text-base md:text-lg">{ex.title}</span>
                                                <span className="text-xs md:text-sm text-gray-500">{ex.sub_title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col md:flex-row gap-8 p-6 items-start">
                                                <Image width={320} height={320} src={ex.image} alt={ex.title} className="w-80 h-80 object-contain border rounded bg-white flex-shrink-0 mx-auto md:mx-0" />
                                                <div className="flex-1">
                                                    <div className="font-bold text-xl mb-2">{ex.title}</div>
                                                    <div className="font-semibold text-base mb-2">Dauer: <span className="font-normal">{ex.duration}</span></div>
                                                    <div>
                                                        <div className="font-bold mb-1">So geht&apos;s:</div>
                                                        <ul className="list-disc ml-5 space-y-1 text-base">
                                                            {ex.instructions.map((ins: string, idx: number) => (
                                                                <li key={idx}>{ins}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </div>
                                <button
                                    onClick={(e) => handleSelect(ex.id, e)}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 border-2 rounded-md flex items-center justify-center transition-colors duration-150 bg-white z-10 ${selected.includes(ex.id) ? "border-black" : "border-gray-300"}`}
                                    aria-label="Select exercise"
                                    tabIndex={0}
                                >
                                    {selected.includes(ex.id) && <CheckIcon className="w-5 h-5 text-black" />}
                                </button>
                            </div>
                        ))}
                    </Accordion>
                </div>
            ))}

            {/* Hidden printable area */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                {pages.map((page: Exercise[], pageIndex: number) => (
                    <div
                        key={pageIndex}
                        id={`print-page-${pageIndex}`}
                        style={{
                            width: '794px',
                            height: '1123px',
                            background: '#fff',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div style={{ 
                            padding: '40px 40px 20px 40px',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1
                        }}>
                            <h1 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '12px' }}>
                                Der folgende Übungsplan wurde individuell für [Kundenname] erstellt.
                            </h1>
                            <p style={{ fontSize: '14px', marginBottom: '32px' }}>
                                Gezielte Fußübungen stärken Muskulatur, Stabilität und Beweglichkeit. Bereits wenige Minuten täglich können spürbare Verbesserungen bewirken – sei es zur Vorbeugung, zur Unterstützung einer Versorgung oder zur aktiven Linderung von Beschwerden.
                            </p>
                        </div>
                        
                        {/* Content */}
                        <div style={{
                            padding: '0 40px',
                            position: 'absolute',
                            top: '220px',
                            left: 0,
                            right: 0,
                            bottom: '60px', 
                            overflow: 'hidden'
                        }}>
                            {page.map((ex: Exercise) => (
                                <div key={ex.id} style={{ marginBottom: '30px', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                    <Image width={220} height={220} src={ex.image} alt={ex.title} style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '12px', background: '#fff', border: '1px solid #eee' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>{ex.title}</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>Dauer: <span style={{ fontWeight: 'normal' }}>{ex.duration}</span></div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>So geht&apos;s:</div>
                                        <ul style={{ marginLeft: '20px', fontSize: '15px' }}>
                                            {ex.instructions.map((ins: string, idx: number) => (
                                                <li key={idx}>{ins}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Footer - Fixed at bottom */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: '#000',
                            color: '#fff',
                            height: '60px',
                            zIndex: 2
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0 40px',
                                height: '100%'
                            }}>
                                <p>+43 5950-2330</p>
                                <p>FeetFirst GmbH</p>
                                <p>info@feetf1rst.com</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* print and email plan button */}
            <div className="flex justify-center gap-12 mt-20">
                <div className="flex flex-col items-center">
                    <button
                        className={`flex items-center justify-center w-36 h-24 rounded-full bg-[#F5F5F5] cursor-pointer shadow-md hover:bg-gray-200 transition-all ${selectedExercises.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePrint}
                        disabled={selectedExercises.length === 0}
                    >
                        <PrinterIcon className="w-12 h-12" />
                    </button>
                    <span className="text-base font-normal mt-3">DRUCKEN</span>
                </div>
                <div className="flex flex-col items-center">
                    <button
                        className={`flex items-center justify-center w-36 h-24 rounded-full bg-[#F5F5F5] cursor-pointer shadow-md hover:bg-gray-200 transition-all ${selectedExercises.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={selectedExercises.length === 0}
                    >
                        <MailIcon className="w-10 h-10" />
                    </button>
                    <span className="text-base font-normal mt-3">E-MAIL</span>
                </div>
            </div>
        </div>
    )
}

