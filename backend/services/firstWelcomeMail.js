const transporter = require("../config/mailConfig");

const sendSimpleEmail = async ({ to, fullName }) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject: "We've received your form - Cybervie",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h2>Hi ${fullName},</h2>
        <p>Thank you for submitting your form! We've received your information and are excited to help you start your cybersecurity journey.</p>
        
        <h3>What's Next?</h3>
        <p>Our team will review your details and get back to you within 24 hours with personalized guidance on your career transition.</p>
        
        <h3>Need Immediate Assistance?</h3>
        <p>If you're looking for a quicker response or need immediate attention, feel free to reach out to us directly on WhatsApp:</p>
        <p>
          👉 <a href="https://wa.link/ro3s07" target="_blank">https://wa.link/ro3s07</a>
        </p>

        <p>We're here to answer any questions and help you take the next step toward your cybersecurity career.</p>

        <br/>
        <p>Best regards,<br/>Cybervie</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
};

module.exports = { sendSimpleEmail };
