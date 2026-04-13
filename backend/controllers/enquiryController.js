const nodemailer = require('nodemailer');
const axios = require('axios');

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


    await transporter.sendMail({
      from: `"Service Request" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_NOTIFY_TO,
      subject: `New Service Request from ${displayName}`,
      text: `
New enquiry received via the Services Page:

👤 Name: ${displayName}
📧 Email: ${email}
📱 Mobile: ${displayMobile}
💬 Message/Request: 
${displayService}

🕒 ${new Date().toLocaleString()}
      `.trim(),
    });

    // 📱 Optional: Send SMS Notification to Admin Mobile (e.g. via MSG91)
    if (process.env.ADMIN_MOBILE && process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
      try {
        const payload = {
          template_id: process.env.MSG91_TEMPLATE_ID,
          recipients: [
            {
              mobiles: process.env.ADMIN_MOBILE.startsWith('91') ? process.env.ADMIN_MOBILE : `91${process.env.ADMIN_MOBILE}`,
              // Note: Using 'OTP' key here because the existing template is likely an OTP template.
              // If the user has a custom template, they would change this key to 'message' etc.
              OTP: `New Service Request from ${displayName}. Check email.`
            }
          ]
        };

        await axios.post("https://control.msg91.com/api/v5/flow", payload, {
          headers: {
            authkey: process.env.MSG91_AUTH_KEY,
            "Content-Type": "application/json"
          }
        });
        console.log("✅ Admin notified via SMS");
      } catch (smsError) {
        console.error("⚠️ SMS notification failed:", smsError.message);
        // Don't fail the whole request if only SMS fails
      }
    }

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