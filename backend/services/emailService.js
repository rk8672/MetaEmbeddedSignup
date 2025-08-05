const transporter = require("../config/mailConfig");

const sendPaymentEmail = async ({ to, fullName, link, amount }) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject: "Your Payment Link - Please Complete Payment",
    html: `
      <div style="font-family:sans-serif; padding:20px;">
        <h2>Hello ${fullName},</h2>
        <p>Thank you for enrolling. Please click the button below to complete your payment of ₹${amount}.</p>
        <p><a href="${link}" target="_blank" style="background:#006699;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Pay Now</a></p>
        <br/>
        <p>If the button doesn't work, copy and paste this link: <br/>${link}</p>
        <br/>
        <p>Regards,<br/>Team CyberVie</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
};

module.exports = {  sendPaymentEmail };
