const nodemailer = require('nodemailer');
require('dotenv').config(); // loads .env file

// 1. Setup Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 2. Send Function
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"MyApp" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
