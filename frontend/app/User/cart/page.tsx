"use client";
import { useEffect, useState, useCallback } from "react";
import { getToken } from "@/app/lib/token";
import {
    ShoppingBag,
    Loader2,
    Search,
    GraduationCap,
    FileText,
    Globe
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
    description?: string;
    sessions?: string;
    bschool?: boolean;
    actualPrice?: number;
    [key: string]: unknown;
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

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });
    };

    const finalTotal = cart.reduce((total, item) => total + (item.price || 0), 0);
    const actualSubtotal = cart.reduce((total, item) => total + (item.actualPrice || (item.price / 0.8)), 0);
    const totalDiscount = actualSubtotal - finalTotal;
    const currency = cart.length > 0 ? (cart[0].currency || "INR") : "INR";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#10324a] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#d2a14a] animate-spin" />
            </div>
        );
    }

    const getServiceIcon = (serviceId: string) => {
        if (serviceId.includes('visa')) return <Globe size={28} className="text-[#d2a14a]" />;
        if (serviceId.includes('sop') || serviceId.includes('essay')) return <FileText size={28} className="text-[#d2a14a]" />;
        return <GraduationCap size={28} className="text-[#d2a14a]" />;
    };

    return (
        <main className="min-h-screen bg-[#10324a] text-white pt-12 md:pt-20 pb-24 relative overflow-hidden font-sans">
            {/* Background Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(210,161,74,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(44,165,157,0.18),transparent_35%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d2a14a]/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-8">
                    <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#d2a14a] mb-3">Your Next Step</p>
                    <h1 className="text-4xl md:text-[42px] font-bold font-serif text-white tracking-normal uppercase border-b-[3px] border-[#d2a14a]/60 inline-block pb-4 px-2">My Cart</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* LEFT AREA: ITEMS LIST */}
                    <div className="lg:col-span-8">
                        {cart.length === 0 ? (
                            <div className="bg-white/10 border border-white/10 rounded-[32px] p-12 md:p-24 flex flex-col items-center justify-center text-center shadow-[0_20px_60px_rgba(16,50,74,0.18)] backdrop-blur-xl">
                                <div className="w-48 h-48 bg-white/10 rounded-2xl flex items-center justify-center mb-10 border border-white/10 group hover:scale-105 transition-transform">
                                    <div className="relative">
                                        <ShoppingBag size={80} className="text-white/25" />
                                        <Search size={32} className="absolute bottom-4 right-4 text-[#d2a14a]" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-white/75 mb-8 lowercase first-letter:uppercase">Your cart is empty. <Link href="/services" className="text-[#d2a14a] hover:underline">View Services</Link></h2>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item.itemId} className="bg-white/10 border border-white/10 rounded-2xl p-5 md:p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] relative group transition-all hover:bg-white/[0.14] hover:border-[#d2a14a]/35 backdrop-blur-xl">
                                        <div className="flex gap-4 md:gap-6 items-start">
                                            {/* Icon */}
                                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 mt-1">
                                                {getServiceIcon(item.serviceId)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 w-full min-w-0">
                                                <div className="flex flex-col sm:flex-row justify-between gap-2 md:gap-4 lg:pr-4">
                                                    <h3 className="text-lg md:text-[20px] font-bold font-serif text-white leading-snug flex-1">{item.title}</h3>
                                                    <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
                                                        <p className="text-[14px] font-bold md:text-xs font-bold text-white/35 line-through mb-0.5">{currency} {formatPrice(item.actualPrice || (item.price / 0.8))}</p>
                                                        <p className="text-[18px] md:text-[22px] font-black text-[#d2a14a] leading-none">{currency} {formatPrice(item.price)}</p>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-[12px] md:text-[13px] text-white/70 leading-relaxed max-w-2xl mt-2 md:mt-3 font-medium">
                                                    {item.description || "Expert help to boost your profile and secure admissions to top Ivy League and global universities with personalized mentorship."}
                                                </p>

                                                {/* Options like CoAuthors if applicable */}
                                                {(item.serviceId.includes('research') || item.title.toLowerCase().includes('research')) && (
                                                    <div className="flex items-center gap-3 mt-3 md:mt-4">
                                                        <span className="text-[13px] font-bold md:text-[14px] font-bold font-black uppercase tracking-widest text-white/65">CoAuthors:</span>
                                                        <select className="bg-white/10 border border-white/10 rounded-md px-2 py-1 md:px-3 md:py-1 text-xs font-bold outline-none text-white transition-all hover:border-[#d2a14a]/50 cursor-pointer">
                                                            <option>0</option>
                                                            <option>1</option>
                                                            <option>2</option>
                                                        </select>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-end mt-4 md:mt-5 border-t border-white/10 pt-3 md:pt-4">
                                                    <div className="flex flex-wrap gap-2 md:gap-4 text-[13px] font-bold md:text-[14px] font-bold font-black text-[#d2a14a] uppercase tracking-widest">
                                                        <span>{item.duration}</span>
                                                        {item.sessions && <span>• {item.sessions} Sessions</span>}
                                                    </div>
                                                    <button 
                                                        onClick={() => removeFromCart(item.itemId)}
                                                        disabled={deletingId === item.itemId}
                                                        className="text-[14px] font-bold md:text-[11px] font-black text-white/65 hover:text-[#d2a14a] uppercase tracking-wider transition-colors shrink-0 pl-4"
                                                    >
                                                        {deletingId === item.itemId ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT AREA: SUMMARY & UPSELL */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white/10 border border-white/10 rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.14)] backdrop-blur-xl">
                            <div className="p-6">
                                <h3 className="text-xl font-bold font-serif text-white text-center mb-8">Order Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[15px] text-white/80">
                                        <span>Total Amount:</span>
                                        <span className="text-white/35 line-through">{currency} {formatPrice(actualSubtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[15px] text-white/80">
                                        <span>Total Discount:</span>
                                        <span className="text-[#d2a14a] font-bold">- {currency} {formatPrice(totalDiscount)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-6 pb-8 bg-white/10 border-t border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[17px] text-white">You pay:</span>
                                    <span className="text-[22px] text-[#d2a14a]">
                                        {currency} {formatPrice(finalTotal)}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setShowCheckoutModal(true)}
                                    className="w-full bg-[#d2a14a] hover:bg-white text-[#10324a] py-3 rounded-xl font-bold text-[14px] transition-all tracking-wide"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>

                        {/* Upsell: You may also like */}
                        <div className="bg-white/10 border border-white/10 rounded-[28px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.14)] backdrop-blur-xl">
                            <h3 className="text-lg font-black text-white mb-10 uppercase tracking-[0.1em] opacity-70">You may also like</h3>
                            <div className="space-y-12">
                                <Link href="/services/visa" className="flex gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <Globe size={28} className="text-[#d2a14a]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-2 leading-tight group-hover:text-[#d2a14a] transition-colors">Visa Application Help</h4>
                                        <p className="text-[14px] font-bold text-white/65 leading-relaxed font-semibold">
                                            Ace the visa application through our help in paperwork, financial planning, and visa interview mock rounds.
                                        </p>
                                    </div>
                                </Link>
                                <Link href="/services/eb1" className="flex gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <FileText size={28} className="text-[#d2a14a]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-2 leading-tight group-hover:text-[#d2a14a] transition-colors">Apply For An EB-1 Visa</h4>
                                        <p className="text-[14px] font-bold text-white/65 leading-relaxed font-semibold">
                                            The EB-1 visa is a talent-based immigrant visa in the US for individuals with extraordinary abilities.
                                        </p>
                                    </div>
                                </Link>
                                <Link href="/services/university" className="flex gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <GraduationCap size={28} className="text-[#d2a14a]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-2 leading-tight group-hover:text-[#d2a14a] transition-colors">University Selection</h4>
                                        <p className="text-[14px] font-bold text-white/65 leading-relaxed font-semibold">
                                            Identify the universities that match your profile and career goals with our expert vetting process.
                                        </p>
                                    </div>
                                </Link>
                                <Link href="/services/sop" className="flex gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <FileText size={28} className="text-[#d2a14a]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-2 leading-tight group-hover:text-[#d2a14a] transition-colors">Statement of Purpose</h4>
                                        <p className="text-[14px] font-bold text-white/65 leading-relaxed font-semibold">
                                            Draft a compelling, admissions-driven narrative that highlights your unique journey to the committee.
                                        </p>
                                    </div>
                                </Link>
                                <Link href="/services/research" className="flex gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <Globe size={28} className="text-[#d2a14a]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-tight mb-2 leading-tight group-hover:text-[#d2a14a] transition-colors">Research Paper Publishing</h4>
                                        <p className="text-[14px] font-bold text-white/65 leading-relaxed font-semibold">
                                            Publishing credible research papers can significantly boost your profile for MS/PhD applications.
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
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
                title="Confirm Reset"
                message="Are you sure you want to remove all items from your selections?"
                loading={isClearing}
                confirmText="Delete Anyway"
                cancelText="Nevermind"
            />
        </main>
    );
}
