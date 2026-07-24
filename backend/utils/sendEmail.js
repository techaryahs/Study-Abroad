const nodemailer = require("nodemailer");
const logger = require("./logger");

const sendEmail = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    logger.info("Email sent successfully to " + logger.maskEmail(email));
  } catch (error) {
    logger.error("Failed to send email to " + logger.maskEmail(email), error);
  }
};

module.exports = sendEmail;
