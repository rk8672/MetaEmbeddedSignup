import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import PageWrapper from "../../layouts/PageWrapper";
const CertificateGenerator = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");

  const generatePDF = async () => {
    // Load your background certificate PDF template
    const existingPdfBytes = await fetch("/Certificate.pdf").then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const {  height } = firstPage.getSize();

    const fontbig = await pdfDoc.embedFont(StandardFonts.TimesRoman);
     const fontsmall = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Add name (adjust X/Y as needed based on your template)
    firstPage.drawText(name, {
      x: 99, // adjust this
      y: height - 320, // adjust this
      size: 22,
      font:fontbig,
      color: rgb(0, 0, 0),
    });

    // Add date (adjust X/Y as needed)
    firstPage.drawText( certificateNumber, {
      x: 98, // adjust this
      y: height - 450, // adjust this
      size: 12,
      font:fontsmall,
      color: rgb(0, 0, 0),
    });

    // Add certificate number
    firstPage.drawText(date, {
      x: 357, // adjust this
      y: height - 450, // adjust this
      size: 12,
      font:fontsmall,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "Generated-Certificate.pdf", "application/pdf");
  };

  return (
        <PageWrapper title="Generate Certificate" subtitle="Generate certificate here">
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">Generate Certificate</h2>
      <input
        className="w-full p-2 border"
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full p-2 border"
        type="text"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        className="w-full p-2 border"
        type="text"
        placeholder="Certificate Number"
        value={certificateNumber}
        onChange={(e) => setCertificateNumber(e.target.value)}
      />
      <button
        onClick={()=>generatePDF(name,date,certificateNumber)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download Certificate
      </button>
    </div>
    </PageWrapper>
  );
};

export default CertificateGenerator;
