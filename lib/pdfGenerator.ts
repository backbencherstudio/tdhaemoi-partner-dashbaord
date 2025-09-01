import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PdfGenerationOptions {
    scale?: number;
    quality?: number;
    format?: 'jpeg' | 'png';
    width?: number;
    height?: number;
}

export const generatePdfFromElement = async (
    elementId: string,
    options: PdfGenerationOptions = {}
): Promise<Blob> => {
    const {
        scale = 2.0,        
        quality = 0.9,   
        format = 'jpeg',     
        width = 794,        
        height = 1123        
    } = options;

    // Find the element to convert
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
    }

    const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width,
        height,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById(elementId);
            if (clonedElement) {
                clonedElement.style.transform = 'none';
                clonedElement.style.transition = 'none';
            }
        }
    });

    const imgData = canvas.toDataURL(`image/${format}`, quality);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, format.toUpperCase(), 0, 0, imgWidth, imgHeight);

    // Return as blob
    return pdf.output('blob');
};

export const pdfPresets = {
    highQuality: {
        scale: 2.5,
        quality: 0.95,
        format: 'jpeg' as const
    },
    balanced: {
        scale: 2.0,
        quality: 0.9,
        format: 'jpeg' as const
    },
    smallSize: {
        scale: 1.5,
        quality: 0.8,
        format: 'jpeg' as const
    }
};
