'use client';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Invoice from '@/app/(dashboard)/dashboard/_components/Payments/Invoice';

interface SuccessMessageProps {
  isVisible: boolean;
  onClose: () => void;
  orderPrice: number;
}

export default function SuccessMessage({ isVisible, onClose, orderPrice }: SuccessMessageProps) {
  const invoiceComponentRef = useRef<any>(null);

  const handleDownloadInvoice = async () => {
    onClose();
    if (invoiceComponentRef.current && invoiceComponentRef.current.downloadInvoice) {
      await invoiceComponentRef.current.downloadInvoice();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold text-green-600 mb-2">Bestellung erfolgreich abgeschlossen</h3>
          <p className="text-gray-700 mb-4">
            Ihre Bestellung für {orderPrice.toFixed(2)}€ wurde erfolgreich abgeschlossen.
          </p>
          <Button
            onClick={handleDownloadInvoice}
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700"
          >
            OK
          </Button>
        </div>
      </div>
      
      {/* Hidden Invoice component for PDF generation */}
      <Invoice ref={invoiceComponentRef} customerName="" model="" />
      
      {/* Global style override for html2canvas compatibility */}
      <style jsx global>{`
        .invoice-pdf *, .invoice-pdf {
          background: none !important;
          background-color: rgb(255,255,255) !important;
          color: rgb(0,0,0) !important;
        }
        .invoice-pdf .text-white, .invoice-pdf [style*="color: white"] {
          color: rgb(255,255,255) !important;
        }
        .invoice-pdf [style*="background: rgb(122,194,154)"] {
          background: rgb(122,194,154) !important;
        }
      `}</style>
    </>
  );
}
