
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generateCertificate = async (nama: string, jenisQurban?: string) => {
  try {
    // Fetch the template
    const response = await fetch('/SERTIFIKAT.pdf');
    if (!response.ok) throw new Error('Gagal memuat template sertifikat.');
    const existingPdfBytes = await response.arrayBuffer();

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed the standard Helvetica fonts as fallback
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Try loading custom Cinzel font
    let customFont = helveticaFont;
    try {
      // Import fontkit dynamically or assuming it's imported globally. But for Vite we can use a dynamic import.
      const fontkit = await import('@pdf-lib/fontkit');
      pdfDoc.registerFontkit(fontkit.default || fontkit);
      const fontUrl = '/fonts/Cinzel.ttf';
      const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
      customFont = await pdfDoc.embedFont(fontBytes);
    } catch (e) {
      console.warn("Failed to load Cinzel font, falling back to Helvetica", e);
    }

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();

    // Adjust font size dynamically based on length for a clean and modern look
    let fontSize = 28;
    if (nama.length > 25) {
      fontSize = 18;
    } else if (nama.length > 18) {
      fontSize = 22;
    }

    const textWidth = customFont.widthOfTextAtSize(nama, fontSize);
    
    // Draw the name with a thinner font and higher Y coordinate (208 instead of 190) to prevent overlap
    firstPage.drawText(nama, {
      x: (width - textWidth) / 2,
      y: 206, // Slight adjustment for Cinzel baseline
      size: fontSize,
      font: customFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Draw the checkmark (V) inside the correct checkbox box
    if (jenisQurban) {
      let checkX = 0;
      let boxWidth = 12;
      let boxHeight = 12;
      const checkY = 165; // Precise height matching the checkbox visual on the template
      
      if (jenisQurban === 'sapi-mandiri') {
        checkX = 208; // Adjusted X for box
      } else if (jenisQurban === 'sapi-patungan') {
        checkX = 285; // Adjusted X for box
      } else if (jenisQurban.startsWith('kambing')) {
        checkX = 371; // Adjusted X for box
      }

      if (checkX > 0) {
        // Draw a solid red square to fill the checkbox
        firstPage.drawRectangle({
          x: checkX,
          y: checkY - 2, // Slight adjustment for exact box placement
          width: boxWidth,
          height: boxHeight,
          color: rgb(0.8, 0.15, 0.15), // Red color
        });
        // Also draw a white checkmark inside the red box for better aesthetics
        firstPage.drawText('v', {
          x: checkX + 3,
          y: checkY,
          size: 10,
          font: helveticaBoldFont,
          color: rgb(1, 1, 1),
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
