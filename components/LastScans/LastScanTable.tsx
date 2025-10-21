"use client";
import React from 'react'
import { getAllCustomers } from '@/apis/customerApis'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useRouter } from 'next/navigation';

interface LastScanRow {
    id: string;
    vorname: string;
    nachname: string;
    createdAt: string;
    wohnort: string;
    customerNumber: number | string;
    screenerFile?: any[];
    versorgungen?: any[];
}

export default function LastScanTable() {
    const router = useRouter();
    const [rows, setRows] = React.useState<LastScanRow[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [page, setPage] = React.useState<number>(1)
    const [limit] = React.useState<number>(10)
    const [totalPages, setTotalPages] = React.useState<number>(1)

    const load = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await getAllCustomers(page, limit)
            const data = res?.data ?? ([] as LastScanRow[])
            setRows(data)

            // Try to read pagination metadata if provided by API
            const meta = res?.pagination
            if (meta && typeof meta.totalPages === 'number') {
                setTotalPages(meta.totalPages)
            } else {
                // Fallback: estimate pages by presence of next/prev or data length
                if (Array.isArray(data)) {
                    setTotalPages(data.length < limit && page === 1 ? 1 : Math.max(1, page + (data.length === limit ? 1 : 0)))
                }
            }
        } catch (e) {
            // noop: show empty state silently for now
        } finally {
            setIsLoading(false)
        }
    }, [page, limit])

    React.useEffect(() => {
        load()
    }, [load])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    }


   
    const handleKundeninfoView = (id: string) => {
        router.push(`/dashboard/scanning-data/${id}?manageCustomer=true`);
    }
    const handleNeuerAuftrag = (id: string) => {
        router.push(`/dashboard/scanning-data/${id}`);
    }

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-2xl font-semibold">Aufträge</h1>
            </div>
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kunde</TableHead>
                            <TableHead>Kundennummer</TableHead>
                            <TableHead>Ort</TableHead>
                            <TableHead>Erstellt am</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div className="py-10 flex items-center justify-center gap-2 text-gray-500">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Laden...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div className="py-10 text-center text-gray-500">Keine Scandaten gefunden</div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium capitalize">{r.vorname} {r.nachname}</TableCell>
                                    <TableCell>{r.customerNumber}</TableCell>
                                    <TableCell>{r.wohnort}</TableCell>
                                    <TableCell>{formatDate(r.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            {(!r.screenerFile || r.screenerFile.length === 0) && (
                                                <button onClick={() => handleKundeninfoView(r.id)} className="border cursor-pointer px-3 py-1 rounded-md hover:bg-gray-50 transition-colors">
                                                    Kundenprofil
                                                </button>
                                            )}

                                            {r.screenerFile && r.screenerFile.length > 0 && (!r.versorgungen || r.versorgungen.length === 0) && (
                                                <button onClick={() => handleNeuerAuftrag(r.id)} className="bg-[#62A07C] cursor-pointer text-white px-3 py-1 rounded-md hover:bg-[#62a07c98] transition-colors">
                                                    Neuer Auftrag
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} href="#" />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).slice(0, 7).map((_, idx) => {
                            const pageNum = idx + 1
                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink href="#" isActive={pageNum === page} onClick={() => setPage(pageNum)}>
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })}

                        <PaginationItem>
                            <PaginationNext onClick={() => setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))} href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}
