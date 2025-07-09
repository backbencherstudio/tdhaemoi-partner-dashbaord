
'use client'
import React, { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { IoIosArrowDown } from 'react-icons/io';
import { BsFillQuestionCircleFill } from "react-icons/bs";

interface AuswahlCard {
    id: number;
    name: string;
    rohlingHersteller: string;
    artikelHersteller: string;
    artNr: string;
    versorgung: string;
    materialien: string;
    laenge: string;
    kategorie: string;
}

const initialCards: AuswahlCard[] = [
    {
        id: 1,
        name: 'Dünne Standard Einlage',
        rohlingHersteller: 'FeetFirst',
        artikelHersteller: 'FeetFirst',
        artNr: '2145644633',
        versorgung: 'Versorgung mit Pelotte, Kork-Längsstütze & Zehensteg',
        materialien: 'Kork, Leder',
        laenge: '270',
        kategorie: 'Knickfuss',
    },
    {
        id: 2,
        name: 'Dünne Standard Einlage',
        rohlingHersteller: 'FeetFirst',
        artikelHersteller: 'FeetFirst',
        artNr: '2145644633',
        versorgung: 'Versorgung mit Pelotte, Kork-Längsstütze & Zehensteg',
        materialien: 'Kork, Leder',
        laenge: '275',
        kategorie: 'Knickfuss',
    },
    {
        id: 3,
        name: 'Dünne Standard Einlage',
        rohlingHersteller: 'FeetFirst',
        artikelHersteller: 'FeetFirst',
        artNr: '2145644633',
        versorgung: 'Versorgung mit Pelotte, Kork-Längsstütze & Zehensteg',
        materialien: 'Kork, Leder',
        laenge: '280',
        kategorie: 'Plattfuss',
    },
];

const filterCategories = [
    'Knickfuss',
    'Spreizfuss',
    'Plattfuss',
    'Hohlfuss',
];

export default function Auswahl() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        slidesToScroll: 1,
        align: 'start',
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 4 }
        }
    })

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])



    const [cards, setCards] = useState<AuswahlCard[]>(initialCards);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        rohlingHersteller: '',
        artikelHersteller: '',
        artNr: '',
        versorgung: '',
        materialien: '',
        laenge: '',
        kategorie: '',
    });
    const laengen = [
        { value: '250', label: '35' },
        { value: '255', label: '36' },
        { value: '260', label: '37' },
        { value: '265', label: '38' },
        { value: '270', label: '39' },
        { value: '275', label: '40' },
        { value: '280', label: '41' },
        { value: '285', label: '42' },
    ];

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLaengeSelect = (value: string) => {
        setForm({ ...form, laenge: value });
    };

    const [editingCardId, setEditingCardId] = useState<number | null>(null);

    const handleEditClick = (card: AuswahlCard) => {
        setForm({
            name: card.name,
            rohlingHersteller: card.rohlingHersteller,
            artikelHersteller: card.artikelHersteller,
            artNr: card.artNr,
            versorgung: card.versorgung,
            materialien: card.materialien,
            laenge: card.laenge,
            kategorie: card.kategorie,
        });
        setEditingCardId(card.id);
        setOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCardId !== null) {
            setCards(cards.map(card => card.id === editingCardId ? { ...card, ...form } : card));
            setEditingCardId(null);
        } else {
            setCards([
                ...cards,
                {
                    id: Date.now(),
                    ...form,
                },
            ]);
        }
        setForm({
            name: '', rohlingHersteller: '', artikelHersteller: '', artNr: '', versorgung: '', materialien: '', laenge: '', kategorie: '',
        });
        setOpen(false);
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setCardToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (cardToDelete !== null) {
            setCards(cards.filter(card => card.id !== cardToDelete));
        }
        setDeleteDialogOpen(false);
        setCardToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setCardToDelete(null);
    };

    const [selectedCategory, setSelectedCategory] = useState(filterCategories[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Filter cards based on selectedCategory
    const filteredCards = cards.filter(card => card.kategorie === selectedCategory);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className='flex flex-col gap-4 mt-10'>
            {/* Title with Down Arrow Dropdown */}
            <div className="relative flex items-center gap-2 mb-4 cursor-pointer select-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="text-2xl font-semibold">{selectedCategory}</span>
                <IoIosArrowDown className='text-2xl' />
                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 bg-white border rounded shadow-lg z-20 min-w-[200px]">
                        {filterCategories.map(category => (
                            <div
                                key={category}
                                className={`px-6 py-3 text-lg hover:bg-gray-100 ${category === selectedCategory ? 'font-semibold' : ''}`}
                                onClick={e => {
                                    e.stopPropagation();
                                    setSelectedCategory(category);
                                    setDropdownOpen(false);
                                }}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='relative px-4'>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {filteredCards.map((card, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2 flex flex-col items-center">
                                <div className='border border-gray-900 p-5 flex flex-col gap-1 rounded-xl min-h-[260px] w-full'>
                                    <h2 className='text-2xl font-bold mb-2'>{card.name}</h2>
                                    <div className='flex flex-col gap-3'>
                                        <p className='font-bold'>Hersteller: <span className='font-normal'>{card.rohlingHersteller}</span></p>
                                        <p className='font-bold'>Art. Nr.: <span className='font-normal'>{card.artNr}</span></p>
                                        <p className='font-bold'>Versorgung: <span className='font-normal'>{card.versorgung}</span></p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 mt-3 w-full items-center'>
                                    <button className='bg-black text-white px-6 py-2 rounded-full text-lg w-3/4 cursor-pointer' onClick={() => handleEditClick(card)}>Bearbeiten</button>
                                    <button className='underline text-black w-3/4 cursor-pointer' onClick={() => handleDeleteClick(card.id)}>Entfernen</button>
                                </div>
                            </div>
                        ))}
                        {/* Plus Card */}
                        <div className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2 flex items-center justify-center">
                            <button
                                onClick={() => setOpen(true)}
                                className="w-full cursor-pointer  h-full border-2 border-dashed border-gray-500 flex flex-col items-center justify-center rounded-lg min-h-[300px] hover:bg-gray-50 transition"
                                style={{ minHeight: '300px' }}
                            >
                                <Plus className="w-16 h-16 text-gray-500 border border-gray-500 rounded-full p-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={scrollPrev}
                    className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-2 transition-all duration-300 rounded-full shadow-lg hover:bg-gray-100 z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white transition-all duration-300 p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* Modal for adding new card */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Neue Versorgung hinzufügen</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                            placeholder="Name der Versorgung"
                            className="border p-2 rounded"
                            required
                        />
                        <div className="flex gap-2">
                            <input
                                name="rohlingHersteller"
                                value={form.rohlingHersteller}
                                onChange={handleFormChange}
                                placeholder="Rohling Hersteller"
                                className="border p-2 rounded w-1/2"
                                required
                            />
                            <input
                                name="artikelHersteller"
                                value={form.artikelHersteller}
                                onChange={handleFormChange}
                                placeholder="Artikelhersteller"
                                className="border p-2 rounded w-1/2"
                                required
                            />
                        </div>
                        <input
                            name="artNr"
                            value={form.artNr}
                            onChange={handleFormChange}
                            placeholder="Art. Nr."
                            className="border p-2 rounded"
                            required
                        />
                        <textarea
                            name="versorgung"
                            value={form.versorgung}
                            onChange={handleFormChange}
                            placeholder="Versorgung"
                            className="border p-2 rounded"
                            required
                        />
                        <textarea
                            name="materialien"
                            value={form.materialien}
                            onChange={handleFormChange}
                            placeholder="Materialien"
                            className="border p-2 rounded"
                            required
                        />
                        <div>
                            <div className='flex items-center gap-2'>
                                <label className="font-bold mb-1 block">Längenempfehlung</label>
                                <BsFillQuestionCircleFill className='text-gray-700' />
                            </div>
                            <div className="flex gap-2">
                                {laengen.map((l) => (
                                    <button
                                        type="button"
                                        key={l.value}
                                        className={`border cursor-pointer px-3 py-2 rounded ${form.laenge === l.value ? 'bg-black text-white' : ''}`}
                                        onClick={() => handleLaengeSelect(l.value)}
                                    >
                                        {l.value}
                                        <div className="text-xs text-gray-500">{l.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="font-bold mb-1 block">Kategorie</label>
                            <select
                                name="kategorie"
                                value={form.kategorie}
                                onChange={handleSelectChange}
                                className="border p-2 rounded w-full"
                                required
                            >
                                <option value="">Kategorie wählen</option>
                                {filterCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <DialogFooter>
                            <button type="submit" className="bg-black cursor-pointer text-white px-6 py-2 rounded-full text-lg">Abschließen</button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog for deletion */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Willst du wirklich diese Versorgung aus deinem Sortiment löschen?</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-4 justify-end mt-6">
                        <button onClick={handleConfirmDelete} className="bg-black text-white px-6 py-2 rounded-full">Ja</button>
                        <button onClick={handleCancelDelete} className="bg-gray-200 text-black px-6 py-2 rounded-full">Nein</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

