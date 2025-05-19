'use client'
import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import dashboard from '@/public/images/dashboard/dashbord.png'
import users from '@/public/images/dashboard/user.png'
import date from '@/public/images/dashboard/date.png'
import settings from '@/public/images/dashboard/settings.png'
import home from '@/public/images/dashboard/home.png'
import Image from 'next/image';
import Link from 'next/link'

// Add type definition
type Appointment = {
    time?: string;
    title: string;
    userType?: 'user' | 'other';
}

// Weekly calendar data
const weeklyCalendar: { day: string; appointments: Appointment[] }[] = [
    {
        day: 'Montag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MÜLLER', userType: 'other' },
            { time: '13:30', title: 'FUSSANALYSE HERR BAUER', userType: 'user' },
            { title: 'DRINGEND EINLAGE VERSENDEN', userType: 'user' },

        ]
    },
    {
        day: 'Dienstag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MÜLLER', userType: 'other' },
            { time: '15:20', title: 'LAUFANALYSE HERR HARTMANN', userType: 'user' }
        ]
    },
    {
        day: 'Mittwoch',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MÜLLER', userType: 'other' },
            { time: '15:20', title: 'LAUFANALYSE HERR HARTMANN', userType: 'user' }
        ]
    },
    {
        day: 'Donnerstag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MUSTERMANN', userType: 'other' }
        ]
    },
    {
        day: 'Freitag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MUSTERMANN', userType: 'other' }
        ]
    },
    {
        day: 'Samstag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MUSTERMANN', userType: 'other' }
        ]
    },
    {
        day: 'Sonntag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MUSTERMANN', userType: 'other' }
        ]
    }
]

export default function Dashboard() {
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

    return (
        <div className='p-4'>
            <div className='flex flex-col gap-3 mb-6'>
                <h1 className='text-3xl font-bold'>WELCOME BACK ORTHOPÄDIE PUTZER</h1>
                <p className='text-lg text-gray-500'>Dienstag, 18. Februar 2025</p>
            </div>

            <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {weeklyCalendar.map((day, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2">
                                <div className="border rounded-[20px] p-4 h-[400px] flex flex-col">
                                    <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-2 rounded">{day.day}</h2>
                                    <div className="space-y-3 overflow-y-auto flex-1">
                                        {day.appointments.map((apt, aptIndex) => (
                                            <div
                                                key={aptIndex}
                                                className={`p-2 rounded ${apt.userType === 'user'
                                                    ? 'bg-black text-white'
                                                    : 'bg-[#62A07B] text-white'
                                                    }`}
                                            >
                                                {apt.time && <span className="font-medium">{apt.time}</span>}
                                                <p className="font-medium">{apt.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={scrollPrev}
                    className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-2 transition-all duration-300 rounded-full shadow-lg hover:bg-gray-100 z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white transition-all duration-300 p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* Navigation Links */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center  w-full mt-10'>
                <Link href="/dashboard/overview" className="flex flex-col items-center text-center">
                    <div className=" bg-white px-5 border border-gray-400 rounded-[40px] shadow-md hover:shadow-lg transition-all mb-2 hover:bg-gray-200  duration-300">
                        <Image src={dashboard} alt='dashboard' width={100} height={100} className='w-[130px] h-[130px]' />
                    </div>
                    <span className="text-md font-semibold">IHR ÜBERBLICK</span>
                </Link>

                <Link href="/customers" className="flex flex-col items-center text-center">
                    <div className=" bg-white transition-all duration-300 hover:bg-gray-200 px-5 border border-gray-400 rounded-[40px] shadow-md hover:shadow-lg mb-2 ">
                        <Image src={users} alt='users' width={200} height={200} className='w-[130px] h-[130px] p-7' />

                    </div>
                    <span className="text-md font-semibold">KUNDENSUCHE</span>
                </Link>

                <Link href="/calendar" className="flex flex-col items-center text-center">
                    <div className=" bg-white transition-all duration-300 hover:bg-gray-200 px-5 border border-gray-400 rounded-[40px] shadow-md hover:shadow-lg mb-2 ">
                        <Image src={date} alt='calendar' width={100} height={100} className='w-[130px] h-[130px] p-7' />

                    </div>
                    <span className="text-md font-semibold">TERMINKALENDER</span>
                </Link>

                <Link href="/settings" className="flex flex-col items-center text-center">
                    <div className=" bg-white transition-all duration-300 hover:bg-gray-200 px-5 border border-gray-400 rounded-[40px] shadow-md hover:shadow-lg mb-2 ">
                        <Image src={settings} alt='settings' width={100} height={100} className='w-[130px] h-[130px] p-7' />

                    </div>
                    <span className="text-md font-semibold">EINSTELLUNGEN</span>
                </Link>

                <Link href="/products" className="flex flex-col items-center text-center">
                    <div className=" bg-white transition-all duration-300 hover:bg-gray-200 px-5 border border-gray-400 rounded-[40px] shadow-md hover:shadow-lg mb-2 ">
                        <Image src={home} alt='products' width={100} height={100} className='w-[130px] h-[130px] p-7' />

                    </div>
                    <span className="text-md font-semibold">PRODUKTVERWALTUNG</span>
                </Link>
            </div>
        </div>
    )
}
