const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment , getMyReceipts} = require('../controllers/payment.controller');

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/user/:email', getMyReceipts);

module.exports = router;
