import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface NewProduct {
    Produktname: string;
    Hersteller: string;
    Produktkürzel: string;
    Lagerort: string;
    minStockLevel: number;
    sizeQuantities: { [key: string]: number };
}

interface AddProductProps {
    onAddProduct: (product: NewProduct) => void;
    sizeColumns: string[];
}

export default function AddProduct({ onAddProduct, sizeColumns }: AddProductProps) {
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [newProduct, setNewProduct] = useState<NewProduct>({
        Produktname: '',
        Hersteller: '',
        Produktkürzel: '',
        Lagerort: 'Alle Lagerorte',
        minStockLevel: 5,
        sizeQuantities: Object.fromEntries(sizeColumns.map(size => [size, 0]))
    });

    const handleNewProductChange = (field: keyof NewProduct, value: string | number) => {
        setNewProduct(prev => ({ ...prev, [field]: value }));
    };
    const handleNewProductSizeChange = (size: string, value: string) => {
        setNewProduct(prev => ({
            ...prev,
            sizeQuantities: {
                ...prev.sizeQuantities,
                [size]: parseInt(value) || 0
            }
        }));
    };
    const handleAddProduct = () => {
        onAddProduct(newProduct);
        setShowAddProductModal(false);
        setNewProduct({
            Produktname: '',
            Hersteller: '',
            Produktkürzel: '',
            Lagerort: 'Alle Lagerorte',
            minStockLevel: 5,
            sizeQuantities: Object.fromEntries(sizeColumns.map(size => [size, 0]))
        });
    };

    return (
        <>
            <button
                className='bg-[#61A178] px-4 py-2 rounded-md hover:bg-[#61A178]/80 text-white cursor-pointer transition-all duration-300'
                onClick={() => setShowAddProductModal(true)}
            >
                Add Product
            </button>
            <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Produkt manuell hinzufügen</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={e => { e.preventDefault(); handleAddProduct(); }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Produktname</label>
                                <Input value={newProduct.Produktname} onChange={e => handleNewProductChange('Produktname', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Hersteller</label>
                                <Input value={newProduct.Hersteller} onChange={e => handleNewProductChange('Hersteller', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Artikelnummer</label>
                                <Input value={newProduct.Produktkürzel} onChange={e => handleNewProductChange('Produktkürzel', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Lagerort</label>
                                <Select value={newProduct.Lagerort} onValueChange={v => handleNewProductChange('Lagerort', v)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Alle Lagerorte">Alle Lagerorte</SelectItem>
                                        <SelectItem value="Lager 1">Lager 1</SelectItem>
                                        <SelectItem value="Lager 2">Lager 2</SelectItem>
                                        <SelectItem value="Lager 3">Lager 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mindestbestand</label>
                                <Input type="number" min={0} value={newProduct.minStockLevel} onChange={e => handleNewProductChange('minStockLevel', parseInt(e.target.value) || 0)} required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Größen & Mengen</label>
                            <div className="grid grid-cols-5 gap-2">
                                {sizeColumns.map(size => (
                                    <div key={size} className="flex flex-col items-center">
                                        <span className="text-xs text-gray-500 mb-1">{size}</span>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={newProduct.sizeQuantities[size]}
                                            onChange={e => handleNewProductSizeChange(size, e.target.value)}
                                            className="w-16"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowAddProductModal(false)}>Abbrechen</Button>
                            <Button type="submit" className="bg-[#61A178] hover:bg-[#61A178]/80 text-white">Hinzufügen</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
