const axios = require("axios");
const logger = require("./logger");

/**
 * Sends an OTP via MSG91 Flow API.
 * 
 * @param {string} phone - 10-digit mobile number
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<{success: boolean, message: string}>}
 */
const sendSMSOTP = async (phone, otp) => {
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;

    if (!msg91AuthKey || !msg91TemplateId) {
        logger.error("MSG91 credentials missing (AuthKey/TemplateId)");
        return { success: false, message: "SMS provider configuration missing" };
    }

    const cleanedPhone = String(phone).trim().replace(/[\s().-]/g, "");
    const formattedPhone = cleanedPhone.startsWith("+") ? cleanedPhone : `+91${cleanedPhone}`;

    logger.debug(`Dispatching OTP to ${formattedPhone}: ${logger.maskOtp(otp)}`);

    const payload = {
        template_id: msg91TemplateId,
        short_url: 0,
        realTimeResponse: 1,
        recipients: [
            {
                mobiles: formattedPhone,
                OTP: otp
            }
        ]
    };

    try {
        const response = await axios.post(
            "https://control.msg91.com/api/v5/flow",
            payload,
            {
                headers: {
                    authkey: msg91AuthKey,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.data.type === "success") {
            return { success: true, message: "OTP sent successfully" };
        } else {
            return { success: false, message: response.data.message || "Failed to send OTP" };
        }
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        logger.error("MSG91 API Error:", errorMsg);
        return { success: false, message: errorMsg };
    }
};

module.exports = { sendSMSOTP };
