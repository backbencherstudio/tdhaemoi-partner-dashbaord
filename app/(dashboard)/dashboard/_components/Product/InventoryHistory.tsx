import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Product {
  id: number;
  Produktname: string;
  Produktkürzel: string;
  Hersteller: string;
  Lagerort: string;
  minStockLevel: number;
  sizeQuantities: { [key: string]: number };
  inventoryHistory: Array<{
    id: string;
    date: string;
    type: 'delivery' | 'sale' | 'correction' | 'transfer';
    quantity: number;
    size: string;
    previousStock: number;
    newStock: number;
    user: string;
    notes: string;
  }>;
}

interface InventoryHistoryProps {
  productsData: Product[];
}

export interface InventoryHistoryRef {
  showHistory: (product: Product) => void;
}

const InventoryHistory = forwardRef<InventoryHistoryRef, InventoryHistoryProps>(
  ({ productsData }, ref) => {
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Function to show inventory history for a product
    const showHistory = (product: Product) => {
      setSelectedProduct(product);
      setShowHistoryDialog(true);
    };

    // Expose the showHistory function to parent component
    useImperativeHandle(ref, () => ({
      showHistory
    }));

  // Function to get the type label in German
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'delivery':
        return 'Lieferung';
      case 'sale':
        return 'Verkauf';
      case 'correction':
        return 'Korrektur';
      case 'transfer':
        return 'Transfer';
      default:
        return type;
    }
  };

  // Function to get the type styling
  const getTypeStyling = (type: string) => {
    switch (type) {
      case 'delivery':
        return 'bg-green-100 text-green-800';
      case 'sale':
        return 'bg-red-100 text-red-800';
      case 'correction':
        return 'bg-blue-100 text-blue-800';
      case 'transfer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* This component doesn't render a button by default, but you can add one if needed */}
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
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeStyling(entry.type)}`}>
                                  {getTypeLabel(entry.type)}
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
    </>
  );
});

export default InventoryHistory;
