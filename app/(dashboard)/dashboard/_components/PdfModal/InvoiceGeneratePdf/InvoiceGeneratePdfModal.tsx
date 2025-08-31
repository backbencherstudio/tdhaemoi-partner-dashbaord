import React, { useState, useEffect } from 'react';
import { useGeneratePdf } from '@/hooks/orders/useGeneratePdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { pdfSendToCustomer } from '@/apis/productsOrder';
import InvoicePage from './InvoicePage';
import toast from 'react-hot-toast';
import {
    FileText,
    Send,
    X
} from 'lucide-react';

interface InvoiceGeneratePdfModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId?: string;
}

export default function InvoiceGeneratePdfModal({ isOpen, onClose, orderId }: InvoiceGeneratePdfModalProps) {
    const { orderData, fetchOrderData } = useGeneratePdf();
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) {
            setIsLoading(true);
            fetchOrderData(orderId).finally(() => setIsLoading(false));
        }
    }, [isOpen, orderId, fetchOrderData]);

    const handleGenerateAndSend = async () => {
        if (!orderData) return;

        try {
            setIsSending(true);

            // Generate PDF without downloading (just for sending)
            const pdfContainer = document.getElementById('invoice-print-area');
            if (!pdfContainer) {
                toast.error('Print area not found');
                return;
            }

            // Import html2canvas and jsPDF dynamically
            const html2canvas = (await import('html2canvas')).default;
            const jsPDF = (await import('jspdf')).default;

            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 794,
                height: 1123
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Convert PDF to Blob for file upload (NO download)
            const pdfBlob = pdf.output('blob');

            // Send to customer (without downloading)
            await handleSendToCustomer(pdfBlob);

        } catch (error) {
            console.error('Failed to generate PDF:', error);
            toast.error('Failed to generate PDF');
        } finally {
            setIsSending(false);
        }
    };

    const handleSendToCustomer = async (pdfBlob: Blob) => {
        if (!orderId) {
            toast.error('Order ID not found');
            return;
        }

        try {
            // Create FormData with the PDF file
            const formData = new FormData();
            formData.append('invoice', pdfBlob, `order_${orderData?.customer.vorname}_${orderData?.customer.nachname}.pdf`);

            // Call the API with FormData
            const response = await pdfSendToCustomer(orderId, formData);

            if (response.success) {
                toast.success('PDF sent to customer successfully!');
                onClose();
            } else {
                toast.error('Failed to send PDF to customer');
            }
        } catch (error) {
            console.error('Error sending PDF to customer:', error);
            toast.error('Failed to send PDF to customer');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center space-x-3">
                        <div className="w-8 h-8">
                            <img
                                src="/images/pdfLogo.png"
                                alt="FeetFirst Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span>PDF Generation</span>
                    </DialogTitle>
                </DialogHeader>
                {/* Instructions */}
                <div className="text-center">
                    <p className="text-gray-700 mb-4">
                        Download the PDF invoice or send it directly to your customer.
                    </p>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading order data...</p>
                        </div>
                    </div>
                ) : !orderData ? (
                    <div className="text-center py-8">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Order Data</h3>
                        <p className="text-gray-500">Please provide an order ID to generate the invoice.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Order Info */}
                        <div className="text-center">
                            {/* <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Order #{orderData.id}
                            </h3> */}

                            {/* Action Buttons */}
                            <div className="mb-4">
                                {/* Download PDF Button - Uses InvoicePage */}
                                <InvoicePage
                                    data={orderData}
                                    isGenerating={isGenerating}
                                    onGenerateStart={() => setIsGenerating(true)}
                                    onGenerateComplete={() => setIsGenerating(false)}
                                />


                            </div>
                            <p className="text-gray-600">
                                Customer: {orderData.customer.vorname} {orderData.customer.nachname}
                            </p>
                            <p className="text-gray-600">
                                Total: {orderData.totalPrice.toFixed(2)} €
                            </p>
                        </div>





                        <div className='flex items-center justify-center gap-4'>
                            {/* Send to Customer Button */}
                            <button
                                onClick={handleGenerateAndSend}
                                disabled={isSending}
                                className="w-full py-2 bg-[#62A17C] text-white rounded-md hover:bg-[#4A8A5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                            >
                                {isSending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2 " />
                                        Send to Customer
                                    </>
                                )}
                            </button>

                            {/* Cancel Button */}
                            <button
                                onClick={onClose}
                                className="w-full py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}
