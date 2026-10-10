import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateLabReportPdf({
  studentName = 'Student',
  rollNo = 'N/A',
  rows = [],
  averageNA = 0,
  acceptanceAngle = 0,
  acceptanceCone = 0,
  theoreticalNA = null,
  percentageError = null
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 18;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(3, 105, 161); // Primary blue
  doc.text('FiberLab: Physics Laboratory Report', pageWidth / 2, currentY, { align: 'center' });

  currentY += 7;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('Determination of Numerical Aperture and Acceptance Angle', pageWidth / 2, currentY, { align: 'center' });

  currentY += 8;
  doc.setDrawColor(203, 213, 225); // Border slate 300
  doc.setLineWidth(0.5);
  doc.line(14, currentY, pageWidth - 14, currentY);

  // Student Information Box
  currentY += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  doc.text(`Student Name: ${studentName || 'Not specified'}`, 14, currentY);
  doc.text(`Roll Number: ${rollNo || 'Not specified'}`, pageWidth / 2 + 10, currentY);

  currentY += 5;
  doc.text(`Date of Experiment: ${new Date().toLocaleDateString()}`, 14, currentY);
  doc.text('Apparatus: Diode Laser (650 nm), Multimode Fiber, Screen', pageWidth / 2 + 10, currentY);

  currentY += 8;
  doc.line(14, currentY, pageWidth - 14, currentY);

  // Aim Section
  currentY += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. AIM', 14, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'To determine the numerical aperture (NA) and acceptance angle of a given step-index optical fiber using a 650 nm diode laser source and projection screen.',
    14,
    currentY,
    { maxWidth: pageWidth - 28 }
  );

  // Formula Section
  currentY += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. FORMULA', 14, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Numerical Aperture (NA):  NA = (D / 2) / sqrt(L^2 + (D / 2)^2)', 14, currentY);
  currentY += 5;
  doc.text('Acceptance Angle (theta_0):  theta_0 = arcsin(NA) degrees', 14, currentY);
  currentY += 5;
  doc.text('Acceptance Cone Angle:  2 * theta_0 degrees', 14, currentY);
  currentY += 5;
  doc.text('Where L is distance from fiber tip to screen (cm) and D is spot diameter (cm).', 14, currentY);

  // Observation Table
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. OBSERVATION TABLE', 14, currentY);

  const tableBody = rows.map((r, i) => {
    const halfD = r.halfD !== undefined && r.halfD !== '' ? String(r.halfD) : (Number(r.D) / 2).toFixed(3);
    const hyp = r.hypotenuse !== undefined && r.hypotenuse !== '' ? String(r.hypotenuse) : Math.sqrt(Number(r.L) ** 2 + (Number(r.D) / 2) ** 2).toFixed(4);
    const na = r.NA !== undefined && r.NA !== '' ? String(r.NA) : 'N/A';
    const th = r.theta !== undefined && r.theta !== '' ? String(r.theta) : 'N/A';
    return [i + 1, r.L, r.D, halfD, hyp, na, th];
  });

  autoTable(doc, {
    startY: currentY + 3,
    head: [['S.No', 'L (cm)', 'D (cm)', 'D/2 (cm)', 'sqrt(L^2+(D/2)^2)', 'NA', 'theta (deg)']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [3, 105, 161],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2,
      font: 'courier'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center' }
    }
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // Results Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. RESULTS AND CONCLUSION', 14, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);

  const resultSentence = `The average numerical aperture of the given optical fiber is ${averageNA.toFixed(3)} and its acceptance angle is ${acceptanceAngle.toFixed(2)} degrees.`;
  doc.text(resultSentence, 14, currentY, { maxWidth: pageWidth - 28 });

  currentY += 5;
  doc.text(`Full acceptance cone (2 * theta_0): ${acceptanceCone.toFixed(2)} degrees.`, 14, currentY);

  if (theoreticalNA) {
    currentY += 5;
    doc.text(`Theoretical NA: ${theoreticalNA} | Percentage Error: ${percentageError !== null ? percentageError + '%' : 'N/A'}`, 14, currentY);
  }

  // Precautions Section
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('5. KEY PRECAUTIONS', 14, currentY);

  const precautions = [
    '1. Never look directly into the laser beam or fiber output tip while the laser is powered on.',
    '2. Keep the optical fiber straight without sharp bends or kinks.',
    '3. Clean fiber ends with optical tissue and do not touch the polished face with bare fingers.',
    '4. Ensure the fiber end is mounted perpendicular to the projection screen.',
    '5. Dim the ambient room lighting so the spot perimeter is clearly identified.'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  precautions.forEach(p => {
    currentY += 4.5;
    doc.text(p, 14, currentY);
  });

  // Footer note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by FiberLab Virtual Physics Laboratory: Academic Educational System', pageWidth / 2, 285, { align: 'center' });

  // Save PDF
  const filename = `FiberLab_Report_${rollNo || 'Student'}.pdf`.replace(/\s+/g, '_');
  doc.save(filename);
}
