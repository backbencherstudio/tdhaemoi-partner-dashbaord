import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import legsImg from '@/public/Kunden/legs.png'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LastScan {
    id: number;
    nameKunde: string;
    createdAt: string;
    Geschäftstandort: string;
}


export default function LastScans() {
    const [lastScans, setLastScans] = useState([]);
        const router = useRouter();


    // Fetch customer data
    useEffect(() => {
        fetchLastScans();
    }, []);

    const fetchLastScans = async () => {
        try {
            const response = await fetch('/data/userData.json');
            const data = await response.json();
            setLastScans(data);
        } catch (error) {
            console.error('Error fetching last scans:', error);
        }
    };


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
                    <div className="flex">
                        {lastScans.map((scan: LastScan, index: number) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2">
                                <div key={scan.id} className='border-2 border-gray-200 p-3 flex flex-col gap-1'>
                                    <div className='flex justify-center items-center'>
                                        <Image src={legsImg} alt='legs' className='w-48 h-48' />
                                    </div>
                                    <h2 className='text-xl font-semibold'>{scan.nameKunde}</h2>
                                    <p>Erstellt am: {scan.createdAt}</p>
                                    <p>Ort: {scan.Geschäftstandort}</p>

                                    <div className='flex flex-col gap-2 z-50'>
                                        <button onClick={() => handleScanView(scan.id)} className='bg-[#62A07C] cursor-pointer text-white px-4 py-2 rounded-md'>Scansadas ansehen</button>
                                        <button className='bg-[#62A07C] text-white px-4 py-2 rounded-md'>Kundeninfo</button>
                                    </div>
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
