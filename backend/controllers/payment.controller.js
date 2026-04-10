const Razorpay = require('razorpay');
const crypto = require('crypto');
const Receipt = require('../models/Receipt');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // paise
            currency,
            receipt: `receipt_${Date.now()}`,
        });
        res.json(order);
    } catch (err) {
        console.error('Razorpay create order error:', err);
        res.status(500).json({ error: 'Failed to create order', details: err.message });
    }
};

// POST /api/payment/verify
const verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            userId,
            userEmail,
            items,
            subtotal,
            discount,
            total,
            currency
        } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Save receipt to DB
            const newReceipt = new Receipt({
                userId,
                userEmail,
                items,
                subtotal,
                discount,
                total,
                currency,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                status: 'paid'
            });

            await newReceipt.save();

            res.json({ 
                success: true, 
                message: 'Payment verified and receipt saved',
                receipt: newReceipt 
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (err) {
        console.error('Razorpay verify error:', err);
        res.status(500).json({ error: 'Verification failed', details: err.message });
    }
};

const getMyReceipts = async (req, res) => {
    try {
        const { email } = req.params;
        const receipts = await Receipt.find({ userEmail: email }).sort({ createdAt: -1 });
        res.json(receipts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch receipts' });
    }
};

module.exports = { createOrder, verifyPayment, getMyReceipts };
