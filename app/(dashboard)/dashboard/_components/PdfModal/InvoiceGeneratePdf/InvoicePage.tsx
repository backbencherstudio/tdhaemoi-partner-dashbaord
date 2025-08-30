import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export interface OrderPdfData {
    id: string;
    customerId: string;
    partnerId: string;
    fußanalyse: number;
    einlagenversorgung: number;
    totalPrice: number;
    productId: string;
    orderStatus: string;
    statusUpdate: string;
    invoice: any;
    createdAt: string;
    updatedAt: string;
    customer: {
        id: string;
        customerNumber: number;
        vorname: string;
        nachname: string;
        email: string;
        telefonnummer: string;
        wohnort: string;
    };
    partner: {
        id: string;
        name: string;
        email: string;
        image: string;
        role: string;
    };
    product: {
        id: string;
        name: string;
        rohlingHersteller: string;
        artikelHersteller: string;
        versorgung: string;
        material: string;
        langenempfehlung: Record<string, number>;
        status: string;
        diagnosis_status: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

interface InvoicePageProps {
    data: OrderPdfData;
    isGenerating?: boolean;
    onGenerateStart?: () => void;
    onGenerateComplete?: () => void;
}

export default function InvoicePage({ data, isGenerating = false, onGenerateStart, onGenerateComplete }: InvoicePageProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE');
    };

    const formatPrice = (price: number) => {
        return price.toFixed(2) + ' €';
    };

    const generatePdf = async () => {
        try {
            // Notify parent that generation has started
            onGenerateStart?.();

            // Use the hidden printable area (same as FootExercises)
            const pdfContainer = document.getElementById('invoice-print-area');
            if (!pdfContainer) {
                toast.error('Print area not found');
                return false;
            }

            // Convert to canvas
            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 794,
                height: 1123
            });

            // Create PDF - Single page only
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add single page - fit content to page
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Save the PDF
            const fileName = `order_${data.customer.vorname}_${data.customer.nachname}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            toast.success('PDF generated successfully!');
            return true;
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            toast.error('Failed to generate PDF');
            return false;
        } finally {
            // Notify parent that generation has completed
            onGenerateComplete?.();
        }
    };



    return (
        <div>
            <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="bg-[#62A17C] transform duration-300 cursor-pointer hover:bg-[#62A17C] text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Generating...
                    </>
                ) : (
                    'Generate PDF'
                )}
            </button>

            {/* Hidden printable area - Same as FootExercises */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div
                    id="invoice-print-area"
                    style={{
                        width: '794px',
                        height: '1123px',
                        background: '#fff',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '40px 40px 20px 40px',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '70px', height: '110px', marginRight: '20px' }}>
                                <img src="/images/pdfLogo.png" alt="FeetFirst Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>{data.customer.vorname} {data.customer.nachname}</div>
                                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Kdnr: {data.customer.customerNumber}</div>
                                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Geb.: {formatDate(data.createdAt)}</div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Scan: {formatDate(data.createdAt)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{
                        padding: '0 40px',
                        position: 'absolute',
                        top: '220px',
                        left: 0,
                        right: 0,
                        bottom: '80px',
                        overflow: 'hidden'
                    }}>
                        {/* Kundendaten Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Kundendaten</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Email: {data.customer.email || '-'}</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Telefon: {data.customer.telefonnummer || '-'}</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Wohnort: {data.customer.wohnort || '-'}</p>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Diagnose: -</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bearbeitung & Terminierung Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Bearbeitung & Terminierung</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>

                                        <p>Mitarbeiter: {data.partner.name}</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Auftragsdatum: {formatDate(data.createdAt)}</p>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Fertigstellung bis: {formatDate(data.statusUpdate)}</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Abholung: Bremen</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Versorgung & Materialien Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Versorgung & Materialien</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#555' }}>Versorgung</h3>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Versorgung: {data.product.status}</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Rohling: {data.product.rohlingHersteller}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#555' }}>Materialien</h3>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Rohling: {data.product.artikelHersteller}</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Pelotte: -</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Zusatz: -</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Zahlung & Abholung Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Zahlung & Abholung</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Einlagenversorgung: Standard {formatPrice(data.einlagenversorgung)}</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Fußanalyse: {formatPrice(data.fußanalyse)}</p>
                                    </div>
                                    <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
                                        <p>Gesamtpreis: {formatPrice(data.totalPrice)}</p>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Private Bezahlung am: ________________</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <p>Abgeholt am: ________________</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#000',
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
                            <p>+43 5950-2330</p>
                            <p>FeetFirst GmbH</p>
                            <p>info@feetf1rst.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
