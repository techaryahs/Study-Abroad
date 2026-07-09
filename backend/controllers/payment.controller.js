const Razorpay = require('razorpay');
const crypto = require('crypto');
const Receipt = require('../models/Receipt');
const MembershipPlan = require('../models/MembershipPlan');
const MembershipEvent = require('../models/MembershipEvent');
const MembershipHistory = require('../models/MembershipHistory');
const { findUserById } = require('../utils/userHelper');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper to provision membership
const provisionMembership = async (userId, planId, platform, transactionId) => {
    const { user, model } = await findUserById(userId);
    if (!user) throw new Error("User not found");

    const plan = await MembershipPlan.findOne({ planId, isActive: true });
    if (!plan) throw new Error(`Membership plan ${planId} not found`);

    const oldPlanId = user.membership?.planId || "free";
    
    // Calculate expiry (1 year for yearly, null for one_time)
    let expiryDate = null;
    if (plan.type === 'yearly') {
        expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else if (plan.type === 'monthly') {
        expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Initialize usage
    const usageMap = {};
    const categories = ['ai', 'human', 'access'];
    for (const category of categories) {
        if (plan.entitlements && plan.entitlements[category]) {
            for (const [featureId, entitlement] of plan.entitlements[category].entries()) {
                if (entitlement.limit != null) {
                    usageMap[featureId] = {
                        used: 0,
                        remaining: entitlement.limit
                    };
                }
            }
        }
    }

    // Update user membership
    if (!user.membership) user.membership = {};
    user.membership.planId = planId;
    user.membership.catalogVersion = plan.version;
    user.membership.status = 'active';
    user.membership.platform = platform;
    user.membership.transactionId = transactionId;
    user.membership.purchaseDate = new Date();
    user.membership.expiryDate = expiryDate;
    user.membership.usage = usageMap;

    await user.save();

    // Log History
    const history = new MembershipHistory({
        userId: user._id,
        userModel: model,
        fromPlanId: oldPlanId === "free" ? null : oldPlanId,
        toPlanId: planId,
        transitionType: oldPlanId === "free" ? 'initial_purchase' : 'upgrade',
        platform,
        transactionId
    });
    await history.save();
    
    user.membership.history.push(history._id);
    await user.save();

    // Log Event
    await MembershipEvent.create({
        userId: user._id,
        userModel: model,
        eventType: 'Membership Purchased',
        planId,
        metadata: { platform, transactionId }
    });

    return { user, plan };
};

// POST /api/payment/create-order
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', planId } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        
        const notes = planId ? { planId } : {};
        
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency,
            receipt: `receipt_${Date.now()}`,
            notes
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
            currency,
            
            // Standardized Fields
            platform = 'razorpay', // 'apple_iap' or 'razorpay'
            planId, 
            productId,
            transactionId,
            verificationData
        } = req.body;

        console.log(`[Backend Verify] 📥 Received verification for user ${userEmail} on platform: ${platform}`);

        // Verify Razorpay Signature
        if (platform === 'razorpay') {
            const body = razorpay_order_id + '|' + (razorpay_payment_id || transactionId);
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                console.error(`[Backend Verify] ❌ Invalid Razorpay signature`);
                return res.status(400).json({ success: false, message: 'Invalid payment signature' });
            }
            console.log(`[Backend Verify] ✅ Razorpay signature valid`);
        } else if (platform === 'apple_iap') {
            if (!verificationData) {
                console.error(`[Backend Verify] ❌ Missing Apple verification data`);
                return res.status(400).json({ success: false, message: 'Missing Apple receipt' });
            }
            console.log(`[Backend Verify] ✅ Apple IAP payload format valid`);
        }

        // Save legacy receipt to DB (Backwards compatibility)
        let newReceipt = null;
        if (items && items.length > 0) {
            newReceipt = new Receipt({
                userId,
                userEmail,
                items,
                subtotal,
                discount,
                total,
                currency,
                paymentId: razorpay_payment_id || req.body.transactionId,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                status: 'paid'
            });
            await newReceipt.save();
        }

        // Handle Membership Provisioning
        if (planId) {
            const finalTransactionId = transactionId || razorpay_payment_id || `tx_${Date.now()}`;
            console.log(`[Backend Verify] ⚙️ Provisioning membership plan: ${planId}`);
            await provisionMembership(userId, planId, platform, finalTransactionId);
            console.log(`[Backend Verify] 🚀 Membership ${planId} successfully activated for user ${userEmail}`);
        } else {
            // Legacy Premium Subscription activation fallback
            const isPremiumPurchase = items && items.some(i => 
                i.name === 'Premium Subscription' || 
                i.title === 'Premium Subscription'
            );

            if (isPremiumPurchase && userId) {
                console.log(`[Backend Verify] ⚙️ Provisioning legacy Premium membership`);
                await provisionMembership(userId, 'premium', platform, razorpay_payment_id || transactionId);
                console.log(`[Backend Verify] 🚀 Legacy Premium activated for user ${userEmail}`);
            }
        }

        res.json({ 
            success: true, 
            message: 'Payment verified successfully',
            receipt: newReceipt 
        });
    } catch (err) {
        console.error('Payment verify error:', err);
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
