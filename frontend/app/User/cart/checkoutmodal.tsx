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

// Load Razorpay Script
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

    const formatPrice = (price: number) =>
        price.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });

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
            // Create order on backend
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"}/api/payment/create-order`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: total, currency: currency || "INR" }),
                }
            );

            if (!res.ok) throw new Error("Could not create payment order.");
            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "International Eduleader Council",
                description: items.map((i: any) => i.name || i.title || "Service").join(", "),
                handler: async (response: any) => {
                    const verifyRes = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001"}/api/payment/verify`,
                        {
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
                                discount,
                                total,
                                currency: currency || "INR"
                            }),
                        }
                    );
                    
                    if (verifyRes.ok) {
                        const verifyData = await verifyRes.json();
                        setReceiptData(verifyData.receipt);
                        if (onSuccess) onSuccess();
                    } else {
                        setError("Payment verification failed. Please contact support.");
                        setIsProcessing(false);
                    }
                },
                prefill: { 
                    name: user.name || "", 
                    email: user.email || "", 
                    contact: user.phone || "" 
                },
                theme: { color: "#302621" },
                modal: { ondismiss: () => setIsProcessing(false) },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!receiptData) return;
        
        let text = `INTERNATIONAL EDULEADER COUNCIL\n`;
        text += `===================================\n\n`;
        text += `RECEIPT\n`;
        text += `ID: ${receiptData.paymentId}\n`;
        text += `Email: ${receiptData.userEmail}\n\n`;
        text += `PURCHASED SERVICES:\n`;
        receiptData.items.forEach((item: any) => {
            text += `- ${item.title} (${receiptData.currency} ${formatPrice(item.price)})\n`;
        });
        text += `\n-----------------------------------\n`;
        text += `Subtotal: ${receiptData.currency} ${formatPrice(receiptData.subtotal)}\n`;
        text += `Discount: - ${receiptData.currency} ${formatPrice(receiptData.discount)}\n`;
        text += `Total Paid: ${receiptData.currency} ${formatPrice(receiptData.total)}\n`;
        text += `===================================\n`;
        text += `Thank you for your payment!\n`;

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Receipt_${receiptData.paymentId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    // Receipt View
    if (receiptData) {
        return (
            <div className="fixed inset-0 z-[40] flex flex-col items-center p-4 pt-24 pb-10 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto overflow-x-hidden">
                <div className="bg-white w-full max-w-[500px] rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-500 font-sans overflow-hidden my-auto shrink-0 print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none">
                    {/* Success Ribbon */}
                    <div className="bg-[#10B981] py-4 text-center print:hidden">
                        <div className="flex items-center justify-center gap-2 text-white font-black text-[11px] uppercase tracking-[0.2em]">
                            <CheckCircle2 size={16} />
                            Payment Successful
                        </div>
                    </div>

                    <div className="p-10 print:p-0">
                        <div className="text-center mb-8">
                            <h2 className="text-[24px] font-serif font-black text-[#362B25] mb-1">Receipt</h2>
                            <p className="text-[10px] uppercase font-black tracking-widest text-black/40">ID: {receiptData.paymentId}</p>
                        </div>

                        {/* Details */}
                        <div className="space-y-6 mb-10">
                            <div className="border-b border-black/5 pb-4">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-4">Purchased Services</h4>
                                <div className="space-y-3">
                                    {receiptData.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center bg-black/[0.02] p-3 rounded-xl border border-black/5 print:border-none print:p-0 print:bg-transparent print:mb-2">
                                            <span className="text-[11px] font-bold text-[#362B25] max-w-[240px] truncate print:whitespace-normal">{item.title}</span>
                                            <span className="text-[11px] font-black text-[#362B25]">{receiptData.currency} {formatPrice(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 px-2 print:px-0">
                                <div className="flex justify-between text-[11px] font-bold text-black/40">
                                    <span>Subtotal</span>
                                    <span>{receiptData.currency} {formatPrice(receiptData.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-green-600">
                                    <span>Discount Applied</span>
                                    <span>- {receiptData.currency} {formatPrice(receiptData.discount)}</span>
                                </div>
                                <div className="h-[1px] bg-black/5 my-2 print:bg-black/20"></div>
                                <div className="flex justify-between text-[14px] font-black text-[#362B25]">
                                    <span>Total Paid</span>
                                    <span className="text-red-600">{receiptData.currency} {formatPrice(receiptData.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-4 print:hidden">
                            <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-black/[0.03] hover:bg-black/[0.05] text-[#362B25] py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                <Download size={14} /> Download
                            </button>
                            <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-black/[0.03] hover:bg-black/[0.05] text-[#362B25] py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                <Printer size={14} /> Printer
                            </button>
                        </div>

                        <button 
                            onClick={() => {
                                setReceiptData(null);
                                onClose();
                            }}
                            className="w-full bg-[#302621] text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-black shadow-lg flex items-center justify-center gap-2"
                        >
                            Done <ArrowRight size={14} />
                        </button>

                        <p className="text-[9px] text-center text-black/40 font-bold uppercase tracking-widest mt-6">
                            A copy has been sent to {receiptData.userEmail}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[40] flex flex-col items-center p-4 pt-24 pb-10 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-300 overflow-y-auto overflow-x-hidden">
            <div className="bg-white w-full max-w-[480px] rounded-xl shadow-2xl relative animate-in zoom-in-95 duration-300 font-sans flex flex-col my-auto shrink-0">
                {/* Header */}
                <div className="pt-8 px-8 pb-6 relative">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] bg-black/20 flex-1" />
                        <h2 className="text-[14px] font-black uppercase tracking-[0.15em] text-[#362B25]">Your Payment</h2>
                        <div className="h-[1px] bg-black/20 flex-1" />
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-all">
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-10 pb-8">
                    <div className="space-y-5 mb-8">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#362B25]">
                            <span className="opacity-80">Actual Amount:</span>
                            <span className="text-[#675F5B]/50 line-through">{currency} {formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#362B25]">
                            <span className="opacity-80">Amount:</span>
                            <span className="text-red-600">{currency} {formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#675F5B]/50">
                            <span>You Save:</span>
                            <span>{currency} {formatPrice(discount)}</span>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] font-bold text-center mb-4 bg-red-50 rounded-lg px-4 py-2">
                            {error}
                        </p>
                    )}

                    <div className="text-center mb-4">
                        <button
                            disabled={isProcessing}
                            onClick={handlePayment}
                            className="w-full bg-[#302621] text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-[#251d1a] shadow-lg active:scale-95 flex items-center justify-center h-[52px] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : "Pay Now"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
