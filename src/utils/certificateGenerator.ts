
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ─────────────────────────────────────────────────────────────
// Helper: Load template bytes (cached in memory)
// ─────────────────────────────────────────────────────────────
let _templateCache: ArrayBuffer | null = null;

const getTemplateBytes = async (): Promise<ArrayBuffer> => {
  if (_templateCache) return _templateCache;
  const response = await fetch('/SERTIFIKAT.pdf');
  if (!response.ok) throw new Error('Gagal memuat template sertifikat.');
  _templateCache = await response.arrayBuffer();
  return _templateCache;
};

// ─────────────────────────────────────────────────────────────
// Helper: Load custom font (cached)
// ─────────────────────────────────────────────────────────────
let _fontCache: ArrayBuffer | null = null;
const getFontBytes = async (): Promise<ArrayBuffer | null> => {
  if (_fontCache) return _fontCache;
  try {
    const res = await fetch('/fonts/Cinzel.ttf');
    if (!res.ok) return null;
    _fontCache = await res.arrayBuffer();
    return _fontCache;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
// Draw one certificate page into a PDFDocument
// ─────────────────────────────────────────────────────────────
const drawCertPage = async (
  pdfDoc: PDFDocument,
  nama: string,
  jenisQurban?: string
) => {
  // Embed fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let customFont = helveticaFont;
  const fontBytes = await getFontBytes();
  if (fontBytes) {
    try {
      const fontkit = await import('@pdf-lib/fontkit');
      pdfDoc.registerFontkit(fontkit.default || fontkit);
      customFont = await pdfDoc.embedFont(fontBytes);
    } catch {
      // fallback to helvetica
    }
  }

  const pages = pdfDoc.getPages();
  const page = pages[pages.length - 1]; // work on the last added page
  const { width } = page.getSize();

  // Dynamic font size
  let fontSize = 28;
  if (nama.length > 25) fontSize = 18;
  else if (nama.length > 18) fontSize = 22;

  const textWidth = customFont.widthOfTextAtSize(nama, fontSize);

  page.drawText(nama, {
    x: (width - textWidth) / 2,
    y: 206,
    size: fontSize,
    font: customFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  if (jenisQurban) {
    let checkX = 0;
    const checkY = 170;
    const boxWidth = 12;
    const boxHeight = 12;

    if (jenisQurban === 'sapi-mandiri') checkX = 208;
    else if (jenisQurban === 'sapi-patungan') checkX = 285;
    else if (jenisQurban.startsWith('kambing')) checkX = 371;

    if (checkX > 0) {
      page.drawRectangle({
        x: checkX,
        y: checkY - 2,
        width: boxWidth,
        height: boxHeight,
        color: rgb(0.8, 0.15, 0.15),
      });
      page.drawText('v', {
        x: checkX + 3,
        y: checkY,
        size: 10,
        font: helveticaBoldFont,
        color: rgb(1, 1, 1),
      });
    }
  }
};

// ─────────────────────────────────────────────────────────────
// Generate single certificate (original behaviour)
// ─────────────────────────────────────────────────────────────
export const generateCertificate = async (
  nama: string,
  jenisQurban?: string
): Promise<Uint8Array> => {
  try {
    const templateBytes = await getTemplateBytes();
    const pdfDoc = await PDFDocument.load(templateBytes.slice(0)); // slice to clone

    await drawCertPage(pdfDoc, nama, jenisQurban);

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────
// Generate ALL certificates merged into one PDF
// ─────────────────────────────────────────────────────────────
export interface ShohibulCertInfo {
  nama: string;
  jenisQurban: string;
}

export const generateAllCertificates = async (
  shohibulList: ShohibulCertInfo[],
  onProgress?: (current: number, total: number) => void
): Promise<Uint8Array> => {
  const templateBytes = await getTemplateBytes();

  // Merged PDF document
  const mergedPdf = await PDFDocument.create();

  const total = shohibulList.length;

  for (let i = 0; i < total; i++) {
    const s = shohibulList[i];
    if (onProgress) onProgress(i + 1, total);

    // Load fresh copy of template for this entry
    const srcDoc = await PDFDocument.load(templateBytes.slice(0));

    // Embed font on source doc & draw name
    const helveticaFont = await srcDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await srcDoc.embedFont(StandardFonts.HelveticaBold);

    let customFont = helveticaFont;
    const fontBytes = await getFontBytes();
    if (fontBytes) {
      try {
        const fontkit = await import('@pdf-lib/fontkit');
        srcDoc.registerFontkit(fontkit.default || fontkit);
        customFont = await srcDoc.embedFont(fontBytes);
      } catch {
        // fallback
      }
    }

    const pages = srcDoc.getPages();
    const page = pages[0];
    const { width } = page.getSize();

    // Draw name
    const nama = s.nama;
    let fontSize = 28;
    if (nama.length > 25) fontSize = 18;
    else if (nama.length > 18) fontSize = 22;

    const textWidth = customFont.widthOfTextAtSize(nama, fontSize);
    page.drawText(nama, {
      x: (width - textWidth) / 2,
      y: 206,
      size: fontSize,
      font: customFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Draw checkbox
    const jenisQurban = s.jenisQurban;
    let checkX = 0;
    const checkY = 170;

    if (jenisQurban === 'sapi-mandiri') checkX = 208;
    else if (jenisQurban === 'sapi-patungan') checkX = 285;
    else if (jenisQurban.startsWith('kambing')) checkX = 371;

    if (checkX > 0) {
      page.drawRectangle({
        x: checkX,
        y: checkY - 2,
        width: 12,
        height: 12,
        color: rgb(0.8, 0.15, 0.15),
      });
      page.drawText('v', {
        x: checkX + 3,
        y: checkY,
        size: 10,
        font: helveticaBoldFont,
        color: rgb(1, 1, 1),
      });
    }

    // Copy page into merged doc
    const [copiedPage] = await mergedPdf.copyPages(srcDoc, [0]);
    mergedPdf.addPage(copiedPage);
  }

  return await mergedPdf.save();
};

// ─────────────────────────────────────────────────────────────
// Download helper
// ─────────────────────────────────────────────────────────────
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
