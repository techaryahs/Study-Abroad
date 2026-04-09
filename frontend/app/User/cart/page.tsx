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
        <main className="min-h-screen bg-[#F8F6F1] text-[#362B25] pt-12 md:pt-16 pb-20 selection:bg-[#D4A848]/30 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4A848]/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-screen-2xl xl:max-w-[1700px] mx-auto px-6 relative z-10">
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
                    <>
                        <div className="mb-8 md:mb-12">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-8 md:w-12 h-[1px] bg-[#D4A848]" />
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#D4A848]">Marketplace</span>
                            </div>
                            <h1 className="text-3xl md:text-7xl font-black text-[#362B25] tracking-tighter uppercase leading-[0.9] break-words">Your <span className="text-[#D4A848]">Cart</span></h1>
                        </div>

                        <div className="grid md:grid-cols-12 gap-8 md:gap-10">
                            {/* Cart Items List */}
                            <div className="md:col-span-7 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                                <div className="flex justify-between items-center mb-2 px-2">
                                    <h2 className="text-[10px] font-black text-[#362B25] uppercase tracking-widest">{cart.length} Items Selected</h2>
                                    <button
                                        onClick={() => setShowClearConfirm(true)}
                                        className="text-[10px] font-black text-[#675F5B] hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={12} /> <span className="hidden sm:inline">Clear Cart</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                                    {cart.map((item) => (
                                        <div
                                            key={item.itemId}
                                            className="bg-[#FFFFFF] border border-[#D4A848]/20 rounded-xl md:rounded-2xl p-2 sm:p-4 shadow-sm hover:border-[#D4A848]/50 transition-all group relative flex flex-row gap-2 sm:gap-4 items-start"
                                        >
                                            <div className="w-6 h-6 sm:w-12 sm:h-12 bg-[#F8F6F1] border border-[#D4A848]/20 rounded-lg flex items-center justify-center text-xs sm:text-2xl shrink-0 group-hover:scale-105 transition-transform mt-0.5 sm:mt-0">
                                                {item.serviceId.includes('visa') ? '🛂' : item.serviceId.includes('research') ? '📄' : '🎓'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex justify-between items-start gap-1">
                                                        <h3 className="text-[9px] sm:text-lg font-black text-[#362B25] tracking-tight leading-tight break-words lowercase first-letter:uppercase flex-1">{item.title}</h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.itemId)}
                                                            className="text-red-500/20 hover:text-red-500 p-0.5 transition-colors shrink-0"
                                                        >
                                                            <Trash2 size={10} className="sm:w-3.5 sm:h-3.5" />
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-col">
                                                            <p className="text-[9px] sm:text-base font-black text-[#362B25] whitespace-nowrap">{currency} {formatPrice(item.price)}</p>
                                                            <p className="text-[#675F5B] text-[7px] sm:text-[9px] line-through opacity-50 whitespace-nowrap">{currency} {formatPrice(item.actualPrice || (item.price / 0.8))}</p>
                                                        </div>

                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            <span className="bg-[#F8F6F1] text-[#D4A848] text-[6px] sm:text-[8px] font-black px-1.5 py-0.5 rounded border border-[#D4A848]/20 uppercase tracking-tighter">
                                                                {item.duration}
                                                            </span>
                                                            {item.sessions && (
                                                                <span className="bg-[#362B25]/5 text-[#362B25] text-[6px] sm:text-[8px] font-black px-1.5 py-0.5 rounded border border-[#362B25]/10 uppercase tracking-tighter">
                                                                    {item.sessions} Sessions
                                                                </span>
                                                            )}
                                                            {item.selections && Object.entries(item.selections).map(([key, val]) => (
                                                                <span key={key} className="bg-[#362B25]/5 text-[#362B25] text-[6px] sm:text-[8px] font-black px-1.5 py-0.5 rounded border border-[#362B25]/10 uppercase tracking-tighter">
                                                                    <span className="opacity-50">{key.replace(/([A-Z])/g, ' $1')}:</span> {String(val)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-5 lg:col-span-4 xl:col-span-3 sticky top-32">
                                <div className="bg-[#FFFFFF] border border-[#D4A848]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A848]/5 rounded-full blur-3xl" />
                                    <h3 className="text-base sm:text-xl font-black text-[#362B25] mb-4 sm:mb-8 pb-3 border-b border-[#D4A848]/10 text-center uppercase tracking-widest">Order Summary</h3>

                                    <div className="space-y-1.5 sm:space-y-4 mb-4 sm:mb-8">
                                        <div className="flex justify-between items-center text-[10px] sm:text-sm font-bold uppercase tracking-wider">
                                            <span className="text-[#675F5B]">Actual Amount:</span>
                                            <span className="text-[#362B25] whitespace-nowrap">{currency} {formatPrice(actualSubtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] sm:text-sm font-bold uppercase tracking-wider">
                                            <span className="text-[#675F5B]">Total Discount:</span>
                                            <span className="text-red-600 whitespace-nowrap">- {currency} {formatPrice(totalDiscount)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#F8F6F1] rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-4 sm:mb-8 text-center border border-[#D4A848]/10">
                                        <p className="text-[9px] sm:text-xs font-bold text-[#675F5B] uppercase tracking-widest mb-1">You pay:</p>
                                        <p className="text-xl sm:text-3xl font-black text-[#362B25] tracking-tighter whitespace-nowrap">
                                            {currency} {formatPrice(finalTotal)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setShowCheckoutModal(true)}
                                        className="w-full bg-[#D4A848] text-[#FFFFFF] py-3 sm:py-4 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all shadow-md hover:bg-[#c2983d] hover:shadow-lg"
                                    >
                                        Checkout Now
                                    </button>

                                    <div className="mt-4 sm:mt-8 flex flex-col items-center gap-4 text-center">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-[#675F5B]/50 uppercase tracking-widest">
                                            <Lock size={10} className="text-[#D4A848]/40" /> Secure Encryption
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
                    </>
                )}
            </div>

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                items={cart}
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
