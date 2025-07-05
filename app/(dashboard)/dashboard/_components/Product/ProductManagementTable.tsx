import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { IoWarning } from 'react-icons/io5'
import { IoTime } from 'react-icons/io5'
import { Input } from '@/components/ui/input'
import { IoCheckmark } from 'react-icons/io5'
import { IoClose } from 'react-icons/io5'

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

interface ProductManagementTableProps {
    visibleProducts: Product[]
    sizeColumns: string[]
    editingCell: { productId: number; field: string; size?: string } | null
    editValue: string
    onCellEdit: (productId: number, field: string, size?: string) => void
    onSaveEdit: () => void
    onCancelEdit: () => void
    onKeyPress: (e: React.KeyboardEvent) => void
    onEditValueChange: (value: string) => void
    onShowHistory: (product: Product) => void
    hasLowStock: (product: Product) => boolean
    getLowStockSizes: (product: Product) => Array<{ size: string; quantity: number }>
}

export default function ProductManagementTable({
    visibleProducts,
    sizeColumns,
    editingCell,
    editValue,
    onCellEdit,
    onSaveEdit,
    onCancelEdit,
    onKeyPress,
    onEditValueChange,
    onShowHistory,
    hasLowStock,
    getLowStockSizes
}: ProductManagementTableProps) {

    // Helper to get stock for a size
    function getStockForSize(product: Product, size: string) {
        return product.sizeQuantities[size] || 0;
    }

    // Render editable cell
    const renderEditableCell = (product: Product, field: string, size?: string) => {
        const isEditing = editingCell?.productId === product.id && 
                         editingCell?.field === field && 
                         editingCell?.size === size;

        if (isEditing) {
            return (
                <div className="flex items-center gap-1">
                    <Input
                        value={editValue}
                        onChange={(e) => onEditValueChange(e.target.value)}
                        onKeyDown={onKeyPress}
                        className="w-16 h-8 text-sm"
                        autoFocus
                    />
                    <Button
                        size="sm"
                        onClick={onSaveEdit}
                        className="h-6 w-6 p-0"
                    >
                        <IoCheckmark className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onCancelEdit}
                        className="h-6 w-6 p-0"
                    >
                        <IoClose className="w-3 h-3" />
                    </Button>
                </div>
            );
        }

        let displayValue = '';
        if (field === 'sizeQuantity' && size) {
            displayValue = getStockForSize(product, size).toString();
        } else {
            displayValue = product[field as keyof Product]?.toString() || '';
        }

        return (
            <div 
                className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => onCellEdit(product.id, field, size)}
            >
                {displayValue}
            </div>
        );
    };

    return (
        <Table className='border-2 border-gray-500 rounded-lg mt-5'>
            <TableHeader>
                <TableRow>
                    <TableHead className="border-2 border-gray-500 p-2">Lagerort</TableHead>
                    <TableHead className="border-2 border-gray-500 p-2">Hersteller</TableHead>
                    <TableHead className="border-2 border-gray-500 p-2">Artikelbezeichnung</TableHead>
                    <TableHead className="border-2 border-gray-500 p-2">Artikelnummer</TableHead>
                    <TableHead className="border-2 border-gray-500 p-2">Status</TableHead>
                    <TableHead className="border-2 border-gray-500 p-2">Historie</TableHead>
                    {sizeColumns.map(size => (
                        <TableHead key={size} className="border-2 border-gray-500 p-2 text-center">{size}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {visibleProducts.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="border-2 border-gray-500 p-2">
                            {renderEditableCell(product, 'Lagerort')}
                        </TableCell>
                        <TableCell className="border-2 border-gray-500 p-2">
                            {renderEditableCell(product, 'Hersteller')}
                        </TableCell>
                        <TableCell className="border-2 border-gray-500 p-2">
                            {renderEditableCell(product, 'Produktname')}
                        </TableCell>
                        <TableCell className="border-2 border-gray-500 p-2">
                            {renderEditableCell(product, 'Produktkürzel')}
                        </TableCell>
                        <TableCell className="border-2 border-gray-500 p-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2">
                                            {hasLowStock(product) && (
                                                <IoWarning className="text-red-500 text-lg" />
                                            )}
                                            <span className="text-sm">
                                                {hasLowStock(product) ? 'Niedriger Bestand' : 'OK'}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {hasLowStock(product) ? (
                                            <div >
                                                <p>Niedriger Bestand:</p>
                                                {getLowStockSizes(product).map(({ size, quantity }) => (
                                                    <p key={size}>Größe {size}: {quantity} Stück</p>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>Bestand ist ausreichend</p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell className="border-2 border-gray-500 p-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onShowHistory(product)}
                                className="h-8 w-8 p-0"
                            >
                                <IoTime className="w-4 h-4" />
                            </Button>
                        </TableCell>
                        {sizeColumns.map(size => (
                            <TableCell key={size} className="border-2 border-gray-500 p-2 text-center">
                                {renderEditableCell(product, 'sizeQuantity', size)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
