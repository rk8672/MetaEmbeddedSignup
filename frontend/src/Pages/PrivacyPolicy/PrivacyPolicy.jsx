import React from "react";

const privacySections = [
  {
    title: "1. Introduction",
    content: `Calc360 Technologies ("we", "us", or "our") is committed to protecting the privacy of individuals who use our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or use our software, platform, or any related services (collectively referred to as the "Service").`,
  },
  {
    title: "2. Legal Compliance",
    content: `We adhere to applicable data protection laws, including the Information Technology Act, 2000 (India), and comply with international standards such as the General Data Protection Regulation (GDPR), where applicable.`,
  },
  {
    title: "3. Information We Collect",
    content: `
    - Name and contact information (email, phone number)
    - Business or organizational details
    - Usage and activity logs
    - Device and technical data (IP address, browser type, etc.)
    - Payment and transaction-related information
    `,
  },
  {
    title: "4. Use of Information",
    content: `
    We use collected data to:
    - Provide and improve our services
    - Respond to support and service requests
    - Communicate important updates and alerts
    - Ensure platform security and performance
    - Comply with legal and regulatory obligations
    `,
  },
  {
    title: "5. Data Sharing and Disclosure",
    content: `
    We do not sell or rent your personal information. We may share information:
    - With trusted third-party service providers under strict confidentiality
    - For integration with third-party APIs (e.g., WhatsApp Business API)
    - To comply with legal obligations or government requests
    - To protect our rights, users, or the public as required by law
    `,
  },
  {
    title: "6. Data Security",
    content: `We implement technical and organizational security measures, including encryption, access control, and secure storage protocols to protect your information against unauthorized access, loss, or misuse.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain personal data only as long as necessary to fulfill the purposes for which it was collected, or as required by law. Once no longer needed, data is securely deleted or anonymized.`,
  },
  {
    title: "8. Your Rights",
    content: `
    You have the right to:
    - Access and review your data
    - Request corrections or deletions
    - Withdraw consent (where applicable)
    - File a complaint with a data protection authority
    `,
  },
  {
    title: "9. Cookies and Tracking Technologies",
    content: `Our platform may use cookies or similar technologies to enhance user experience, track usage patterns, and provide analytics. You may adjust your browser settings to decline cookies.`,
  },
  {
    title: "10. Third-Party Services",
    content: `We may use third-party tools or APIs (such as Meta platforms) that collect or process data. These services are governed by their own privacy policies, and we recommend reviewing them.`,
  },
  {
    title: "11. International Transfers",
    content: `If your data is transferred outside your country, we ensure adequate safeguards, such as contractual clauses or compliance with legal frameworks.`,
  },
  {
    title: "12. Policy Updates",
    content: `We may update this Privacy Policy from time to time to reflect changes in legal, technical, or business operations. The updated version will be posted with a revised "Last Updated" date.`,
  },
  {
    title: "13. Contact Information",
    content: `
    If you have questions or concerns about this policy, please contact us at:

    Calc360 Technologies  
    Email: support@calc360.com  
    Address: Parashurampur, Maharkha, Chandauli, UP 232120.  
    `,
  },
  {
    title: "14. Governing Law & Jurisdiction",
    content: `This Privacy Policy is governed by the laws of India. All disputes shall be subject to the jurisdiction of competent courts located in Chandauli, Uttar Pradesh, India.`,
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      {privacySections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
          <p className="text-gray-800 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
