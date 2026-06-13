"use client";

import React, { useState } from "react";
import { X, Loader2, CheckCircle2, Download, Printer, ArrowRight } from "lucide-react";
import { getUser } from "@/app/lib/token";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: any[];
    subtotal: number;
    discount: number;
    total: number;
    currency: string;
    onSuccess?: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

// ── Razorpay script loader ─────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function CheckoutModal({
    isOpen,
    onClose,
    items,
    subtotal,
    discount,
    total,
    currency,
    onSuccess,
}: CheckoutModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [receiptData, setReceiptData] = useState<any>(null);

    // ── Coupon Code State ──────────────────────────────────────────────────
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);

    // Final amounts after coupon discount
    const finalTotal = Math.max(total - couponDiscount, 0);
    const totalDiscount = discount + couponDiscount;

    const formatPrice = (price: number) =>
        price.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });

    // ── Apply Coupon ──────────────────────────────────────────────────────
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError(null);

        try {
            const res = await fetch(`${API_BASE}/api/coupons/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, orderAmount: total }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setCouponError(data.message || "Invalid coupon code");
                setCouponApplied(false);
                setCouponDiscount(0);
                return;
            }

            setCouponDiscount(data.discount);
            setCouponApplied(true);
            setCouponError(null);
        } catch {
            setCouponError("Could not apply coupon. Try again.");
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode("");
        setCouponApplied(false);
        setCouponDiscount(0);
        setCouponError(null);
    };

    // ── Razorpay Online Payment ─────────────────────────────────────────────
    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);

        const loaded = await loadRazorpayScript();
        if (!loaded) {
            setError("Failed to load payment gateway. Check your internet connection.");
            setIsProcessing(false);
            return;
        }

        const user = getUser();
        if (!user) {
            setError("Session expired. Please login again.");
            setIsProcessing(false);
            return;
        }

        try {
            // Create order on backend (amount after coupon discount)
            const res = await fetch(`${API_BASE}/api/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: finalTotal, currency: currency || "INR" }),
            });

            if (!res.ok) throw new Error("Could not create payment order.");
            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "Global Counselling Centre",
                description: items.map((i: any) => i.name || i.title || "Service").join(", "),
                handler: async (response: any) => {
                    try {
                        const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ...response,
                                userId: user._id || user.id,
                                userEmail: user.email,
                                items: items.map(i => ({
                                    title: i.name || i.title,
                                    price: i.price,
                                    currency: i.currency || "INR",
                                    serviceId: i.serviceId
                                })),
                                subtotal,
                                discount: totalDiscount,
                                total: finalTotal,
                                couponCode: couponApplied ? couponCode : null,
                                currency: currency || "INR"
                            }),
                        });

                        if (verifyRes.ok) {
                            const verifyData = await verifyRes.json();
                            setReceiptData(verifyData.receipt);
                            if (onSuccess) onSuccess();
                        } else {
                            setError("Payment verification failed. Please contact support.");
                        }
                    } catch {
                        setError("Payment verification failed. Please contact support.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: user.name || "",
                    email: user.email || "",
                    contact: user.phone || "",
                },
                theme: { color: "#302621" },
                modal: {
                    ondismiss: () => setIsProcessing(false),
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    // Receipt View
    if (receiptData) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
                <div className="bg-white w-full max-w-[500px] my-auto rounded-2xl sm:rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-500 font-sans overflow-hidden max-h-[95vh] flex flex-col">
                    {/* Success Ribbon */}
                    <div className="bg-[#10B981] py-3 sm:py-4 text-center flex-shrink-0">
                        <div className="flex items-center justify-center gap-2 text-white font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">
                            <CheckCircle2 size={16} />
                            Payment Successful
                        </div>
                    </div>

                    <div className="p-5 sm:p-8 md:p-10 overflow-y-auto">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-[20px] sm:text-[24px] font-serif font-black text-[#362B25] mb-1">Receipt</h2>
                            <p className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-black/40 break-all">ID: {receiptData.paymentId}</p>
                        </div>

                        {/* Details */}
                        <div className="space-y-5 sm:space-y-6 mb-8 sm:mb-10">
                            <div className="border-b border-black/5 pb-4">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-3 sm:mb-4">Purchased Services</h4>
                                <div className="space-y-2.5 sm:space-y-3">
                                    {receiptData.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center gap-2 bg-black/[0.02] p-2.5 sm:p-3 rounded-xl border border-black/5">
                                            <span className="text-[10px] sm:text-[11px] font-bold text-[#362B25] max-w-[160px] sm:max-w-[240px] truncate">{item.title}</span>
                                            <span className="text-[10px] sm:text-[11px] font-black text-[#362B25] whitespace-nowrap">{receiptData.currency} {formatPrice(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2.5 sm:space-y-3 px-1 sm:px-2">
                                <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-black/40">
                                    <span>Subtotal</span>
                                    <span>{receiptData.currency} {formatPrice(receiptData.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-green-600 gap-2">
                                    <span className="truncate">Discount Applied{receiptData.couponCode ? ` (${receiptData.couponCode})` : ""}</span>
                                    <span className="whitespace-nowrap">- {receiptData.currency} {formatPrice(receiptData.discount)}</span>
                                </div>
                                <div className="h-[1px] bg-black/5 my-2"></div>
                                <div className="flex justify-between text-[13px] sm:text-[14px] font-black text-[#362B25]">
                                    <span>Total Paid</span>
                                    <span className="text-red-600">{receiptData.currency} {formatPrice(receiptData.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                            <button className="flex items-center justify-center gap-2 bg-black/[0.03] hover:bg-black/[0.05] text-[#362B25] py-3 sm:py-3.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all">
                                <Download size={14} /> Download
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-black/[0.03] hover:bg-black/[0.05] text-[#362B25] py-3 sm:py-3.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all">
                                <Printer size={14} /> Printer
                            </button>
                        </div>

                        <button 
                            onClick={() => {
                                setReceiptData(null);
                                onClose();
                            }}
                            className="w-full bg-[#302621] text-white py-3.5 sm:py-4 rounded-3xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all hover:bg-black shadow-lg flex items-center justify-center gap-2"
                        >
                            Done <ArrowRight size={14} />
                        </button>

                        <p className="text-[8px] sm:text-[9px] text-center text-black/40 font-bold uppercase tracking-widest mt-5 sm:mt-6 break-all">
                            A copy has been sent to {receiptData.userEmail}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white w-full max-w-[480px] my-auto rounded-xl shadow-2xl relative animate-in zoom-in-95 duration-300 font-sans flex flex-col max-h-[95vh]">
                {/* Header */}
                <div className="pt-6 sm:pt-8 px-5 sm:px-8 pb-4 sm:pb-6 relative flex-shrink-0">
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <div className="h-[1px] bg-black/20 flex-1" />
                        <h2 className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.15em] text-[#362B25] whitespace-nowrap">Your Payment</h2>
                        <div className="h-[1px] bg-black/20 flex-1" />
                    </div>
                    <button onClick={onClose} className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-black/40 hover:text-black transition-all">
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-5 sm:px-8 md:px-10 pb-6 sm:pb-8 overflow-y-auto">
                    <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#362B25] gap-2">
                            <span className="opacity-80">Actual Amount:</span>
                            <span className="text-[#675F5B]/50 line-through whitespace-nowrap">{currency} {formatPrice(subtotal)}</span>
                        </div>
                        {couponApplied && (
                            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-green-600 gap-2">
                                <span>Coupon Discount:</span>
                                <span className="whitespace-nowrap">- {currency} {formatPrice(couponDiscount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#362B25] gap-2">
                            <span className="opacity-80">Amount:</span>
                            <span className="text-red-600 whitespace-nowrap">{currency} {formatPrice(finalTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#675F5B]/50 gap-2">
                            <span>You Save:</span>
                            <span className="whitespace-nowrap">{currency} {formatPrice(totalDiscount)}</span>
                        </div>
                    </div>

                    {/* Coupon Code Section */}
                    <div className="mb-5 sm:mb-6">
                        {!couponApplied ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={couponLoading}
                                    className="flex-1 w-full border border-black/10 rounded-2xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#362B25] placeholder-black/30 outline-none focus:border-[#302621]/40"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading || !couponCode.trim()}
                                    className="px-6 py-3 bg-[#302621] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-40 transition-all flex items-center justify-center min-w-[88px] w-full sm:w-auto"
                                >
                                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
                                    <span className="text-[11px] font-black text-green-700 uppercase tracking-wider break-all">{couponCode} Applied</span>
                                </div>
                                <button onClick={handleRemoveCoupon} className="text-[10px] font-bold text-red-500 uppercase self-end sm:self-auto">
                                    Remove
                                </button>
                            </div>
                        )}
                        {couponError && (
                            <p className="text-red-500 text-[10px] font-bold mt-2 px-1">{couponError}</p>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] font-bold text-center mb-4 bg-red-50 rounded-lg px-4 py-2">
                            {error}
                        </p>
                    )}

                    <div className="text-center mb-2 sm:mb-4">
                        <button
                            disabled={isProcessing}
                            onClick={handlePayment}
                            className="w-full bg-[#302621] text-white py-3.5 sm:py-4 rounded-3xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all hover:bg-[#251d1a] shadow-lg active:scale-95 flex items-center justify-center h-[50px] sm:h-[52px] disabled:opacity-60 disabled:cursor-not-allowed px-2 text-center"
                        >
                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : `Pay ${currency} ${formatPrice(finalTotal)}`}
                        </button>
                        <p className="text-[9px] text-[#675F5B] font-bold uppercase tracking-widest mt-3 sm:mt-4 opacity-70">
                            Secured by Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}