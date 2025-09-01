"use client"
import React, { useEffect, useState } from "react";
import { getAllExercises } from "@/apis/exercisesApis";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CheckIcon, MailIcon, PrinterIcon, SearchIcon, XIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useFootExercises } from "@/hooks/footexercises/footexercises";
import useDebounce from "@/hooks/useDebounce";




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

    // Customer search functionality
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        selectedCustomer,
        isSearching,
        showSuggestions,
        handleSearch,
        handleCustomerSelect,
        clearSelection,
        setShowSuggestions
    } = useFootExercises();

    // Debounce search to avoid too many API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        getAllExercises().then((data) => setExercises(data?.exercises || []));
    }, []);

    // Handle search when debounced query changes
    useEffect(() => {
        if (debouncedSearchQuery) {
            handleSearch(debouncedSearchQuery);
        } else {
            // Clear results when query is empty
            setShowSuggestions(false);
        }
    }, [debouncedSearchQuery, handleSearch]);

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
            
            // Reduced scale for smaller file size (original was 2, now 1.5)
            const canvas = await html2canvas(pageDiv, { 
                scale: 1.5, 
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL("image/jpeg", 0.85); 
            
            if (i > 0) pdf.addPage();
            
            // Get A4 dimensions in points
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pageWidth;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
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

            {/* Customer Search Section */}
            <div className='mt-6 p-6 bg-gray-50 rounded-lg border'>
                <h3 className="text-lg font-semibold mb-4">Kunde auswählen</h3>
                
                {/* Search Bar */}
                <div className='relative w-full max-w-md'>
                    <div className='relative'>
                        <input 
                            type='text' 
                            placeholder='Kundenname oder E-Mail eingeben' 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery && setShowSuggestions(true)}
                            className='w-full p-3 rounded-md border border-gray-300 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        />
                        <SearchIcon className='w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' />
                        {searchQuery && (
                            <button
                                onClick={clearSelection}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                            >
                                <XIcon className='w-5 h-5' />
                            </button>
                        )}
                    </div>

                    {/* Search Suggestions Dropdown */}
                    {showSuggestions && (searchResults.length > 0 || isSearching) && (
                        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto'>
                            {isSearching ? (
                                <div className='p-3 text-center text-gray-500'>
                                    <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
                                    Suche läuft...
                                </div>
                            ) : (
                                searchResults.map((customer) => (
                                    <div
                                        key={customer.id}
                                        onClick={() => handleCustomerSelect(customer)}
                                        className='p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                                                <UserIcon className='w-4 h-4 text-blue-600' />
                                            </div>
                                            <div className='flex-1'>
                                                <div className='font-medium text-gray-900'>{customer.name}</div>
                                                <div className='text-sm text-gray-500'>{customer.email}</div>
                                                {customer.phone && (
                                                    <div className='text-xs text-gray-400'>{customer.phone}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Selected Customer Display */}
                {selectedCustomer && (
                    <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                                    <UserIcon className='w-5 h-5 text-blue-600' />
                                </div>
                                <div>
                                    <div className='font-semibold text-gray-900'>{selectedCustomer.name}</div>
                                    <div className='text-sm text-gray-600'>{selectedCustomer.email}</div>
                                    {selectedCustomer.phone && (
                                        <div className='text-xs text-gray-500'>{selectedCustomer.phone}</div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={clearSelection}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                <XIcon className='w-5 h-5' />
                            </button>
                        </div>
                    </div>
                )}
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
                                Der folgende Übungsplan wurde individuell für {selectedCustomer ? selectedCustomer.name : '[Kundenname]'} erstellt.
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

