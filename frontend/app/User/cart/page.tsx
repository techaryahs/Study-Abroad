"use client";
import { useEffect, useState, useCallback } from "react";
import { getToken } from "@/app/lib/token";
import {
    Trash2,
    ShoppingBag,
    Loader2,
    CheckCircle2,
    Star,
    Lock,
    CreditCard
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";
import CheckoutModal from "./checkoutmodal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface CartItem {
    itemId: string;
    serviceId: string;
    title: string;
    price: number;
    currency: string;
    duration: string;
    addedAt: string;
    sessions?: string;
    bschool?: boolean;
    [key: string]: any;
}

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isClearing, setIsClearing] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const router = useRouter();

    const fetchCart = useCallback(async () => {
        try {
            const token = getToken();
            if (!token) {
                router.push("/auth/login");
                setLoading(false);
                return;
            }

            const response = await fetch(`${BACKEND_URL}/api/user/get-cart`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data.cart || []);
            }
        } catch (error) {
            console.error("Fetch cart error:", error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchCart();
        const handleUpdate = () => fetchCart();
        window.addEventListener('cart-updated', handleUpdate);
        return () => window.removeEventListener('cart-updated', handleUpdate);
    }, [fetchCart]);

    const removeFromCart = async (itemId: string) => {
        setDeletingId(itemId);
        try {
            const token = getToken();
            const response = await fetch(`${BACKEND_URL}/api/user/remove-from-cart`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ itemId })
            });

            if (response.ok) {
                fetchCart();
                window.dispatchEvent(new Event('cart-updated'));
            }
        } catch (error) {
            console.error("Remove error:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleConfirmClear = async () => {
        setIsClearing(true);
        try {
            const token = getToken();
            const response = await fetch(`${BACKEND_URL}/api/user/clear-cart`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setCart([]);
                window.dispatchEvent(new Event('cart-updated'));
                setShowClearConfirm(false);
            }
        } catch (error) {
            console.error("Clear error:", error);
        } finally {
            setIsClearing(false);
        }
    };

    const finalTotal = cart.reduce((acc, item) => acc + (item.price || 0), 0);
    const actualSubtotal = cart.reduce((acc, item) => acc + (item.actualPrice || (item.price / 0.8)), 0);
    const totalDiscount = actualSubtotal - finalTotal;
    const currency = cart[0]?.currency || "INR";

    const formatPrice = (price: number | undefined | null) => {
        if (price === undefined || price === null) return "0.00";
        return price.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
            <div className="relative">
                <div className="w-12 h-12 border-2 border-[#D4A848]/20 border-t-[#D4A848] rounded-full animate-spin" />
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#F8F6F1] text-[#362B25] pt-28 pb-20 selection:bg-[#D4A848]/30 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4A848]/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-[#362B25] uppercase tracking-tighter mb-4">
                        My <span className="text-[#D4A848] italic font-serif">Cart</span>
                    </h1>
                    <div className="w-20 h-1.5 bg-[#D4A848] mx-auto rounded-full" />
                </div>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#D4A848]/20 rounded-3xl shadow-sm">
                        <ShoppingBag size={48} className="text-[#D4A848]/40 mb-6" />
                        <h2 className="text-xl font-black uppercase text-[#362B25] mb-6">Your cart is empty</h2>
                        <Link
                            href="/services"
                            className="bg-[#362B25] text-[#FFFFFF] px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2A221D] transition-all shadow-lg"
                        >
                            Browse Services
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* Cart Items */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <span className="text-xs font-black text-[#675F5B] uppercase tracking-widest">
                                    {cart.length} Service{cart.length > 1 ? 's' : ''} Selected
                                </span>
                                <button
                                    onClick={() => setShowClearConfirm(true)}
                                    className="text-[10px] font-black text-[#675F5B] hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={12} /> Clear Cart
                                </button>
                            </div>

                            {cart.map((item) => (
                                <div
                                    key={item.itemId}
                                    className="bg-[#FFFFFF] border border-[#D4A848]/20 rounded-2xl p-4 md:p-5 shadow-sm hover:border-[#D4A848]/50 transition-all group relative"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-16 h-16 bg-[#F8F6F1] border border-[#D4A848]/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                            {item.serviceId.includes('visa') ? '🛂' : item.serviceId.includes('research') ? '📄' : '🎓'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="text-lg font-black text-[#362B25] mb-2 uppercase tracking-tight leading-tight">{item.title}</h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        <span className="bg-[#F8F6F1] text-[#D4A848] text-[10px] font-black px-3 py-1 rounded-lg border border-[#D4A848]/20 uppercase">
                                                            {item.duration}
                                                        </span>
                                                        {item.sessions && (
                                                            <span className="bg-[#362B25]/5 text-[#362B25] text-[10px] font-black px-3 py-1 rounded-lg border border-[#362B25]/10 uppercase">
                                                                {item.sessions} Sessions
                                                            </span>
                                                        )}
                                                        {item.selections && Object.entries(item.selections).map(([key, val]) => (
                                                            <span key={key} className="bg-[#362B25]/5 text-[#675F5B] text-[10px] font-bold px-3 py-1 rounded-lg border border-[#362B25]/10 uppercase flex items-center gap-1.5 hover:bg-[#D4A848]/5 transition-colors">
                                                                <span className="opacity-50 font-black">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                                <span className="text-[#362B25] font-black">{String(val)}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0 flex flex-col items-end pt-1">
                                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                                        <p className="text-base font-black text-[#362B25]">{currency} {formatPrice(item.price)}</p>
                                                        <p className="text-[#675F5B] text-[9px] line-through">{currency} {formatPrice(item.actualPrice || (item.price / 0.8))}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.itemId)}
                                                        className="mt-1 text-[#675F5B]/30 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 sticky top-32">
                            <div className="bg-[#FFFFFF] border border-[#D4A848]/20 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A848]/5 rounded-full blur-3xl" />
                                <h3 className="text-xl font-black text-[#362B25] mb-8 pb-4 border-b border-[#D4A848]/10 text-center">Order Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-[#675F5B]">Actual Amount:</span>
                                        <span className="text-[#362B25]">{currency} {formatPrice(actualSubtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-[#675F5B]">Total Discount:</span>
                                        <span className="text-red-600">- {currency} {formatPrice(totalDiscount)}</span>
                                    </div>
                                </div>

                                <div className="bg-[#F8F6F1] rounded-2xl p-6 mb-8 text-center border border-[#D4A848]/10">
                                    <p className="text-xs font-bold text-[#675F5B] uppercase tracking-widest mb-2">You pay:</p>
                                    <p className="text-3xl font-black text-[#362B25] tracking-tighter">
                                        {currency} {formatPrice(finalTotal)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowCheckoutModal(true)}
                                    className="w-full bg-[#D4A848] text-[#FFFFFF] py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md hover:bg-[#c2983d] hover:-translate-y-0.5"
                                >
                                    Checkout
                                </button>

                                <div className="mt-8 flex flex-col items-center gap-4 text-center">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-[#675F5B]/50 uppercase tracking-widest">
                                        <Lock size={12} className="text-[#D4A848]/40" /> Secure Encryption
                                    </div>
                                </div>
                            </div>

                            {/* Promotional Suggestion */}
                            <div className="mt-6 bg-[#FFFFFF] border border-[#D4A848]/20 rounded-2xl p-6 shadow-sm">
                                <p className="text-[10px] font-black text-[#D4A848] uppercase tracking-widest mb-2">You may also like</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#F8F6F1] rounded-lg border border-[#D4A848]/20 flex items-center justify-center text-lg">💡</div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#362B25] leading-tight">Complete Application Help</p>
                                        <p className="text-[9px] text-[#675F5B]">Add to your roadmap for 10% off</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                subtotal={actualSubtotal}
                discount={totalDiscount}
                total={finalTotal}
                currency={currency}
            />

            <ConfirmationModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={handleConfirmClear}
                title="Clear Selections"
                message="Remove all items from your selection?"
                confirmText={isClearing ? "Clearing..." : "Yes, Clear All"}
                loading={isClearing}
            />
        </main>
    );
}
