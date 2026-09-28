const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    items: [
      {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        serviceId: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },
    status: { type: String, default: "paid" },
  },
  { timestamps: true }
);

receiptSchema.index({ paymentId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
