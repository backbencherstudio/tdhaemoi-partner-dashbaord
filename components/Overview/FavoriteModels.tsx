'use client' 
import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import shoes from '@/public/images/Favorite/shoes.png'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface FavoriteModel {
    name: string
    value: number
    color: string
    image: StaticImageData
    id: number
    category: string
}

const data: FavoriteModel[] = [
    {
        id: 1,
        name: 'Dynafit',
        value: 100,
        color: '#000000',
        image: shoes,
        category: 'Laufschuhe - Herren',
    },
    {
        id: 2,
        name: 'Dynafit',
        value: 200,
        color: '#000000',
        image: shoes,
        category: 'Laufschuhe - Herren',
    },
    {
        id: 3,
        name: 'Dynafit',
        value: 300,
        color: '#000000',
        image: shoes,
        category: 'Laufschuhe - Herren',
    },
    {
        id: 4,
        name: 'Dynafit',
        value: 400,
        color: '#000000',
        image: shoes,
        category: 'Laufschuhe - Herren',
    },
]

const laufschuhOptions = [
    { id: 1, label: 'Alpines Skifahren' },
    { id: 2, label: 'Laufschuhe' },
    { id: 3, label: 'Radschuhe' },
    { id: 4, label: 'Tennisschuhe' },
    { id: 5, label: 'Basketball' },
    { id: 6, label: 'Kletterschuhe' },
    { id: 7, label: 'Fussballschuhe' },
    { id: 8, label: 'Schlittschuhe (Coming soon)' },
    { id: 9, label: 'Golfschuhe' },
]

const markenOptions = [
    { id: 1, label: 'Dynafit' },
    { id: 2, label: 'Nike' },
    { id: 3, label: 'Adidas' },
]

const geschaeftOptions = [
    { id: 1, label: 'Berlin Store' },
    { id: 2, label: 'Hamburg Store' },
    { id: 3, label: 'München Store' },
]

export default function FavoriteModels() {
    const [selectedLaufschuh, setSelectedLaufschuh] = useState('Laufschuh')
    const [selectedMarke, setSelectedMarke] = useState('Alle Marken')
    const [selectedStore, setSelectedStore] = useState('Im Geschäft')

    return (
        <div className="px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">Lieblingsmodelle</h1>

                <div className="flex flex-wrap gap-4 mb-6">
                    {/* Laufschuh dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 bg-white border rounded-full px-4 py-2">
                            {selectedLaufschuh}
                            <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {laufschuhOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.id}
                                    onClick={() => setSelectedLaufschuh(option.label)}
                                    className='cursor-pointer'
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Marken dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 bg-white border rounded-full px-4 py-2">
                            {selectedMarke}
                            <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {markenOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.id}
                                    onClick={() => setSelectedMarke(option.label)}
                                    className='cursor-pointer'
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Store dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 bg-white border rounded-full px-4 py-2">
                            {selectedStore}
                            <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {geschaeftOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.id}
                                    onClick={() => setSelectedStore(option.label)}
                                    className='cursor-pointer'
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-between">
                {data.map((model) => (
                    <div key={model.id} className="flex flex-col">
                        <div className="bg-gray-200 rounded-lg flex items-center justify-center p-1 mb-2">
                            <Image
                                src={model.image}
                                alt={model.name}
                                width={200}
                                height={120}
                                className="object-contain "
                            />
                        </div>
                        <h2 className="text-lg font-bold">{model.name}</h2>
                        <p className="text-sm text-gray-500">{model.category}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
