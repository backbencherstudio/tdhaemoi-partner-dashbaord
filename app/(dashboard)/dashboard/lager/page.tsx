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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { IoIosArrowDown } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import { IoCamera } from 'react-icons/io5'
import { Input } from '@/components/ui/input'
import LagerChart from '@/components/LagerChart/LagerChart'
import ProductManagementTable from '../_components/Product/ProductManagementTable'

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

interface EditableProduct extends Product {
    isEditing?: boolean
    originalData?: Product
}

export default function Lager() {
    const [itemsPerPage, setItemsPerPage] = useState(2)
    const [currentPage, setCurrentPage] = useState(1)
    const [showPagination, setShowPagination] = useState(false)
    const [productsData, setProductsData] = useState<EditableProduct[]>(products as Product[])
    const [editingCell, setEditingCell] = useState<{ productId: number; field: string; size?: string } | null>(null)
    const [editValue, setEditValue] = useState('')
    const [showHistoryDialog, setShowHistoryDialog] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [showScanDialog, setShowScanDialog] = useState(false)
    const [scannedData, setScannedData] = useState<{
        productName: string;
        manufacturer: string;
        articleNumber: string;
        sizeQuantities: { [key: string]: number };
        deliveryDate: string;
        supplier: string;
    } | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const chartData = [
        { year: '2020', Einkaufspreis: 50000, Verkaufspreis: 75000, Gewinn: 25000 },
        { year: '2021', Einkaufspreis: 60000, Verkaufspreis: 90000, Gewinn: 30000 },
        { year: '2022', Einkaufspreis: 70000, Verkaufspreis: 105000, Gewinn: 35000 },
        { year: '2023', Einkaufspreis: 80000, Verkaufspreis: 120000, Gewinn: 40000 },
        { year: '2024', Einkaufspreis: 90000, Verkaufspreis: 135000, Gewinn: 45000 }
    ];

    const totalPages = Math.ceil(productsData.length / 10)
    const startIndex = showPagination
        ? (currentPage - 1) * 10
        : 0

    const visibleProducts = showPagination
        ? productsData.slice(startIndex, startIndex + 10)
        : productsData.slice(0, itemsPerPage)

    const handleShowMore = () => {
        setItemsPerPage(10)
        setShowPagination(true)
    }

    // Define the size columns you want to show
    const sizeColumns = [
        "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49"
    ];

    // Check if product has low stock for any size
    function hasLowStock(product: Product) {
        return Object.entries(product.sizeQuantities).some(([size, quantity]) =>
            quantity <= product.minStockLevel && quantity > 0
        );
    }

    // Get low stock sizes for a product
    function getLowStockSizes(product: Product) {
        return Object.entries(product.sizeQuantities)
            .filter(([size, quantity]) => quantity <= product.minStockLevel && quantity > 0)
            .map(([size, quantity]) => ({ size, quantity }));
    }

    // Handle cell editing
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

    // Handle save edit
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

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingCell(null);
        setEditValue('');
    };

    // Handle key press in edit mode
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    // Show inventory history
    const showHistory = (product: Product) => {
        setSelectedProduct(product);
        setShowHistoryDialog(true);
    };

    // Handle delivery note scan
    const handleScanDeliveryNote = () => {
        setShowScanDialog(true);
        setScannedData(null);
    };

    // Simulate OCR processing
    const processDeliveryNote = (file: File) => {
        setIsProcessing(true);

        // Simulate OCR processing delay
        setTimeout(() => {
            // Mock extracted data - in real implementation, this would come from OCR/AI
            const mockExtractedData = {
                productName: "New Balance 580",
                manufacturer: "New Balance",
                articleNumber: "NB-580-2024",
                sizeQuantities: {
                    "40": 15,
                    "41": 12,
                    "42": 18,
                    "43": 20,
                    "44": 16
                },
                deliveryDate: new Date().toISOString(),
                supplier: "Sportswear GmbH"
            };

            setScannedData(mockExtractedData);
            setIsProcessing(false);
        }, 3000);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processDeliveryNote(file);
        }
    };

    // Find matching product
    const findMatchingProduct = (articleNumber: string) => {
        return productsData.find(product =>
            product.Produktkürzel.toLowerCase().includes(articleNumber.toLowerCase()) ||
            product.Produktname.toLowerCase().includes(articleNumber.toLowerCase())
        );
    };

    // Apply scanned data to existing product
    const applyToExistingProduct = (product: Product, scannedData: any) => {
        setProductsData(prev => prev.map(p => {
            if (p.id === product.id) {
                const updatedSizeQuantities = { ...p.sizeQuantities };

                // Update quantities for each size
                Object.entries(scannedData.sizeQuantities).forEach(([size, quantity]) => {
                    const currentQuantity = updatedSizeQuantities[size] || 0;
                    const newQuantity = currentQuantity + (quantity as number);
                    updatedSizeQuantities[size] = newQuantity;
                });

                // Add to inventory history
                const historyEntry: Product['inventoryHistory'][0] = {
                    id: `hist_${Date.now()}`,
                    date: new Date().toISOString(),
                    type: 'delivery',
                    quantity: Object.values(scannedData.sizeQuantities).reduce((sum: number, qty: any) => sum + qty, 0),
                    size: 'multiple',
                    previousStock: Object.values(p.sizeQuantities).reduce((sum: number, qty: number) => sum + qty, 0),
                    newStock: Object.values(updatedSizeQuantities).reduce((sum: number, qty: number) => sum + qty, 0),
                    user: 'admin',
                    notes: `Delivery note scan: ${scannedData.supplier}`
                };

                return {
                    ...p,
                    sizeQuantities: updatedSizeQuantities,
                    inventoryHistory: [...p.inventoryHistory, historyEntry]
                };
            }
            return p;
        }));
    };

    // Create new product from scanned data
    const createNewProduct = (scannedData: any) => {
        const newProduct: Product = {
            id: Math.max(...productsData.map(p => p.id)) + 1,
            Produktname: scannedData.productName,
            Produktkürzel: scannedData.articleNumber,
            Hersteller: scannedData.manufacturer,
            Lagerort: "Neues Lager",
            minStockLevel: 10,
            sizeQuantities: scannedData.sizeQuantities,
            inventoryHistory: [{
                id: `hist_${Date.now()}`,
                date: new Date().toISOString(),
                type: 'delivery',
                quantity: Object.values(scannedData.sizeQuantities).reduce((sum: number, qty: any) => sum + qty, 0),
                size: 'multiple',
                previousStock: 0,
                newStock: Object.values(scannedData.sizeQuantities).reduce((sum: number, qty: any) => sum + qty, 0),
                user: 'admin',
                notes: `Initial delivery from scan: ${scannedData.supplier}`
            }]
        };

        setProductsData(prev => [...prev, newProduct]);
    };



    return (
        <div className="w-full px-5">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between mb-10">
                <h1 className='text-2xl font-semibold'>Produktverwaltung</h1>

                <div className="flex items-center gap-4">
                    {/* Scan Delivery Note Button */}
                    <Button
                        onClick={handleScanDeliveryNote}
                        className="bg-[#61A178] hover:bg-[#61A178]/80 text-white cursor-pointer"
                    >
                        <IoCamera className="" />
                        Lieferschein scannen
                    </Button>

                    {/* Search Bar */}
                    <div className="relative w-64">
                        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                        <Input
                            placeholder="Search"
                            className="pl-10 pr-4 py-2 w-full rounded-full bg-white text-gray-700 placeholder:text-gray-500 border border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-between'>
                <div >
                    <h1 className="text-2xl font-semibold">Einlagenrohlinge</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='bg-[#61A178] px-4 py-2 rounded-md hover:bg-[#61A178]/80 text-white cursor-pointer transition-all duration-300'>Add Product</button>

                </div>
            </div>

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
            />

            {/* Simple Pagination System - First Show More, Then Full Pagination */}
            <div className="mt-6">
                {/* Step 1: Show More Button */}
                {!showPagination && itemsPerPage < productsData.length && (
                    <div className="flex justify-center">
                        <Button
                            onClick={handleShowMore}
                            variant="outline"
                            size="lg"
                            className="px-8 py-3"
                        >
                            Mehr anzeigen
                        </Button>
                    </div>
                )}

                {/* Step 2: Full Pagination System */}
                {showPagination && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Items per page selector */}
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

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {/* Page Numbers */}
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

                        {/* Page info */}
                        <div className="text-sm text-gray-600">
                            Seite {currentPage} von {totalPages}
                        </div>
                    </div>
                )}
            </div>

            {/* Scan Delivery Note Dialog */}
            <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Lieferschein scannen</DialogTitle>
                    </DialogHeader>

                    {!scannedData && !isProcessing && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <IoCamera className="mx-auto text-6xl text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-4">
                                    Laden Sie ein Foto des Lieferscheins hoch oder nehmen Sie eines auf
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full"
                                >
                                    Foto auswählen
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Was wird extrahiert:</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Produktname</li>
                                    <li>• Hersteller</li>
                                    <li>• Artikelnummer</li>
                                    <li>• Größen-spezifische Mengen</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Lieferschein wird verarbeitet...</p>
                            <p className="text-sm text-gray-500 mt-2">OCR und KI-Analyse läuft</p>
                        </div>
                    )}

                    {scannedData && !isProcessing && (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-medium text-green-900 mb-2">✅ Erfolgreich extrahiert!</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <strong>Produkt:</strong> {scannedData.productName}
                                    </div>
                                    <div>
                                        <strong>Hersteller:</strong> {scannedData.manufacturer}
                                    </div>
                                    <div>
                                        <strong>Artikelnummer:</strong> {scannedData.articleNumber}
                                    </div>
                                    <div>
                                        <strong>Lieferant:</strong> {scannedData.supplier}
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <strong>Größen und Mengen:</strong>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {Object.entries(scannedData.sizeQuantities).map(([size, quantity]) => (
                                            <span key={size} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                                {size}: {quantity} Stück
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {(() => {
                                const matchingProduct = findMatchingProduct(scannedData.articleNumber);
                                return (
                                    <div className="space-y-3">
                                        {matchingProduct ? (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">🔄 Passendes Produkt gefunden!</h4>
                                                <p className="text-sm text-blue-800 mb-3">
                                                    "{matchingProduct.Produktname}" wird mit den neuen Mengen aktualisiert.
                                                </p>
                                                <Button
                                                    onClick={() => {
                                                        applyToExistingProduct(matchingProduct, scannedData);
                                                        setShowScanDialog(false);
                                                        setScannedData(null);
                                                    }}
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Mengen hinzufügen
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <h4 className="font-medium text-yellow-900 mb-2">🆕 Neues Produkt</h4>
                                                <p className="text-sm text-yellow-800 mb-3">
                                                    Kein passendes Produkt gefunden. Möchten Sie ein neues Produkt erstellen?
                                                </p>
                                                <Button
                                                    onClick={() => {
                                                        createNewProduct(scannedData);
                                                        setShowScanDialog(false);
                                                        setScannedData(null);
                                                    }}
                                                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                                                >
                                                    Neues Produkt erstellen
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Inventory History Dialog */}
            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Lagerhistorie: {selectedProduct?.Produktname}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Artikelnummer:</strong> {selectedProduct.Produktkürzel}
                                </div>
                                <div>
                                    <strong>Hersteller:</strong> {selectedProduct.Hersteller}
                                </div>
                                <div>
                                    <strong>Lagerort:</strong> {selectedProduct.Lagerort}
                                </div>
                                <div>
                                    <strong>Mindestbestand:</strong> {selectedProduct.minStockLevel}
                                </div>
                            </div>

                            <div className="border rounded-lg">
                                <div className="bg-gray-50 p-3 font-semibold border-b">
                                    Bewegungsverlauf
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {selectedProduct.inventoryHistory.length > 0 ? (
                                        selectedProduct.inventoryHistory
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .map((entry) => (
                                                <div key={entry.id} className="p-3 border-b last:border-b-0">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${entry.type === 'delivery' ? 'bg-green-100 text-green-800' :
                                                                    entry.type === 'sale' ? 'bg-red-100 text-red-800' :
                                                                        entry.type === 'correction' ? 'bg-blue-100 text-blue-800' :
                                                                            'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {entry.type === 'delivery' ? 'Lieferung' :
                                                                        entry.type === 'sale' ? 'Verkauf' :
                                                                            entry.type === 'correction' ? 'Korrektur' : 'Transfer'}
                                                                </span>
                                                                <span className="font-medium">
                                                                    Größe {entry.size}: {entry.quantity > 0 ? '+' : ''}{entry.quantity}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {entry.notes}
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-sm text-gray-500">
                                                            <div>{new Date(entry.date).toLocaleDateString('de-DE')}</div>
                                                            <div>{new Date(entry.date).toLocaleTimeString('de-DE')}</div>
                                                            <div>von {entry.user}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            Keine Bewegungen vorhanden
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>



            {/* Lager Chart */}
            <LagerChart data={chartData} />
        </div>
    )
}
