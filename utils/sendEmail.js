const nodemailer = require('nodemailer');
 
const sendEmail = async (to, subject, text) => {
  try {
    // SendGrid SMTP Configuration Setup
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text
    };

    // Email send trigger
    await transporter.sendMail(mailOptions);
    console.log('SendGrid: Confirmation email sent successfully to', to);
  } catch (error) {
    console.error('SendGrid Email sending failed:', error);
  }
};

module.exports = sendEmail;