
import jsPDF from 'jspdf';

// New utility: create a PDF with header + two foot images
export interface FeetImagesPdfHeader {
    logoUrl?: string | null;
    partnerName?: string | null;
    customerFullName: string;
    customerNumber?: number | string | null;
    dateOfBirthText?: string | null; // e.g. "23.07.1997"
}

async function fetchImageAsDataUrl(url: string): Promise<string> {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}


// New utility: create a PDF for a single foot image with the same header layout
async function generateSingleFootPdf(params: {
    imageUrl: string;
    header: FeetImagesPdfHeader & { sideLabel?: 'Left' | 'Right' | string };
    fileName?: string;
}): Promise<Blob> {
    const { imageUrl, header } = params;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 10;

    let currentY = margin;
    const headerHeight = 24;
    let drewLogo = false;
    if (header.logoUrl) {
        try {
            const logoDataUrl = await fetchImageAsDataUrl(header.logoUrl);
            const logoWidth = 24;
            const logoHeight = 24;
            pdf.addImage(logoDataUrl, 'JPEG', margin, currentY, logoWidth, logoHeight);
            drewLogo = true;
        } catch (_) {
            // ignore
        }
    }

    // Header text prepared like combined function
    const textX = margin + 30;
    pdf.setTextColor(0, 0, 0);
    const nameParts = [header.partnerName || '', header.customerFullName, header.sideLabel ? `(${header.sideLabel})` : ''].filter(Boolean);
    let line1 = nameParts.join('   |   ');
    const availableLineWidth = (pageWidth - margin) - textX;
    let fontSize = 13;
    pdf.setFontSize(fontSize);
    let textWidth = pdf.getTextWidth(line1);
    while (textWidth > availableLineWidth && fontSize > 9) {
        fontSize -= 0.5;
        pdf.setFontSize(fontSize);
        textWidth = pdf.getTextWidth(line1);
    }

    const kdnrText = header.customerNumber !== undefined && header.customerNumber !== null ? `Kdnr: ${header.customerNumber}` : '';
    const dobText = header.dateOfBirthText ? `Geb.: ${header.dateOfBirthText}` : '';
    const lines: string[] = [line1];
    if (kdnrText) lines.push(kdnrText);
    if (dobText) lines.push(dobText);

    const lineGap = 7;
    const blockHeight = (lines.length - 1) * lineGap;
    const startY = (drewLogo ? (currentY + headerHeight / 2 - blockHeight / 2) : currentY + 10);
    let yCursor = startY;
    pdf.setFontSize(fontSize);
    pdf.text(line1, textX, yCursor);
    yCursor += lineGap;
    pdf.setFontSize(12);
    if (kdnrText) {
        pdf.text(kdnrText, textX, yCursor);
        yCursor += lineGap;
    }
    if (dobText) {
        pdf.text(dobText, textX, yCursor);
    }

    // Spacing below header (no divider line)
    currentY += headerHeight + 12;

    // Image
    const dataUrl = await fetchImageAsDataUrl(imageUrl);
    const availableWidth = pageWidth - margin * 2;
    const maxHeight = 240; // reasonable height
    pdf.addImage(dataUrl, 'JPEG', margin, currentY, availableWidth, maxHeight, undefined, 'FAST');

    return pdf.output('blob');
}

// Unified API: generate PDFs for right and/or left in one call
export async function generateFeetPdf(params: {
    leftImageUrl?: string | null;
    rightImageUrl?: string | null;
    header: FeetImagesPdfHeader;
}): Promise<{ left?: Blob; right?: Blob; }> {
    const { leftImageUrl, rightImageUrl, header } = params;
    const results: { left?: Blob; right?: Blob } = {};
    if (rightImageUrl) {
        results.right = await generateSingleFootPdf({
            imageUrl: rightImageUrl,
            header: { ...header, sideLabel: 'Right' }
        });
    }
    if (leftImageUrl) {
        results.left = await generateSingleFootPdf({
            imageUrl: leftImageUrl,
            header: { ...header, sideLabel: 'Left' }
        });
    }
    return results;
}