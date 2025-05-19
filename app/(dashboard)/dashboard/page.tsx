'use client'
import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'

// Weekly calendar data
const weeklyCalendar = [
    {
        day: 'Montag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MÜLLER' },
            { time: '13:30', title: 'FUSSANALYSE HERR BAUER' },
            { title: 'DRINGEND EINLAGE VERSENDEN', type: 'task' },
            { title: 'DRINGEND EINLAGE VERSENDEN', type: 'task' },
            { title: 'DRINGEND EINLAGE VERSENDEN', type: 'task' },
            { title: 'DRINGEND EINLAGE VERSENDEN', type: 'task' },
        ]
    },
    {
        day: 'Dienstag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MÜLLER' },
            { time: '15:20', title: 'LAUFANALYSE HERR HARTMANN' }
        ]
    },
    {
        day: 'Mittwoch',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MÜLLER' },
            { time: '15:20', title: 'LAUFANALYSE HERR HARTMANN' }
        ]
    },
    {
        day: 'Donnerstag',
        appointments: [
            { time: '13:30', title: 'MEETING HERR MUSTERMANN' }
        ]
    },
    {
        day: 'Freitag',
        appointments: []
    },
    {
        day: 'Samstag',
        appointments: []
    },
    {
        day: 'Sonntag',
        appointments: []
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
                                <div className="border rounded-lg p-4 h-full">
                                    <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-2 rounded">{day.day}</h2>
                                    <div className="space-y-3">
                                        {day.appointments.map((apt, aptIndex) => (
                                            <div
                                                key={aptIndex}
                                                className={`p-2 rounded ${apt.type === 'task' ? 'bg-green-100' : 'bg-blue-100'}`}
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
        </div>
    )
}
