'use client'

import React, { useState, useRef } from 'react'
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
import { IoSearch } from 'react-icons/io5'
import { Input } from '@/components/ui/input'
import LagerChart from '@/components/LagerChart/LagerChart'
import ProductManagementTable from '../_components/Product/ProductManagementTable'
import AddProduct from '../_components/Product/AddProduct'
import DeliveryNote from '../_components/Product/DeliveryNote'
import InventoryHistory, { InventoryHistoryRef } from '../_components/Product/InventoryHistory'

interface Product {
    id: number
    Produktname: string
    Produktkürzel: string
    Hersteller: string
    Lagerort: string
    minStockLevel: number
    sizeQuantities: { [key: string]: number }
    inventoryHistory: Array<{
        id: string
        date: string
        type: 'delivery' | 'sale' | 'correction' | 'transfer'
        quantity: number
        size: string
        previousStock: number
        newStock: number
        user: string
        notes: string
    }>
}

// Define the size columns
const sizeColumns = [
    "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49"
];

export default function Lager() {
    // Pagination state
    const [itemsPerPage, setItemsPerPage] = useState(2)
    const [currentPage, setCurrentPage] = useState(1)
    const [showPagination, setShowPagination] = useState(false)

    // Product data state
    const [productsData, setProductsData] = useState<Product[]>(products as Product[])

    // Table editing state
    const [editingCell, setEditingCell] = useState<{ productId: number; field: string; size?: string } | null>(null)
    const [editValue, setEditValue] = useState('')

    // Component refs
    const inventoryHistoryRef = useRef<InventoryHistoryRef>(null)

    // Chart data
    const chartData = [
        { year: '2020', Einkaufspreis: 50000, Verkaufspreis: 75000, Gewinn: 25000 },
        { year: '2021', Einkaufspreis: 60000, Verkaufspreis: 90000, Gewinn: 30000 },
        { year: '2022', Einkaufspreis: 70000, Verkaufspreis: 105000, Gewinn: 35000 },
        { year: '2023', Einkaufspreis: 80000, Verkaufspreis: 120000, Gewinn: 40000 },
        { year: '2024', Einkaufspreis: 90000, Verkaufspreis: 135000, Gewinn: 45000 }
    ];

    // Pagination calculations
    const totalPages = Math.ceil(productsData.length / 10)
    const startIndex = showPagination ? (currentPage - 1) * 10 : 0
    const visibleProducts = showPagination
        ? productsData.slice(startIndex, startIndex + 10)
        : productsData.slice(0, itemsPerPage)

    // Pagination handlers
    const handleShowMore = () => {
        setItemsPerPage(10)
        setShowPagination(true)
    }

    // Stock level helpers
    const hasLowStock = (product: Product) => {
        return Object.entries(product.sizeQuantities).some(([size, quantity]) =>
            quantity <= product.minStockLevel && quantity > 0
        );
    }

    const getLowStockSizes = (product: Product) => {
        return Object.entries(product.sizeQuantities)
            .filter(([size, quantity]) => quantity <= product.minStockLevel && quantity > 0)
            .map(([size, quantity]) => ({ size, quantity }));
    }

    // Table editing handlers
    const handleCellEdit = (productId: number, field: string, size?: string) => {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;

        let currentValue = '';
        if (field === 'sizeQuantity' && size) {
            currentValue = product.sizeQuantities[size]?.toString() || '0';
        } else {
            currentValue = product[field as keyof Product]?.toString() || '';
        }

        setEditingCell({ productId, field, size });
        setEditValue(currentValue);
    };

    const handleSaveEdit = () => {
        if (!editingCell) return;

        const { productId, field, size } = editingCell;
        const newValue = field === 'sizeQuantity' ? parseInt(editValue) || 0 : editValue;

        setProductsData(prev => prev.map(product => {
            if (product.id === productId) {
                if (field === 'sizeQuantity' && size) {
                    const previousStock = product.sizeQuantities[size] || 0;
                    const newStock = newValue as number;

                    // Add to inventory history
                    const historyEntry: Product['inventoryHistory'][0] = {
                        id: `hist_${Date.now()}`,
                        date: new Date().toISOString(),
                        type: newStock > previousStock ? 'delivery' : 'correction',
                        quantity: newStock - previousStock,
                        size,
                        previousStock,
                        newStock,
                        user: 'admin',
                        notes: 'Manual stock update'
                    };

                    return {
                        ...product,
                        sizeQuantities: {
                            ...product.sizeQuantities,
                            [size]: newStock
                        },
                        inventoryHistory: [...product.inventoryHistory, historyEntry]
                    };
                } else {
                    return {
                        ...product,
                        [field]: newValue
                    };
                }
            }
            return product;
        }));

        setEditingCell(null);
        setEditValue('');
    };

    const handleCancelEdit = () => {
        setEditingCell(null);
        setEditValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    // History handler
    const showHistory = (product: Product) => {
        if (inventoryHistoryRef.current) {
            inventoryHistoryRef.current.showHistory(product);
        }
    };

    // Lagerort change handler
    const handleLagerortChange = (productId: number, newLagerort: string) => {
        setProductsData(prev => prev.map(product =>
            product.id === productId ? { ...product, Lagerort: newLagerort } : product
        ));
    };

    // Add product handler
    const handleAddProduct = (newProduct: any) => {
        const id = Math.max(0, ...productsData.map(p => p.id)) + 1;
        setProductsData(prev => [
            ...prev,
            {
                id,
                ...newProduct,
                inventoryHistory: [{
                    id: `hist_${Date.now()}`,
                    date: new Date().toISOString(),
                    type: 'delivery',
                    quantity: Object.values(newProduct.sizeQuantities).reduce((sum: number, qty) => sum + Number(qty), 0),
                    size: 'multiple',
                    previousStock: 0,
                    newStock: Object.values(newProduct.sizeQuantities).reduce((sum: number, qty) => sum + Number(qty), 0),
                    user: 'admin',
                    notes: 'Manuell hinzugefügt'
                }]
            }
        ]);
    };

    return (
        <div className="w-full px-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between mb-10">
                <h1 className='text-2xl font-semibold'>Produktverwaltung</h1>

                <div className="flex items-center gap-4">
                    <DeliveryNote
                        productsData={productsData}
                        onDeliveryNoteAdd={setProductsData}
                    />

                    <div className="relative w-64">
                        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                        <Input
                            placeholder="Search"
                            className="pl-10 pr-4 py-2 w-full rounded-full bg-white text-gray-700 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Section Title */}
            <div className='flex items-center justify-between mb-4'>
                <h2 className="text-2xl font-semibold">Einlagenrohlinge</h2>
                {/* Add Product Component */}
                <AddProduct
                    onAddProduct={handleAddProduct}
                    sizeColumns={sizeColumns}
                />
            </div>



            {/* Product Management Table */}
            <ProductManagementTable
                visibleProducts={visibleProducts}
                sizeColumns={sizeColumns}
                editingCell={editingCell}
                editValue={editValue}
                onCellEdit={handleCellEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onKeyPress={handleKeyPress}
                onEditValueChange={setEditValue}
                onShowHistory={showHistory}
                hasLowStock={hasLowStock}
                getLowStockSizes={getLowStockSizes}
                onLagerortChange={handleLagerortChange}
            />

            {/* Pagination */}
            <div className="mt-6">
                {!showPagination && itemsPerPage < productsData.length && (
                    <div className="flex justify-center">
                        <Button
                            onClick={handleShowMore}
                            variant="outline"
                            size="lg"
                            className="px-8 py-3 cursor-pointer"
                        >
                            Mehr anzeigen
                        </Button>
                    </div>
                )}

                {showPagination && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Zeige:</span>
                            <Select
                                value="10"
                                onValueChange={(value) => {
                                    const numValue = parseInt(value);
                                    setItemsPerPage(numValue);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-600">von {productsData.length} Produkten</span>
                        </div>

                        <div className="flex items-center gap-2">
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

                        <div className="text-sm text-gray-600">
                            Seite {currentPage} von {totalPages}
                        </div>
                    </div>
                )}
            </div>

            {/* Inventory History Component */}
            <InventoryHistory
                ref={inventoryHistoryRef}
                productsData={productsData}
            />

            {/* Chart */}
            <LagerChart data={chartData} />
        </div>
    )
}
