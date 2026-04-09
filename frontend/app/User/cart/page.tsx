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
            console.error("Clear cart error:", error);
        } finally {
            setIsClearing(false);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price, 0);
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#C5A059] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#3C2A21] pt-12 pb-24 selection:bg-[#C5A059]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#C5A059]/10 rounded-3xl flex items-center justify-center text-[#C5A059] shadow-inner">
                            <ShoppingBag size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Your Cart</h1>
                            <p className="text-[10px] font-black uppercase text-[#6B5E51]/60 tracking-[0.4em] mt-1">Inventory Management Protocol</p>
                        </div>
                    </div>

                    {cart.length > 0 && (
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="px-8 py-3 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center gap-3 border border-red-500/10"
                        >
                            <Trash2 size={16} /> Clear Inventory
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        {cart.length === 0 ? (
                            <div className="bg-white border border-[#F1EDEA] rounded-[3rem] p-20 text-center shadow-sm">
                                <ShoppingBag className="w-20 h-20 text-[#C5A059]/20 mx-auto mb-8" />
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Inventory Empty</h3>
                                <p className="text-[#6B5E51]/60 text-sm font-bold uppercase tracking-widest mb-10 italic">No services selected for processing.</p>
                                <Link
                                    href="/services/linkedin"
                                    className="inline-flex items-center px-10 py-5 bg-[#3C2A21] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#C5A059] transition-all shadow-xl active:scale-95"
                                >
                                    Explore Services
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.itemId}
                                        className="bg-white border border-[#F1EDEA] rounded-[2.5rem] p-8 hover:border-[#C5A059]/20 transition-all group relative shadow-sm"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between gap-8">
                                            <div className="flex gap-8">
                                                <div className="w-28 h-28 bg-[#FDFBF7] rounded-[2rem] flex items-center justify-center text-[#C5A059] shadow-inner group-hover:scale-105 transition-all duration-500 border border-[#F1EDEA]">
                                                    <Star size={40} />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <h3 className="text-xl font-black uppercase tracking-tight text-[#3C2A21] mb-2">{item.title}</h3>
                                                    <div className="flex flex-wrap gap-4">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#6B5E51]/40 px-3 py-1 bg-[#FDFBF7] rounded-full border border-[#F1EDEA]">{item.duration}</span>
                                                        {item.sessions && (
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]/60 px-3 py-1 bg-[#C5A059]/5 rounded-full border border-[#C5A059]/10">
                                                                {item.sessions} Node Cycles
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end gap-6 h-full self-center">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-[#6B5E51]/40 uppercase tracking-widest mb-1">Valuation</p>
                                                    <p className="text-3xl font-black text-[#3C2A21] tracking-tighter tabular-nums drop-shadow-sm">
                                                        {item.currency} {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.itemId)}
                                                    disabled={deletingId === item.itemId}
                                                    className="p-3 text-[#6B5E51]/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-[#F1EDEA] hover:border-red-500/10"
                                                >
                                                    {deletingId === item.itemId ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 size={20} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="lg:col-span-4">
                            <div className="bg-white border border-[#F1EDEA] rounded-[3rem] p-10 sticky top-32 shadow-sm">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] italic mb-10 border-b border-[#FDFBF7] pb-4">Consolidated Billing</h2>
                                
                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[11px] font-black text-[#6B5E51]/60 uppercase tracking-widest">Base Computation</span>
                                        <span className="text-lg font-black text-[#3C2A21] tabular-nums">USD {formatPrice(calculateTotal())}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[11px] font-black text-[#C5A059] uppercase tracking-widest">Platform Efficiency</span>
                                        <span className="text-lg font-black text-[#C5A059] tabular-nums">- USD 0.00</span>
                                    </div>
                                    <div className="h-px w-full bg-[#FDFBF7] border-t border-[#F1EDEA]" />
                                    <div className="flex justify-between items-end px-2 pt-4">
                                        <div>
                                            <p className="text-[10px] font-black text-[#6B5E51]/40 uppercase tracking-widest mb-1">Settlement Yield</p>
                                            <div className="flex items-center gap-2 text-green-600">
                                                <Lock size={12} />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Encrypted</span>
                                            </div>
                                        </div>
                                        <p className="text-4xl font-black text-[#3C2A21] tracking-tighter italic tabular-nums">
                                            USD {formatPrice(calculateTotal())}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowCheckoutModal(true)}
                                    className="w-full bg-[#3C2A21] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-[#C5A059] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 group"
                                >
                                    Proceed to Sync <CreditCard size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-4 text-[#6B5E51]/40">
                                    <CheckCircle2 size={16} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Global Security Protocol Active</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={handleConfirmClear}
                title="Clear Inventory"
                message="Are you sure you want to decouple all service nodes from your current session?"
                loading={isClearing}
            />

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                subtotal={calculateTotal()}
                discount={0}
                total={calculateTotal()}
                currency="USD"
            />
        </div>
    );
}
