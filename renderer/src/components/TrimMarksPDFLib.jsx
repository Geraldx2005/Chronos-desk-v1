// TrimMarksPDFLib.jsx
import { PDFDocument, rgb } from "pdf-lib";

export const addTrimMarksToPDF = async (pdfBytes) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();

      // Add trim marks to each page
      addPageTrimMarks(page, width, height);
    });

    return await pdfDoc.save();
  } catch (error) {
    console.error("Error adding trim marks:", error);
    throw error;
  }
};

const addPageTrimMarks = (page, pageWidth, pageHeight) => {
  const markThickness = 0.5;
  const horizontalPadding = 15.255;
  const verticalPadding = 10.11;
  const couponWidth = 119.07;
  const couponHeight = 212.63;

  // Different lengths for horizontal and vertical crop marks
//   const horizontalMarkLength = 10.11; // For vertical crop marks (top/bottom)
//   const verticalMarkLength = 15.255; // For horizontal crop marks (left/right)
  const horizontalMarkLength = 8; // For vertical crop marks (top/bottom)
  const verticalMarkLength = 8; // For horizontal crop marks (left/right)


  // Calculate number of coupons per row and column
  const couponsPerRow = Math.floor((pageWidth - 2 * horizontalPadding) / couponWidth);
  const couponsPerColumn = Math.floor((pageHeight - 2 * verticalPadding) / couponHeight);

  // Offset for crop marks (distance from edge of the page)
  const Xoffset = 2.11;
  const Yoffset = 7.255;

  // Top and bottom vertical crop marks
  for (let i = 0; i <= couponsPerRow; i++) {
    const x = horizontalPadding + i * couponWidth;

    // Draw vertical crop mark at top (start 3pt below top edge)
    page.drawLine({
      start: { x: x, y: pageHeight - Xoffset },
      end: { x: x, y: pageHeight - horizontalMarkLength - Xoffset },
      thickness: markThickness,
      color: rgb(0, 0, 0),
    });

    // Draw vertical crop mark at bottom (start 3pt above bottom edge)
    page.drawLine({
      start: { x: x, y: Xoffset },
      end: { x: x, y: horizontalMarkLength + Xoffset },
      thickness: markThickness,
      color: rgb(0, 0, 0),
    });
  }

  // Left and right horizontal crop marks
  for (let i = 0; i <= couponsPerColumn; i++) {
    const y = verticalPadding + i * couponHeight;

    // Draw horizontal crop mark at left (using verticalMarkLength)
    page.drawLine({
      start: { x: Yoffset, y: y },
      end: { x: verticalMarkLength + Yoffset, y: y },
      thickness: markThickness,
      color: rgb(0, 0, 0),
    });

    // Draw horizontal crop mark at right (using verticalMarkLength)
    page.drawLine({
      start: { x: pageWidth - verticalMarkLength - Yoffset, y: y },
      end: { x: pageWidth - Yoffset, y: y },
      thickness: markThickness,
      color: rgb(0, 0, 0),
    });
  }

  // Corner trim marks
  const corners = [
    // Top-left
    { x: 0, y: pageHeight },
    // Top-right
    { x: pageWidth, y: pageHeight },
    // Bottom-left
    { x: 0, y: 0 },
    // Bottom-right
    { x: pageWidth, y: 0 },
  ];

  // Draw corner marks
  corners.forEach((corner) => {
    // Horizontal marks (using verticalMarkLength)
    page.drawLine({
      start: { x: corner.x - verticalMarkLength, y: corner.y },
      end: { x: corner.x + verticalMarkLength, y: corner.y },
      thickness: markThickness,
      color: rgb(0, 0, 0),
    });

    // Vertical marks (using horizontalMarkLength)
    page.drawLine({
      start: { x: corner.x, y: corner.y - horizontalMarkLength },
      end: { x: corner.x, y: corner.y + horizontalMarkLength },
      thickness: markThickness,
      color: rgb(0, 0, 0),
    });
  });
};
