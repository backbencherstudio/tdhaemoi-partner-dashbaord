'use client'

import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import products from '@/public/data/products.json'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { IoIosArrowDown } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import { Input } from '@/components/ui/input'
import LagerChart from '@/components/LagerChart/LagerChart'

export default function Lager() {
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)
    const [showPagination, setShowPagination] = useState(false)

    const totalPages = Math.ceil(products.length / 10)
    const startIndex = showPagination
        ? (currentPage - 1) * 10
        : 0

    const visibleProducts = showPagination
        ? products.slice(startIndex, startIndex + 10)
        : products.slice(0, itemsPerPage)

    const handleShowMore = () => {
        setItemsPerPage(20)
        setShowPagination(true)
    }

    return (
        <div className="w-full px-5 ">

            <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between mb-10">
                <h1 className='text-2xl font-semibold'>Produktverwaltung</h1>

                {/* Right Side: Search Bar */}
                <div className="relative w-64">
                    <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                    <Input
                        placeholder="Search"
                        className="pl-10 pr-4 py-2 w-full rounded-full bg-white text-gray-700 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                    />
                </div>
            </div>


            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">Laufschuhe</h1>
                <IoIosArrowDown className="text-2xl" />
            </div>

            <Table className='border-2 border-gray-500 rounded-lg mt-5'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="border-2 border-gray-500 p-2">Produktname</TableHead>
                        <TableHead className="border-2 border-gray-500 p-2">Produktkürzel</TableHead>
                        <TableHead className="border-2 border-gray-500 p-2">Schuhgröße</TableHead>
                        <TableHead className="border-2 border-gray-500 p-2">Lagerort</TableHead>
                        <TableHead className="border-2 border-gray-500 p-2">Stückzahl auf Lager</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visibleProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="border-2 border-gray-500 p-2">{product.Produktname}</TableCell>
                            <TableCell className="border-2 border-gray-500 p-2">{product.Produktkürzel}</TableCell>
                            <TableCell className="border-2 border-gray-500 p-2">
                                <Select>
                                    <SelectTrigger className="w-24">
                                        <SelectValue placeholder="Größe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {product.Schuhgröße.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="border-2 border-gray-500 p-2">
                                <Select>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder={product.Lagerort} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="alle" className="border-2 border-gray-500 p-2">Alle Lagerorte</SelectItem>
                                        <SelectItem value="lager1">Lager 1</SelectItem>
                                        <SelectItem value="lager2">Lager 2</SelectItem>
                                        <SelectItem value="lager3">Lager 3</SelectItem>
                                        <SelectItem value="lager4">Lager 4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="border-2 border-gray-500 p-2">{product.StückzahlAufLager}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {!showPagination && itemsPerPage < products.length && (
                <div className="mt-4 flex justify-center">
                    <Button
                        onClick={handleShowMore}
                        variant="outline"
                    >
                        Mehr anzeigen
                    </Button>
                </div>
            )}

            {showPagination && (
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={currentPage === page}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}



            {/* Lager Chart */}
            <LagerChart />
        </div>
    )
}
