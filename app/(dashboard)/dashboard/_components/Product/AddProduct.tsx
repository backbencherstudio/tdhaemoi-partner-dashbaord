import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useStockManagementSlice } from '@/hooks/stockManagement/useStockManagementSlice'
import toast from 'react-hot-toast'

interface NewProduct {
    Produktname: string;
    Hersteller: string;
    Produktkürzel: string;
    Lagerort: string;
    minStockLevel: number;
    purchase_price: number;
    selling_price: number;
    sizeQuantities: { [key: string]: number };
}

interface AddProductProps {
    onAddProduct: (product: NewProduct) => void;
    sizeColumns: string[];
    editProductId?: string; // if provided, modal works in edit mode
    open?: boolean; // controlled open (for edit from table)
    onOpenChange?: (open: boolean) => void;
    showTrigger?: boolean; // show default trigger button
    onUpdated?: () => void; // callback after successful update
}

export default function AddProduct({ onAddProduct, sizeColumns, editProductId, open, onOpenChange, showTrigger = true, onUpdated }: AddProductProps) {
    const { user } = useAuth();
    const { createNewProduct, updateExistingProduct, getProductById, isLoading, error, clearError } = useStockManagementSlice();
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const isOpen = open !== undefined ? open : showAddProductModal;
    const setOpen = onOpenChange || setShowAddProductModal;
    const [isPrefilling, setIsPrefilling] = useState(false)
    const [newProduct, setNewProduct] = useState<NewProduct>({
        Produktname: '',
        Hersteller: '',
        Produktkürzel: '',
        Lagerort: 'Alle Lagerorte',
        minStockLevel: 5,
        purchase_price: 0,
        selling_price: 0,
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
    const handleAddProduct = async () => {
        try {
            clearError();
            // If edit mode -> update, else create
            if (editProductId) {
                const payload = {
                    produktname: newProduct.Produktname,
                    hersteller: newProduct.Hersteller,
                    artikelnummer: newProduct.Produktkürzel,
                    lagerort: newProduct.Lagerort,
                    mindestbestand: newProduct.minStockLevel,
                    // do not send 'historie' on update; backend model doesn't accept it
                    groessenMengen: newProduct.sizeQuantities,
                    purchase_price: newProduct.purchase_price,
                    selling_price: newProduct.selling_price,
                    Status: 'In Stock'
                } as const;
                const res = await updateExistingProduct(editProductId, payload);
                toast.success(res?.message || 'Produkt erfolgreich aktualisiert');
                setOpen(false);
                onUpdated && onUpdated();
                return;
            }
            const response = await createNewProduct(newProduct);

            // Show success toast with product details
            if (response.success && response.data) {
                const productInfo = response.data;
                // Use the message from API response and show product details
                toast.success(`${response.message} `);

                // Call the onAddProduct callback with the API response - don't add id to avoid TypeScript error
                onAddProduct(newProduct);
            } else {
                toast.success(response.message || 'Storage created successfully',
                    {
                        duration: 4000,
                        position: 'top-right',
                    });

                onAddProduct(newProduct);
            }

            // Reset form and close modal
            setOpen(false);
            setNewProduct({
                Produktname: '',
                Hersteller: '',
                Produktkürzel: '',
                Lagerort: 'Alle Lagerorte',
                minStockLevel: 5,
                purchase_price: 0,
                selling_price: 0,
                sizeQuantities: Object.fromEntries(sizeColumns.map(size => [size, 0]))
            });
        } catch (err) {
            console.error('Failed to create product:', err);
            // Show error toast
            toast.error('Fehler beim Erstellen des Produkts. Bitte versuchen Sie es erneut.', {
                duration: 5000,
                position: 'top-right',
            });
        }
    };

    // Preload data when editing
    React.useEffect(() => {
        const load = async () => {
            if (!editProductId || !isOpen) return;
            try {
                setIsPrefilling(true)
                const product = await getProductById(editProductId);
                setNewProduct({
                    Produktname: product.produktname,
                    Hersteller: product.hersteller,
                    Produktkürzel: product.artikelnummer,
                    Lagerort: product.lagerort,
                    minStockLevel: product.mindestbestand,
                    purchase_price: product.purchase_price,
                    selling_price: product.selling_price,
                    sizeQuantities: product.groessenMengen || Object.fromEntries(sizeColumns.map(size => [size, 0]))
                });
            } finally {
                setIsPrefilling(false)
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editProductId, isOpen]);

    // Reset form when modal closes (uncontrolled case handled too)
    React.useEffect(() => {
        if (!isOpen && !editProductId) {
            setNewProduct({
                Produktname: '',
                Hersteller: '',
                Produktkürzel: '',
                Lagerort: 'Alle Lagerorte',
                minStockLevel: 5,
                purchase_price: 0,
                selling_price: 0,
                sizeQuantities: Object.fromEntries(sizeColumns.map(size => [size, 0]))
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    return (
        <>
            {showTrigger && (
                <button
                    className='bg-[#61A178] px-4 py-2 rounded-md hover:bg-[#61A178]/80 text-white cursor-pointer transition-all duration-300'
                    onClick={() => setOpen(true)}
                >
                    {editProductId ? 'Produkt bearbeiten' : 'Add Product'}
                </button>
            )}
            <Dialog open={isOpen} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editProductId ? 'Produkt bearbeiten' : 'Produkt manuell hinzufügen'}</DialogTitle>
                    </DialogHeader>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            <p className="font-medium">Fehler beim Erstellen des Produkts</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    <form onSubmit={e => { e.preventDefault(); handleAddProduct(); }} className="space-y-6">
                        {/* Row 1: Produktname and Hersteller */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Produktname</label>
                                <Input value={newProduct.Produktname} onChange={e => handleNewProductChange('Produktname', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Hersteller</label>
                                <Input value={newProduct.Hersteller} onChange={e => handleNewProductChange('Hersteller', e.target.value)} required />
                            </div>
                        </div>

                        {/* Row 2: Artikelnummer and Lagerort */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        {user?.hauptstandort && user.hauptstandort.length > 0 ? (
                                            user.hauptstandort.map((location, index) => (
                                                <SelectItem key={index} value={location}>
                                                    {location}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <>
                                                <SelectItem value="Lager 1">Lager 1</SelectItem>
                                                <SelectItem value="Lager 2">Lager 2</SelectItem>
                                                <SelectItem value="Lager 3">Lager 3</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 3: Einkaufspreis and Verkaufspreis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Einkaufspreis (€)</label>
                                <Input type="number" step="0.01" min={0} value={newProduct.purchase_price} onChange={e => handleNewProductChange('purchase_price', parseFloat(e.target.value) || 0)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Verkaufspreis (€)</label>
                                <Input type="number" step="0.01" min={0} value={newProduct.selling_price} onChange={e => handleNewProductChange('selling_price', parseFloat(e.target.value) || 0)} required />
                            </div>
                        </div>

                        {/* Row 4: Mindestbestand */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="md:w-1/2">
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
                            <Button
                                className="cursor-pointer"
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowAddProductModal(false);
                                    clearError();
                                }}
                                disabled={isLoading}
                            >
                                Abbrechen
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#61A178] cursor-pointer hover:bg-[#61A178]/80 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Erstellen...' : 'Hinzufügen'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
