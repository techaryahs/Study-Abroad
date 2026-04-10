const nodemailer = require('nodemailer');

exports.sendEnquiry = async (req, res) => {

  const { name, email, mobile, message } = req.body;

  // Validate minimum requirements
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and a message/service description are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const displayName = name || 'Not provided';
    const displayMobile = mobile || 'Not provided';
    const displayService = message;
    const displayType = 'General Service Inquiry';

    await transporter.sendMail({
      from: `"Service Request" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_NOTIFY_TO,
      subject: `New Service Request from ${displayName}`,
      text: `
New enquiry received via the Services Page:

👤 Name: ${displayName}
📧 Email: ${email}
📱 Mobile: ${displayMobile}
📋 Type: ${displayType}
💬 Message/Request: 
${displayService}

🕒 ${new Date().toLocaleString()}
      `.trim(),
    });

    res.status(201).json({ ok: true, message: 'Enquiry sent successfully!' });

  } catch (error) {
    console.error('❌ Email failed:', error.message);
    
    if (error.code === 'EAUTH') {
      res.status(500).json({ error: 'Email authentication failed. Check backend configuration.' });
    } else {
      res.status(500).json({ error: 'Failed to send enquiry. Please try again later.' });
    }
  }
};