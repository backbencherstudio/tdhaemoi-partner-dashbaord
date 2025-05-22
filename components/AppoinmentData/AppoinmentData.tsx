'use client'
import React, { useState } from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"

const eventData = [
    {
        id: 1,
        date: '2025-05-18',
        time: '9:30',
        title: 'MEETING HERR MÜLLER',
        subtitle: 'ABFLUGTERMIN HERR BAUER',
        type: 'others'
    },
    {
        id: 2,
        date: '2025-05-19',
        time: '9:30',
        title: 'MEETING HERR MÜLLER',
        subtitle: 'ABFLUGTERMIN HERR BAUER',
        type: 'user'
    },
    {
        id: 3,
        date: '2025-05-22',
        time: '7:40',
        title: 'FUSSANALYSE HERR MUSTERMANN',
        subtitle: 'LAUFANALYSE FRAU MEYER',
        type: 'others'
    }
]

export default function AppoinmentData() {
    const events = eventData;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    
    const totalPages = Math.ceil(events.length / itemsPerPage);
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const formatDay = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate();
    };

    return (
        <div className="space-y-4">
            <h1 className='text-2xl font-bold'>Wichtige Ereignisse</h1>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-black rounded"></div>
                    <span>Kundentermine</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#62A07C] rounded"></div>
                    <span>Anderes</span>
                </div>
            </div>

            <div className="space-y-4">
                {currentEvents.map((event, index) => (
                    <div key={`${event.id}-${index}`} className="flex items-center gap-4">
                        <div className={`w-24 h-24 rounded-lg flex items-center justify-center text-white text-2xl font-bold ${event.type === 'user' ? 'bg-black' : 'bg-[#62A07C]'}`}>
                            {formatDay(event.date)}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold">{event.title}</div>
                            {event.time && <div>
                                <p className='text-sm font-semibold mt-2 text-gray-500 uppercase'>{event.date.split('-')[2]}/{event.date.split('-')[1]}/{event.date.split('-')[0].slice(2)}, {event.time}</p>
                            </div>}
                            {/* {event.subtitle && <div>{event.subtitle}</div>} */}
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
                            </PaginationItem>
                        )}

                        {Array.from({ length: totalPages }).map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => paginate(index + 1)}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext onClick={() => paginate(currentPage + 1)} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}
