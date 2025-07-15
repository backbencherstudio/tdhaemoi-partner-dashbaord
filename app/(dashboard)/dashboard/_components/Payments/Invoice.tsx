import React, { forwardRef, useImperativeHandle } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';

// Props for dynamic data (expand as needed)
interface InvoiceProps {
    onDownload?: () => void;
    customerName?: string;
    model?: string;
}

// Helper to wait for all images to load
async function waitForImagesLoaded(container: HTMLElement) {
    const images = container.querySelectorAll('img');
    await Promise.all(Array.from(images).map((img) => {
        const image = img as HTMLImageElement;
        if (image.complete) return Promise.resolve();
        return new Promise(resolve => {
            image.onload = image.onerror = resolve;
        });
    }));
}

const Invoice = forwardRef(({ onDownload, customerName = '', model = '' }: InvoiceProps, ref) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('de-DE');
    // Expose downloadInvoice to parent
    useImperativeHandle(ref, () => ({
        async downloadInvoice() {
            const pageDiv = document.getElementById('print-page-0');
            if (!pageDiv) return;
            await waitForImagesLoaded(pageDiv);
            const canvas = await html2canvas(pageDiv, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pageWidth;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');
            if (onDownload) onDownload();
        }
    }));

    // Render the invoice markup off-screen
    return (
        <div className="absolute -left-[9999px] top-0">
            <div
                id="print-page-0"
                className="w-[595px] h-[842px] font-sans p-8 relative box-border"
                style={{ background: '#fff', color: '#000' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span style={{ color: '#3CB371', fontWeight: 'bold', fontSize: 24, letterSpacing: 2 }}>FEET F1RST</span>

                    </div>
                    <div className="text-xs text-right">

                        <div>Auftragsdatum: {formattedDate}</div>
                    </div>
                </div>
                {/* Shoe Image and Info */}
                <div className="flex gap-6 mb-4 mt-14">
                    <div className="border rounded-md p-2 flex flex-col items-center w-40 h-40 justify-center">
                        <Image src="/images/products/shoes.png" alt="Shoe" width={128} height={128} className="w-32 h-32 object-contain" />
                        <span className="font-bold text-lg -mt-5">500 D</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="mb-2">
                            <span style={{ fontWeight: 600 }}>Nome cliente:</span>
                            <span style={{ marginLeft: 8, display: 'inline-block', minWidth: 180 }}>{customerName || '__________________________'}</span>
                        </div>
                        <div>
                            <span style={{ fontWeight: 600 }}>Modello:</span>
                            <span style={{ marginLeft: 8, display: 'inline-block', minWidth: 180 }}>{model || '__________________________'}</span>
                        </div>
                    </div>
                </div>
                {/* Details */}
                <div className="mb-2 text-sm mt-10">
                    <div><span style={{ fontWeight: 600 }}>Pelle scelta:</span> <span style={{ marginLeft: 8, display: 'inline-block', minWidth: 180 }}>__________________________</span></div>
                    <div><span style={{ fontWeight: 600 }}>Colore & tipo:</span> <span style={{ marginLeft: 8, display: 'inline-block', minWidth: 180 }}>__________________________</span></div>
                    <div><span style={{ fontWeight: 600 }}>Fodera interna:</span> <span style={{ marginLeft: 8, display: 'inline-block', minWidth: 180 }}>__________________________</span></div>
                    <div><span style={{ fontWeight: 600 }}>Colore cuciture:</span> <span style={{ marginLeft: 8, display: 'inline-block', minWidth: 180 }}>__________________________</span></div>
                </div>
                <div className="mb-2 text-sm mt-10">
                    <span style={{ fontWeight: 600 }}>Altezza desiderata:</span> 9,7cm
                </div>
                <div className="mb-2 text-sm">
                    <span style={{ fontWeight: 600 }}>Aggiunte (es. rinforzi):</span> _____________
                </div>
                {/* Address */}
                <div className="mt-6 text-sm">
                    <div style={{ fontWeight: 600 }}>Indirizzo di consegna:</div>
                    <div>FeetF1rst GmbH</div>
                    <div>Pipenstrasse 5, 39031 Brunico</div>
                    <div>Bolzano / Italia</div>
                </div>
                {/* Footer - Fixed at bottom */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgb(122,194,154)',
                    color: '#fff',
                    height: '60px',
                    zIndex: 2
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 40px',
                        height: '100%'
                    }}>
                        <p>Tel: 342 6412573</p>
                        <p>info@feetfirst.com</p>
                        <p>FeetF1rst GmbH</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

Invoice.displayName = 'Invoice';

export default Invoice;
