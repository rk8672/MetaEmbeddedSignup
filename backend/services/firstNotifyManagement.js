const transporter = require("../config/mailConfig");

const notifyManagement = async ({ fullName, email, mobile }) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: "info@cybervie.com", 
    // to: "rky8672@gmail.com", 
    subject: "New Lead Registered - Cybervie",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h2>New Lead Registered</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${mobile}</p>
        <br/>
        <p>This lead has just submitted the form on the website. Please follow up accordingly.</p>
        <br/>
        <p>Regards,<br/>Cybervie System</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Management notification email error:", error);
    return { success: false, error };
  }
};

module.exports = { notifyManagement };
