const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, verifyApplePayment, getMyReceipts } = require('../controllers/payment.controller');

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/verify-apple', verifyApplePayment);
router.get('/user/:email', getMyReceipts);

module.exports = router;
