import React, { useState, useEffect } from 'react';
import { useGeneratePdf, OrderPdfData } from '@/hooks/orders/useGeneratePdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InvoicePage from './InvoicePage';
import {
    FileText,
    User,
    Package,
    CreditCard,
    Calendar,
    Phone,
    Mail,
    MapPin,
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

    useEffect(() => {
        if (isOpen && orderId) {
            setIsLoading(true);
            fetchOrderData(orderId).finally(() => setIsLoading(false));
        }
    }, [isOpen, orderId, fetchOrderData]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE');
    };

    const formatPrice = (price: number) => {
        return (price / 100).toFixed(2) + ' €';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8">
                                <img 
                                    src="/images/pdfLogo.png" 
                                    alt="FeetFirst Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span>Invoice Preview</span>
                        </div>
                    
                    
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
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
                        {/* Header with Generate PDF button */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-gray-600">Order #{orderData.id}</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <InvoicePage 
                                    data={orderData} 
                                    isGenerating={isGenerating}
                                    onGenerateStart={() => setIsGenerating(true)}
                                    onGenerateComplete={() => setIsGenerating(false)}
                                />
                            </div>
                        </div>

                        {/* Invoice Content */}
                        <div className="bg-white border-2  rounded-lg shadow-lg overflow-hidden">
                            {/* Company Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b ">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">S</span>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900">FeetFirst</h2>
                                            <p className="text-gray-600 text-lg">GmbH</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {orderData.customer.vorname} {orderData.customer.nachname}
                                        </div>
                                        <div className="text-sm text-gray-600">Kdnr: {orderData.customer.customerNumber}</div>
                                        <div className="text-sm text-gray-600">Scan: {formatDate(orderData.createdAt)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Customer Data Section */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center text-lg">
                                            <User className="h-5 w-5 mr-2 text-blue-600" />
                                            Kundendaten
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <span className="font-medium">Email:</span>
                                                        <span className="ml-2 text-gray-700">{orderData.customer.email || '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Phone className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <span className="font-medium">Telefon:</span>
                                                        <span className="ml-2 text-gray-700">{orderData.customer.telefonnummer || '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <span className="font-medium">Wohnort:</span>
                                                        <span className="ml-2 text-gray-700">{orderData.customer.wohnort || '-'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="font-medium">Diagnose:</span>
                                                    <span className="ml-2 text-gray-700">-</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Processing & Scheduling Section */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center text-lg">
                                            <Calendar className="h-5 w-5 mr-2 text-green-600" />
                                            Bearbeitung & Terminierung
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="font-medium">Mitarbeiter:</span>
                                                    <span className="ml-2 text-gray-700">{orderData.partner.name}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Auftragsdatum:</span>
                                                    <span className="ml-2 text-gray-700">{formatDate(orderData.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="font-medium">Fertigstellung bis:</span>
                                                    <span className="ml-2 text-gray-700">{formatDate(orderData.statusUpdate)}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Abholung:</span>
                                                    <span className="ml-2 text-gray-700">Bremen</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Supply & Materials Section */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center text-lg">
                                            <Package className="h-5 w-5 mr-2 text-purple-600" />
                                            Versorgung & Materialien
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-gray-800">Versorgung</h4>
                                                <div>
                                                    <span className="font-medium">Versorgung:</span>
                                                    <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                        {orderData.product.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Rohling:</span>
                                                    <span className="ml-2 text-gray-700">{orderData.product.rohlingHersteller}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-gray-800">Materialien</h4>
                                                <div>
                                                    <span className="font-medium">Rohling:</span>
                                                    <span className="ml-2 text-gray-700">{orderData.product.artikelHersteller}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Pelotte:</span>
                                                    <span className="ml-2 text-gray-700">-</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Zusatz:</span>
                                                    <span className="ml-2 text-gray-700">-</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment & Pickup Section */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center text-lg">
                                            <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                                            Zahlung & Abholung
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Einlagenversorgung:</span>
                                                    <span className="text-gray-700">Standard {formatPrice(orderData.einlagenversorgung)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Fußanalyse:</span>
                                                    <span className="text-gray-700">{formatPrice(orderData.fußanalyse)}</span>
                                                </div>
                                                <div className="border-t border-gray-300 my-3"></div>
                                                <div className="flex justify-between items-center text-lg font-bold">
                                                    <span>Gesamtpreis:</span>
                                                    <span className="text-blue-600">{formatPrice(orderData.totalPrice)}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="font-medium">Private Bezahlung am:</span>
                                                    <div className="mt-1 border-b-2 border-gray-300 h-6"></div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Abgeholt am:</span>
                                                    <div className="mt-1 border-b-2 border-gray-300 h-6"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        <span>+43 595024330</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold text-gray-900">FeetFirst GmbH</div>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>info@feetfirst.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
