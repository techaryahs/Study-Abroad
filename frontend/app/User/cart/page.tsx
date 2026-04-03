"use client";
import { useEffect, useState, useCallback } from "react";
import { getToken } from "@/app/lib/token";
import {
    Trash2,
    ShoppingBag,
    CreditCard,
    Loader2,
    ShieldCheck,
    Zap,
    AlertCircle,
    Star,
    Lock,
    CheckCircle2,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

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

    const subtotal = cart.reduce((acc, item) => acc + (item.price || 0), 0);
    const currency = cart[0]?.currency || "INR";

    const formatPrice = (price: number) => {
        return price.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
            maximumFractionDigits: 0
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
            <div className="relative">
                <div className="w-12 h-12 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap size={16} className="text-gold-500 animate-pulse" />
                </div>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#05070a] text-white pt-20 pb-16 relative overflow-hidden">
            {/* ── AMBIENT BACKGROUND GLOWS ── */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[10s]" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c6a96b]/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[8s]" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-10 h-[1px] bg-gold-500/50" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gold-500/80">Premium Enrollment</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">
                            Your <span className="gradient-text-gold">Elite</span> <br /> Selection
                        </h1>
                    </div>
                    {cart.length > 0 && (
                        <button 
                            onClick={() => setShowClearConfirm(true)}
                            className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-red-500 transition-all flex items-center gap-1.5 group"
                        >
                            <Trash2 size={10} className="group-hover:rotate-12 transition-transform" /> 
                            Clear All Selections
                        </button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-3xl animate-in zoom-in-95 duration-700">
                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 border border-gold-500/20 group animate-float">
                            <ShoppingBag size={32} className="text-gold-500/50 group-hover:text-gold-500 transition-colors" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight mb-2">The Cart is Empty</h2>
                        <Link 
                            href="/services" 
                            className="btn-gold px-10 py-4 text-[10px]"
                        >
                            Executive Services
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* List */}
                        <div className="lg:col-span-8 space-y-4 max-w-2xl">
                            {cart.map((item, idx) => (
                                <div
                                    key={item.itemId}
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                    className="group relative p-4 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.06] hover:border-gold-500/40 transition-all duration-500 backdrop-blur-xl animate-in fade-in slide-in-from-left-4"
                                >
                                    {/* Gold Accent Strip */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 group-hover:h-1/2 bg-gold-500 transition-all duration-700 rounded-r-full" />

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="text-xl font-black tracking-tight mb-1 group-hover:text-gold-100 transition-colors leading-tight">{item.title}</h3>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-gold-400" /> {item.duration}
                                                        </span>
                                                        {item.sessions && (
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500 bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/20">
                                                                {item.sessions} Sessions
                                                            </span>
                                                        )}
                                                        {item.bschool && (
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-400/10 px-2.5 py-0.5 rounded-full border border-blue-400/20">
                                                                B-School Included
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-xl font-black tracking-tighter text-white/90">{item.currency} {formatPrice(item.price)}</div>
                                                    <button
                                                        onClick={() => removeFromCart(item.itemId)}
                                                        disabled={deletingId === item.itemId}
                                                        className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-red-500 transition-all flex items-center gap-1.5 ml-auto"
                                                    >
                                                        {deletingId === item.itemId ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ── DYNAMIC DETAILS ── */}
                                            {(item.selections || item.activeCheckboxes || Object.entries(item).some(([k, v]) => !['itemId', 'serviceId', 'title', 'price', 'currency', 'duration', 'addedAt', 'sessions', 'bschool', '_id', 'selections', 'activeCheckboxes', '__v'].includes(k) && typeof v !== 'object')) && (
                                                <div className="mt-3 pt-3 border-t border-white/[0.04] flex flex-wrap items-end gap-x-10 gap-y-3">
                                                    {item.selections && typeof item.selections === 'object' && Object.keys(item.selections).length > 0 && (
                                                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                                                            {Object.entries(item.selections).map(([key, val]) => (
                                                                <div key={key}>
                                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-0.5">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                                    <p className="text-xs font-bold text-gold-500/70 uppercase italic tracking-tight leading-tight">{String(val)}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {item.activeCheckboxes && typeof item.activeCheckboxes === 'object' && Object.values(item.activeCheckboxes).some(v => v === true) && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {Object.entries(item.activeCheckboxes).map(([key, val]) => {
                                                                if (val !== true) return null;
                                                                return (
                                                                    <div 
                                                                        key={key}
                                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-400/5 border border-gold-400/10 text-[10px] font-black uppercase tracking-widest text-gold-400/60"
                                                                    >
                                                                        <CheckCircle2 size={12} className="text-gold-500/50" />
                                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-4 sticky top-28">
                            <div className="p-7 rounded-[2rem] bg-gradient-to-br from-[#111] via-[#05070a] to-[#c6a96b]/5 border border-gold-500/15 shadow-2xl relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-[60px] pointer-events-none" />
                                
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/80 italic">Order Summary</h3>
                                    <Star className="text-gold-500 w-3.5 h-3.5 fill-gold-500" />
                                </div>

                                <div className="space-y-4 mb-8 text-xs font-bold uppercase tracking-widest">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/20 text-[10px]">Subtotal</span>
                                        <span className="text-white/70">{currency} {formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/20 text-[10px]">Processing</span>
                                        <span className="text-gold-500/60 text-[9px]">Complimentary</span>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-white/5">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[9px] text-white/30">Total</span>
                                            <div className="text-3xl font-black text-gold-500 tracking-tighter italic">
                                                {currency} {formatPrice(subtotal)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-gold w-full py-5 text-[11px] group/pay shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={16} /> Complete Enrollment
                                    </div>
                                </button>
                                
                                <div className="mt-6 flex flex-col items-center gap-3 text-center border-t border-white/5 pt-6">
                                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-white/10">
                                        <Lock size={10} className="text-gold-500/40" /> Secure Checkout
                                    </div>
                                    <p className="text-[8px] text-white/10 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                                        By proceeding, you agree to our elite mentorship terms.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
