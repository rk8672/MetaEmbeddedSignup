import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import axiosInstance from "../../utils/axiosInstance";
import PageWrapper from "../../layouts/PageWrapper";

const CertificateGenerator = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default today
  const [certificateNumber, setCertificateNumber] = useState("");

  // Fetch enrolled leads
  useEffect(() => {
    const fetchEnrolledLeads = async () => {
      try {
        const res = await axiosInstance.get("/api/leads/enrolled");
        setLeads(res.data);
      } catch (err) {
        console.error("Failed to fetch enrolled leads:", err);
      }
    };
    fetchEnrolledLeads();
  }, []);

  // Generate certificate number when lead is selected
  useEffect(() => {
    const fetchCertificateNumber = async () => {
      if (!selectedLead) return setCertificateNumber("");
      try {
        const res = await axiosInstance.post("/api/certificates/generate-number", {
          leadId: selectedLead,
        });
        setCertificateNumber(res.data.certificateNumber);
      } catch (err) {
        console.error("Failed to generate certificate number:", err);
      }
    };
    fetchCertificateNumber();
  }, [selectedLead]);

  const generatePDF = async () => {
    if (!selectedLead) return alert("Select a lead");

    const leadName = leads.find((l) => l._id === selectedLead)?.fullName || "";

    const existingPdfBytes = await fetch("/Certificate.pdf").then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const firstPage = pdfDoc.getPages()[0];
    const { height } = firstPage.getSize();
    const fontBig = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontSmall = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    firstPage.drawText(leadName, {
      x: 99,
      y: height - 320,
      size: 22,
      font: fontBig,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(certificateNumber, {
      x: 98,
      y: height - 450,
      size: 12,
      font: fontSmall,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(date, {
      x: 357,
      y: height - 450,
      size: 12,
      font: fontSmall,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "Generated-Certificate.pdf", "application/pdf");

    // ✅ Optional: Call API to save certificate info with Google Drive link
    // await axiosInstance.post("/api/certificates/create", {
    //   leadId: selectedLead,
    //   name: leadName,
    //   date,
    //   certificateNumber,
    //   publicLink: "GOOGLE_DRIVE_PUBLIC_LINK_HERE",
    // });
  };

  return (
    <PageWrapper title="Generate Certificate" subtitle="Generate certificate here">
    
  <div className="p-6 max-w-lg shadow border mx-auto rounded-5 space-y-4">
    <h2 className="text-2xl font-bold mb-4">Enter Details of Student</h2>

    {/* Lead select */}
    <div className="flex flex-col">
      <label htmlFor="lead" className="mb-1 font-medium text-gray-700">
        Select Student
      </label>
      <select
        id="lead"
        className="w-full p-2 border rounded"
        value={selectedLead}
        onChange={(e) => setSelectedLead(e.target.value)}
      >
        <option value="">Select Student</option>
        {leads.map((lead) => (
          <option key={lead._id} value={lead._id}>
            {lead.fullName}
          </option>
        ))}
      </select>
    </div>

    {/* Date input */}
    <div className="flex flex-col">
      <label htmlFor="date" className="mb-1 font-medium text-gray-700">
        Date of Issue
      </label>
      <input
        id="date"
        className="w-full p-2 border rounded"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

    {/* Certificate number */}
    <div className="flex flex-col">
      <label htmlFor="certificateNumber" className="mb-1 font-medium text-gray-700">
        Certificate Number
      </label>
      <input
        id="certificateNumber"
        className="w-full p-2 border bg-gray-100 rounded"
        type="text"
        placeholder="Certificate Number"
        value={certificateNumber}
        readOnly
      />
    </div>

    <button
      onClick={generatePDF}
      className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
    >
      Download Certificate
    </button>
  </div>
    </PageWrapper>
  );
};

export default CertificateGenerator;
