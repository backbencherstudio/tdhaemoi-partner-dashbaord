
import jsPDF from 'jspdf';

// Interface for PDF header information
export interface FeetImagesPdfHeader {
    logoUrl?: string | null;
    partnerName?: string | null;
    customerFullName: string;
    customerNumber?: number | string | null;
    dateOfBirthText?: string | null;
}

// Helper function to fetch image as data URL
async function fetchImageAsDataUrl(url: string): Promise<string> {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

async function generateCombinedFeetPdf(params: {
    leftImageUrl: string;
    rightImageUrl: string;
    header: FeetImagesPdfHeader;
    leftFootLength?: number;
    rightFootLength?: number;
}): Promise<Blob> {
    const { leftImageUrl, rightImageUrl, header, leftFootLength = 0, rightFootLength = 0 } = params;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;

    // Helper function to add header to a page
    const addHeaderToPage = async (footLabel: string): Promise<number> => {
        let currentY = margin;
        const headerHeight = 24;
        let drewLogo = false;

        // Header section
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

        // Header text
        const textX = margin + 30;
        pdf.setTextColor(0, 0, 0);
        const nameParts = [header.partnerName || '', header.customerFullName, footLabel].filter(Boolean);
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

        return currentY + headerHeight + 12;
    };


    const addFootImage = async (imageUrl: string, currentY: number, footSide: 'L' | 'R'): Promise<void> => {
        const imageWidth = (pageWidth - margin * 2) * 0.75;
        const imageX = (pageWidth - imageWidth) / 2;
        const availableHeight = pageHeight - currentY - margin - 40;
        const maxImageHeight = Math.min(availableHeight, 280);
        const imageDataUrl = await fetchImageAsDataUrl(imageUrl);
        pdf.addImage(imageDataUrl, 'PNG', imageX, currentY, imageWidth, maxImageHeight, undefined, 'SLOW');
        const calculationY = currentY + maxImageHeight + 10;
        const footLength = footSide === 'L' ? leftFootLength : rightFootLength;

        if (footLength && footLength > 0) {
            const pelottenposition = (footLength + 5) * 0.66;

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Pelottenposition ${footSide} = ${pelottenposition.toFixed(1)}mm`,
                pageWidth / 2, calculationY, { align: 'center' });
        } else {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Pelottenposition ${footSide} = Fusslänge data not available`,
                pageWidth / 2, calculationY, { align: 'center' });
        }
    };

    // Page 1: Right Foot
    const rightFootY = await addHeaderToPage('Right Foot');
    await addFootImage(rightImageUrl, rightFootY, 'R');

    // Page 2: Left Foot
    pdf.addPage();
    const leftFootY = await addHeaderToPage('Left Foot');
    await addFootImage(leftImageUrl, leftFootY, 'L');

    return pdf.output('blob');
}

export async function generateFeetPdf(params: {
    leftImageUrl?: string | null;
    rightImageUrl?: string | null;
    header: FeetImagesPdfHeader;
    generateCombined?: boolean;
    leftFootLength?: number;
    rightFootLength?: number;
}): Promise<{ combined?: Blob; }> {
    const { leftImageUrl, rightImageUrl, header, generateCombined = false, leftFootLength, rightFootLength } = params;
    const results: { combined?: Blob; } = {};

    if (generateCombined && leftImageUrl && rightImageUrl) {
        results.combined = await generateCombinedFeetPdf({
            leftImageUrl,
            rightImageUrl,
            header,
            leftFootLength,
            rightFootLength
        });
    }

    return results;
}