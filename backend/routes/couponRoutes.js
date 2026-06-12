const express = require('express');
const router = express.Router();
const {
  applyCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');

// Public - used at checkout
router.post('/apply', applyCoupon);

// Admin - manage coupons
router.post('/create', createCoupon);
router.get('/', getCoupons);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;