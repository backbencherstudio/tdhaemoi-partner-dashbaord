import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, ClipboardEdit, ArrowLeft } from "lucide-react";
import { useOrders, steps } from "@/contexts/OrdersContext";

export default function ProcessTable() {
    const { orders, togglePriority, moveToNextStep } = useOrders();
    const [visibleCount, setVisibleCount] = useState(10);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const hasMore = orders.length > visibleCount;
    const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

    // Get the selected order's current step to show as active in the progress bar
    const getActiveStep = () => {
        if (!selectedOrderId) return -1; // No order selected

        const selectedOrder = orders.find(order => order.id === selectedOrderId);
        return selectedOrder ? selectedOrder.currentStep : -1;
    };

    const activeStep = getActiveStep();

    // Handle next step button click
    const handleNextStep = (orderId: string) => {
        moveToNextStep(orderId);
        // Keep the same order selected after moving to next step
        setSelectedOrderId(orderId);
    };

    // Handle priority toggle and select order
    const handlePriorityToggle = (orderId: string) => {
        togglePriority(orderId);
        setSelectedOrderId(orderId);
    };

    // Get status color for each step
    const getStepColor = (stepIndex: number, isActive: boolean) => {
        const colors = [
            'bg-[#FF0000]',
            'bg-[#FFA617]',
            'bg-[#96F30080]',
            'bg-[#4CAF50]',
            'bg-[#2196F3]',
            'bg-[#9C27B0]',
        ];

        if (isActive) {
            return `font-bold ${colors[stepIndex] || 'text-black'}`;
        }
        return 'text-gray-400 font-normal';
    };

    return (
        <div className="mt-6 sm:mt-10 max-w-full overflow-x-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 sm:mb-6 gap-4 border-b-2 border-gray-400 pb-4">
                <div className="flex items-center w-full overflow-x-auto">
                    {steps.map((step, idx) => (
                        <React.Fragment key={step}>
                            <div className={`flex flex-col items-center min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[140px] xl:min-w-[160px] flex-shrink-0`}>
                                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mb-1 sm:mb-2 ${idx === activeStep ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                <span className={`text-xs sm:text-sm text-center px-1 leading-tight ${getStepColor(idx, idx === activeStep)}`}>
                                    {step}
                                </span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`flex-1 h-px mx-1 sm:mx-2 ${idx < activeStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex-shrink-0">
                    <button className="border px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium whitespace-nowrap">letzten 30 Tage</button>
                </div>
            </div>
            <Table className="table-fixed w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-40 sm:w-50 md:w-60 min-w-[160px] lg:w-[200px]"></TableHead>
                        <TableHead className="w-[80px] sm:w-[95px] min-w-[80px] max-w-[95px] whitespace-normal break-words text-xs sm:text-sm">Bestellnummer</TableHead>
                        <TableHead className="w-[90px] sm:w-[100px] min-w-[90px] max-w-[100px] whitespace-normal break-words text-xs sm:text-sm">Kundenname</TableHead>
                        <TableHead className="w-[140px] sm:w-[160px] min-w-[140px] max-w-[160px] whitespace-normal break-words text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="w-[70px] sm:w-[80px] min-w-[70px] max-w-[80px] whitespace-normal break-words text-xs sm:text-sm">Preis</TableHead>
                        <TableHead className="w-[160px] sm:w-[180px] min-w-[160px] max-w-[180px] whitespace-normal break-words text-xs sm:text-sm hidden md:table-cell">Zahlung</TableHead>
                        <TableHead className="w-[140px] sm:w-[160px] min-w-[140px] max-w-[160px] whitespace-normal break-words text-xs sm:text-sm hidden lg:table-cell">Beschreibung</TableHead>
                        <TableHead className="w-[140px] sm:w-[160px] min-w-[140px] max-w-[160px] whitespace-normal break-words text-xs sm:text-sm hidden xl:table-cell">Abholort / Versand</TableHead>
                        <TableHead className="w-[100px] sm:w-[120px] min-w-[100px] max-w-[120px] whitespace-normal break-words text-xs sm:text-sm">Fertigstellung</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.slice(0, visibleCount).map((row, idx) => (
                        <TableRow
                            key={idx}
                            className={`hover:bg-gray-50 transition-colors ${selectedOrderId === row.id ? 'bg-blue-50' : ''}`}
                        >
                            <TableCell className="p-2">
                                <div className="flex flex-wrap gap-1 sm:gap-2 ">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-6 sm:h-8 px-1 sm:px-2 text-xs hover:bg-gray-200 flex items-center gap-1 min-w-fit ${row.currentStep >= steps.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        onClick={() => handleNextStep(row.id)}
                                        disabled={row.currentStep >= steps.length - 1}
                                        title={row.currentStep >= steps.length - 1 ? "Bereits im letzten Schritt" : "Nächster Schritt"}
                                    >
                                        <ArrowLeft className="h-3 w-3 text-gray-700" />
                                        <span className="hidden sm:inline text-gray-700">Nächster</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-red-100 ${row.isPrioritized ? 'bg-red-100' : ''}`}
                                        title="Auftrag priorisieren"
                                        onClick={() => handlePriorityToggle(row.id)}
                                    >
                                        <AlertTriangle className={`h-3 w-3 ${row.isPrioritized ? 'text-red-600 fill-current' : 'text-red-500'}`} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-200"
                                        title="Löschen"
                                    >
                                        <Trash2 className="h-3 w-3 text-gray-700" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-blue-100"
                                        title="Bearbeiten"
                                    >
                                        <ClipboardEdit className="h-3 w-3 text-blue-600" />
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium text-xs sm:text-sm w-[80px] sm:w-[95px] min-w-[80px] max-w-[95px] whitespace-normal break-words overflow-hidden">{row.bestellnummer}</TableCell>
                            <TableCell className="text-xs sm:text-sm w-[90px] sm:w-[100px] min-w-[90px] max-w-[100px] whitespace-normal break-words overflow-hidden">{row.kundenname}</TableCell>
                            <TableCell className="text-xs sm:text-sm w-[140px] sm:w-[160px] min-w-[140px] max-w-[160px] whitespace-normal break-words overflow-hidden">
                                <span className={`px-1 sm:px-2 py-1 rounded text-xs font-medium ${row.currentStep === 0 ? 'bg-red-100 text-red-800' :
                                    row.currentStep === 1 ? 'bg-orange-100 text-orange-800' :
                                        row.currentStep === 2 ? 'bg-green-100 text-green-800' :
                                            row.currentStep === 3 ? 'bg-emerald-100 text-emerald-800' :
                                                row.currentStep === 4 ? 'bg-blue-100 text-blue-800' :
                                                    'bg-purple-100 text-purple-800'
                                    }`}>
                                    {row.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm w-[70px] sm:w-[80px] min-w-[70px] max-w-[80px] whitespace-normal break-words overflow-hidden">{row.preis}</TableCell>
                            <TableCell className="text-xs sm:text-sm w-[160px] sm:w-[180px] min-w-[160px] max-w-[180px] whitespace-normal break-words overflow-hidden hidden md:table-cell">{row.zahlung}</TableCell>
                            <TableCell className="text-xs sm:text-sm w-[140px] sm:w-[160px] min-w-[140px] max-w-[160px] whitespace-normal break-words overflow-hidden hidden lg:table-cell">{row.beschreibung}</TableCell>
                            <TableCell className="text-xs sm:text-sm w-[140px] sm:w-[160px] min-w-[140px] max-w-[160px] whitespace-normal break-words overflow-hidden hidden xl:table-cell">{row.abholort}</TableCell>
                            <TableCell className="text-xs sm:text-sm w-[100px] sm:w-[120px] min-w-[100px] max-w-[120px] whitespace-normal break-words overflow-hidden">{row.fertigstellung}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {hasMore && (
                <div className="flex justify-center mt-4 sm:mt-6">
                    <Button variant="outline" className="px-4 sm:px-8 py-2 text-sm sm:text-base font-semibold" onClick={handleLoadMore}>
                        Mehr anzeigen
                    </Button>
                </div>
            )}
        </div>
    );
}
