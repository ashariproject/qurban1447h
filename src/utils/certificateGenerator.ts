
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generateCertificate = async (nama: string, jenisQurban?: string) => {
  try {
    // Fetch the template
    const response = await fetch('/SERTIFIKAT.pdf');
    if (!response.ok) throw new Error('Gagal memuat template sertifikat.');
    const existingPdfBytes = await response.arrayBuffer();

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed the standard Helvetica fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();

    // Adjust font size dynamically based on length for a clean and modern look
    let fontSize = 26;
    if (nama.length > 25) {
      fontSize = 16;
    } else if (nama.length > 18) {
      fontSize = 20;
    }

    const textWidth = helveticaFont.widthOfTextAtSize(nama, fontSize);
    
    // Draw the name with a thinner font and higher Y coordinate (208 instead of 190) to prevent overlap
    firstPage.drawText(nama, {
      x: (width - textWidth) / 2,
      y: 208,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Draw the checkmark (V) inside the correct checkbox box
    if (jenisQurban) {
      let checkX = 0;
      const checkY = 164.5; // Precise height matching the checkbox visual on the template
      
      if (jenisQurban === 'sapi-mandiri') {
        checkX = 212.5;
      } else if (jenisQurban === 'sapi-patungan') {
        checkX = 289.5;
      } else if (jenisQurban.startsWith('kambing')) {
        checkX = 375.5;
      }

      if (checkX > 0) {
        firstPage.drawText('V', {
          x: checkX,
          y: checkY,
          size: 11,
          font: helveticaBoldFont,
          color: rgb(0.1, 0.1, 0.1),
        });
      }
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    
    return pdfBytes;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

export const downloadPDF = (bytes: Uint8Array, fileName: string) => {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
