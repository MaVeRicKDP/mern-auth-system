require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,  // send to yourself
      subject: 'Test Email from Node',
      text: 'This is a test email. If you get this, nodemailer is working!',
    });

    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending test email:', err);
  }
}

sendTestEmail();
