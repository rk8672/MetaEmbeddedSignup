import React from "react";

const termsSections = [
  {
    title: "1. Introduction",
    content: `These Terms and Conditions ("Terms") govern your use of the website, services, and software provided by Calc360 Technologies ("we", "us", or "our"). By accessing or using our services, you agree to be legally bound by these Terms.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years old and legally capable of entering into a binding agreement in your jurisdiction to use our services.`,
  },
  {
    title: "3. Account Registration",
    content: `You may be required to register an account to access certain services. You agree to provide accurate and complete information and to keep your login credentials secure. You are solely responsible for all activities under your account.`,
  },
  {
    title: "4. Use of Services",
    content: `
    You agree to:
    - Use the services only for lawful purposes
    - Not misuse, reverse-engineer, or disrupt our platform
    - Comply with all applicable laws and regulations
    `,
  },
  {
    title: "5. Payment and Subscription",
    content: `If your use of the service requires payment, you agree to pay all applicable fees on time. Subscription fees are billed as per the plan selected and are non-refundable unless otherwise stated in writing.`,
  },
  {
    title: "6. Intellectual Property",
    content: `All content, software, and intellectual property rights in our platform are owned by Calc360 Technologies. You may not reproduce, modify, or distribute any part of the service without our prior written consent.`,
  },
  {
    title: "7. Data Privacy",
    content: `Your use of our services is also governed by our Privacy Policy, which explains how we collect, use, and protect your data.`,
  },
  {
    title: "8. Termination",
    content: `We reserve the right to suspend or terminate your access to our services at our sole discretion, with or without notice, if you violate these Terms or applicable laws.`,
  },
  {
    title: "9. Disclaimer of Warranty",
    content: `Our services are provided "as is" and "as available". We do not guarantee uninterrupted or error-free service. To the fullest extent permitted by law, we disclaim all warranties, express or implied.`,
  },
  {
    title: "10. Limitation of Liability",
    content: `Calc360 Technologies shall not be liable for any indirect, incidental, or consequential damages arising out of or related to the use of our services, even if advised of the possibility of such damages.`,
  },
  {
    title: "11. Indemnification",
    content: `You agree to indemnify and hold harmless Calc360 Technologies, its directors, employees, and partners from any claims, damages, or losses arising out of your use of the services or your violation of these Terms.`,
  },
  {
    title: "12. Third-Party Services",
    content: `Our services may include links or integrations with third-party platforms. We are not responsible for the content, policies, or practices of such third parties.`,
  },
  {
    title: "13. Changes to Terms",
    content: `We may modify these Terms at any time. Updates will be posted on this page with a revised effective date. Continued use of the services after changes constitutes your acceptance of the new Terms.`,
  },
  {
    title: "14. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Chandauli, Uttar Pradesh, India.`,
  },
  {
    title: "15. Contact Information",
    content: `
    If you have any questions about these Terms, please contact:

    Calc360 Technologies  
    Email: support@calc360.com  
    Address: Parashurampur, Maharkha, Chandauli, Uttar Pradesh 232120.
    `,
  },
];

const TermsAndConditions = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>
      {termsSections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
          <p className="text-gray-800 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TermsAndConditions;
