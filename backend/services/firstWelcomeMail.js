const transporter = require("../config/mailConfig");

const sendSimpleEmail = async ({ to, fullName }) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject: "Registration Confirmation - CyberVie",
    html: `
      <div style="font-family:Arial, sans-serif; padding:20px;">
        <h2>Hello ${fullName},</h2>
        <p>🎉 Thank you for registering with us!</p>
        <p>Our executive will contact you shortly to assist with your enrollment process.</p>
        <p>You can also check your enrollment status anytime.</p>
        <p>
          👉 <strong>Click on "Already have account"</strong> and enter your registered email to track your progress.
        </p>
        <br/>
        <p>Best Regards,<br/>Team CyberVie</p>
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
