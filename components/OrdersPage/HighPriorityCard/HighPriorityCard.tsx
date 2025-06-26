'use client'

import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GoArrowLeft } from "react-icons/go";
import legImg1 from '@/public/images/order/1.png'
import legImg2 from '@/public/images/order/2.png'


const CardData = [
    {
        id: 1,
        productName: 'Alltagseinlage',
        image: legImg1,
        customerName: 'Brugger Theo',
        bestellnr: '#121212',
        deliveryDate: '22.02.2026',
        status: 'Einlage vorbereiten',
        statusColor: 'bg-[#FF0000]',
    },
    {
        id: 2,
        productName: 'Sporteinlage',
        customerName: 'Kühnis',
        image: legImg2,
        bestellnr: '#156875565F',
        deliveryDate: '22.02.2026',
        status: 'Einlage in Fertigung',
        statusColor: 'bg-[#FFA617]',
    },
    {
        id: 3,
        productName: 'Businesseinlage',
        customerName: 'Kühnis',
        image: legImg1,
        bestellnr: '#156875565',
        deliveryDate: '10.02.2025',
        status: 'Einlage verpacken',
        statusColor: 'bg-[#96F30080]/50',
    }
]


export default function HighPriorityCard() {
    const router = useRouter();

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



    // handle scan view function
    const handleScanView = (id: number) => {
        router.push(`/dashboard/scanning-data/${id}`);
    }

    return (

        <div className='flex flex-col gap-4 mt-10'>
            <h1 className='text-2xl font-bold'>Ihre Letzten Scans</h1>
            <div className='relative px-4'>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex justify-center">
                        {CardData.map((card, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2">
                                <div className='border-2 border-gray-200 p-3 flex flex-col gap-2 '>
                                    <div className='flex justify-center items-center'>
                                        <Image src={card.image} alt='legs' className='w-48 h-48' />
                                    </div>
                                    <h2 className='text-xl font-semibold'>{card.productName}</h2>
                                    <p>{card.customerName}</p>
                                    <p><span className='font-bold'>Bestellnr:</span> {card.bestellnr}</p>
                                    <p><span className='font-bold'>Liefertermin:</span> {card.deliveryDate}</p>
                                    <button className='border cursor-pointer px-2 py-2 rounded-md text-xs mt-2 flex items-center gap-2 justify-center hover:bg-gray-100 transform duration-300'>
                                        <GoArrowLeft />
                                        Nächster Schritt
                                    </button>
                                    <button className={`${card.statusColor} px-2 py-2 rounded-md text-xs flex items-center gap-2 justify-center`}>
                                        {card.status}
                                    </button>
                                </div>
                            </div>
                        ))}
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
        </div>

    )
}
