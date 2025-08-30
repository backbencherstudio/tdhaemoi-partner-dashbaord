'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ChevronDown, Search } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { customShaftsData } from '@/lib/customShaftsData';

const data = customShaftsData;

const categories = [
    { label: 'Alle Kategorien', value: 'alle' },
    { label: 'Halbschuhe', value: 'halbschuhe' },
    { label: 'Sportschuhe', value: 'sportschuhe' },
    { label: 'Sandalen', value: 'sandalen' },
    { label: 'Knochelhoheschuhe', value: 'knochelhoheschuhe' },
];

export default function CustomShafts() {
    const [gender, setGender] = useState<'herren' | 'damen'>('herren');
    const [category, setCategory] = useState('alle');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;
    const router = useRouter();

    const filtered = data.filter(
        (item) =>
            item.type === gender &&
            (category === 'alle' || item.category.toLowerCase() === category) &&
            (searchQuery === '' ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.no.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
        setShowAll(false);
    }, [gender, category, searchQuery]);

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Determine what to show based on item count
    let itemsToShow = filtered;
    let showPagination = false;
    let showMehrAnzeigen = false;

    if (totalItems <= 5) {
        // Show all items, no pagination or button
        itemsToShow = filtered;
    } else if (totalItems <= 10) {
        if (showAll) {
            // Show all items
            itemsToShow = filtered;
        } else {
            // Show first 5 items and "Mehr anzeigen" button
            itemsToShow = filtered.slice(0, 5);
            showMehrAnzeigen = true;
        }
    } else {
        // Show pagination for 10+ items
        const startIndex = (currentPage - 1) * itemsPerPage;
        itemsToShow = filtered.slice(startIndex, startIndex + itemsPerPage);
        showPagination = true;
    }


    // handle click on the button
    const handleClick = (no: string) => {
        router.push(`/dashboard/custom-shafts/details/${no}`);
    }

    return (
        <div className="  py-6">
            {/* Header & Description */}
            <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-bold mb-1">Maßschaft - individuell für deinen Kunden.</h1>
                <div className="text-xs md:text-sm text-gray-700 leading-snug mb-1">
                    Basierend auf dem 3D-Modell des Kundenfußes stellen wir passgenaue Maßschäfte her. So sparst du dir unnötigen Versand, erhältst eine deutlich schnellere Lieferzeit und profitierst von besten Preisen.<br />
                    <span className="font-bold">Und das Beste:</span> <br />
                    Mit FeetFirst kannst du nicht nur aus unserer Kollektion wählen – du kannst auch ein ganz eigenes Modell für deinen Kunden erstellen. <a href="#" className="font-bold underline">Hier starten.</a>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className={`rounded-none cursor-pointer border border-black px-6 py-1.5 text-base font-normal h-10 ${gender === 'herren' ? 'bg-black text-white' : 'bg-white text-black'}`}
                            onClick={() => setGender('herren')}
                        >
                            Herren
                        </Button>
                        <Button
                            variant="outline"
                            className={`rounded-none cursor-pointer border border-black px-6 py-1.5 text-base font-normal h-10 ${gender === 'damen' ? 'bg-black text-white' : 'bg-white text-black'}`}
                            onClick={() => setGender('damen')}
                        >
                            Damen
                        </Button>
                    </div>
                    {/* Category Dropdown as text with chevron */}
                    <div className="relative mt-1">
                        <button
                            className="flex cursor-pointer items-center text-base md:text-sm font-normal text-black bg-transparent px-0 py-1 focus:outline-none"
                            onClick={() => setCategoryOpen((v) => !v)}
                            type="button"
                        >
                            {categories.find((c) => c.value === category)?.label || 'Alle Kategorien'}
                            <ChevronDown className="ml-1 w-5 h-5" />
                        </button>
                        {categoryOpen && (
                            <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.value}
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm ${category === cat.value ? 'font-semibold' : ''}`}
                                        onClick={() => {
                                            setCategory(cat.value);
                                            setCategoryOpen(false);
                                        }}
                                    >
                                        {cat.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Search Field */}
                <div className="flex items-center justify-end w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 pl-10 pr-4 h-10 rounded-full border border-gray-300 focus:border-black focus:ring-0"
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {itemsToShow.map((item) => (
                        <div key={item.id} className="border group border-gray-300 rounded-md bg-white flex flex-col h-full">
                            <Image src={item.image} alt={item.name} className="w-full h-40 object-contain p-4" width={500} height={500} />
                            <div className="flex-1 flex flex-col justify-between p-4">
                                <div>
                                    <div className="font-semibold text-base mb-1 text-left">{item.name}</div>
                                    <div className="text-xs text-gray-500 mb-2 text-left">#{item.no}</div>
                                    <div className="font-bold text-lg mb-2 text-left">ab {(item.price / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</div>
                                </div>
                                <Button variant="outline" className="w-full cursor-pointer transition-all duration-300 mt-2 rounded-none border border-black bg-white text-black hover:bg-gray-100 text-sm font-medium" onClick={() => handleClick(item.no)}>Jetzt konfigurieren</Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-gray-500 text-lg font-medium mb-2">Keine Produkte gefunden</div>
                    <div className="text-gray-400 text-sm text-center">
                        Es wurden keine Produkte für die ausgewählten Filter gefunden.<br />
                        Versuchen Sie andere Kategorien oder Filter zu verwenden.
                    </div>
                </div>
            )}

            {/* Pagination or Mehr anzeigen Button */}
            {showMehrAnzeigen && (
                <div className="flex justify-center mt-8">
                    <Button
                        className="rounded-full px-8 py-2 bg-black text-white hover:bg-gray-800 text-sm"
                        onClick={() => setShowAll(true)}
                    >
                        Mehr anzeigen
                    </Button>
                </div>
            )}

            {showPagination && totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        className={`cursor-pointer ${currentPage === page ? 'bg-black text-white' : ''}`}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
