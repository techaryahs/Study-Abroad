"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import pricingData from "@/data/services-pricing.json";
import { ShieldCheck, Star, ChevronDown, Check, LogIn } from "lucide-react";
import { getUser, getToken } from "@/app/lib/token";
import Link from "next/link";
import CheckoutModal from "@/app/User/cart/checkoutmodal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

type ServiceId = keyof typeof pricingData;

const POPULAR_CURRENCIES = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED", "SGD"];

export default function AddToCart({ serviceId }: { serviceId: string }) {
    const [currency, setCurrency] = useState<string>("INR");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Multi-selection state
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [activeCheckboxes, setActiveCheckboxes] = useState<Record<string, boolean>>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const selectionRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);

    const data = (pricingData as any)[serviceId];

    // Check if in cart
    const checkIfInCart = useCallback(async () => {
        if (!user) return;
        try {
            const token = getToken();
            const response = await fetch(`${BACKEND_URL}/api/user/get-cart`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIsInCart(data.cart.some((item: any) => item.serviceId === serviceId));
            }
        } catch (error) {
            console.error("Cart check error:", error);
        }
    }, [user, serviceId]);

    useEffect(() => {
        // Auth check
        setUser(getUser());

        // Default selections
        if (data?.selections) {
            const defaults: Record<string, string> = {};
            data.selections.forEach((s: any) => {
                defaults[s.id] = s.options[0];
            });
            setSelections(defaults);
        } else if (data?.experts || data?.options) {
            const options = data.experts || data.options;
            const key = data.selectionTitle || (data.experts ? "Expert" : "Selection");
            setSelections({ [key]: options[0] });
        }
    }, [serviceId, data]);

    // Click outside listener
    useEffect(() => {
        checkIfInCart();
        window.addEventListener('cart-updated', checkIfInCart);

        function handleClickOutside(event: MouseEvent) {
            if (selectionRef.current && !selectionRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
            if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
                setIsCurrencyOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('cart-updated', checkIfInCart);
        };
    }, [checkIfInCart]);

    if (!data) return <div className="p-8 rounded-2xl bg-[#40332D]/30 border border-[#D4A848]/10 text-[#675F5B]/70 text-sm text-center">Pricing not found</div>;

    const availableCurrencies = Object.keys(data.pricing).filter(c => POPULAR_CURRENCIES.includes(c));
    const basePricing = data.pricing[currency] || { actual: "0", discounted: "0", save: "0", off: "0%" };

    // Numerical values for scaling
    const parsePrice = (p: string | number) => {
        if (typeof p === "number") return p;
        return parseFloat(p.toString().replace(/,/g, ""));
    };
    const formatPrice = (n: number) => n.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: currency === "INR" ? 0 : 2
    });

    let displayActual = basePricing.actual;
    let displayDiscounted = basePricing.discounted;
    let displaySave = basePricing.save;
    let displayDuration = data.duration;

    // Scaling Logic
    if (data.type === "scaling" && basePricing.scaleFactor) {
        const key = data.selectionTitle || "Selection";
        const factor = parseFloat(selections[key]) || 0;
        const multiplier = 1 + (factor * basePricing.scaleFactor);

        displayActual = formatPrice(parsePrice(basePricing.actual) * multiplier);
        displayDiscounted = formatPrice(parsePrice(basePricing.discounted) * multiplier);
        displaySave = formatPrice(parsePrice(basePricing.actual) * multiplier - parsePrice(basePricing.discounted) * multiplier);
    }
    else if (data.type === "complex" && data.selections) {
        let totalMultiplier = 1;
        data.selections.forEach((s: any) => {
            const val = parseFloat(selections[s.id]) || 0;
            totalMultiplier *= (1 + (val - s.offset) * s.factor);
        });

        displayActual = formatPrice(parsePrice(basePricing.actual) * totalMultiplier);
        displayDiscounted = formatPrice(parsePrice(basePricing.discounted) * totalMultiplier);
        displaySave = formatPrice(parsePrice(basePricing.actual) * totalMultiplier - parsePrice(basePricing.discounted) * totalMultiplier);
    }

    // Checkbox Logic (Surcharges & Addons)
    if (data.checkboxes) {
        let checkboxMultiplier = 1;
        let totalAddons = 0;

        data.checkboxes.forEach((cb: any) => {
            if (activeCheckboxes[cb.id]) {
                if (cb.type === "surcharge") {
                    checkboxMultiplier *= (1 + cb.value);
                } else if (cb.type === "addon") {
                    const addonPrice = cb.pricing[currency] || 0;
                    totalAddons += addonPrice;
                }

                // Duration Override
                if (cb.overrideDuration) {
                    displayDuration = cb.overrideDuration;
                }
            }
        });

        const currentActual = parsePrice(displayActual);
        const currentDiscounted = parsePrice(displayDiscounted);

        displayActual = formatPrice(currentActual * checkboxMultiplier + totalAddons);
        displayDiscounted = formatPrice(currentDiscounted * checkboxMultiplier + totalAddons);
        displaySave = formatPrice((currentActual * checkboxMultiplier + totalAddons) - (currentDiscounted * checkboxMultiplier + totalAddons));
    }

    const handleAddToCart = async () => {
        if (!user || isInCart) return;
        setLoading(true);
        try {
            const token = getToken();
            const response = await fetch(`${BACKEND_URL}/api/user/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    serviceId,
                    cartData: {
                        title: data.title,
                        currency,
                        selections,
                        activeCheckboxes,
                        price: displayDiscounted,
                        actualPrice: displayActual,
                        duration: displayDuration
                    }
                })
            });
            if (response.ok) {
                window.dispatchEvent(new Event('cart-updated'));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const selectionTitle = data.selectionTitle || (data.experts ? "Session With" : "Selection");
    const selectionKey = data.selectionTitle || (data.experts ? "Expert" : "Selection");

    return (
        <div className="p-5 rounded-[2rem] bg-[#40332D] border border-[#D4A848]/20 shadow-[0_30px_100px_-15px_rgba(194,168,120,0.4)] relative overflow-hidden group">
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4A848]/10 rounded-full blur-[80px] -z-10" />

            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] leading-none text-[#D4A848]">Start Now</h3>
                <Star className="text-[#D4A848] w-4 h-4 fill-[#D4A848]/50" />
            </div>

            <div className="space-y-3">
                {/* Services Row */}
                <div className="flex justify-between gap-4 py-1 text-[#D4A848]/60">
                    <span className="text-[10px] font-black uppercase tracking-widest">Services</span>
                    <span className="text-xs font-bold text-[#FFFFFF] text-right leading-tight max-w-[150px]">{data.title}</span>
                </div>

                {/* Duration Row */}
                <div className="flex justify-between items-center py-1 text-[#D4A848]/60">
                    <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                    <span className="text-xs font-bold text-[#FFFFFF] animate-in fade-in duration-500">{displayDuration}</span>
                </div>

                {/* Dynamic Selections */}
                {data.selections ? (
                    data.selections.map((s: any) => (
                        <div key={s.id} className="flex justify-between items-center py-1 text-[#D4A848]/60">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none text-[#D4A848]/60">{s.title}</span>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === s.id ? null : s.id)}
                                    className="flex items-center gap-2 bg-white/5 border border-[#D4A848]/30 text-[#FFFFFF] text-[10px] font-black uppercase px-5 py-2 rounded-full hover:bg-white transition-all min-w-[100px] justify-between group/btn"
                                >
                                    <span>{selections[s.id]}</span>
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === s.id ? "rotate-180" : ""}`} />
                                </button>

                                {openDropdown === s.id && (
                                    <div className="absolute top-full right-0 mt-2 w-32 bg-[#362B25]/95 backdrop-blur-xl border border-[#D4A848]/30 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="py-2 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                            {s.options.map((opt: string) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => {
                                                        setSelections(prev => ({ ...prev, [s.id]: opt }));
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#362B25] hover:text-[#FDFBF7] transition-colors text-[#D4A848]/70"
                                                >
                                                    {opt}
                                                    {selections[s.id] === opt && <Check className="w-3 h-3 text-[#FFFFFF]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (data.experts || data.options) && (
                    <div className="flex justify-between items-center py-1 text-[#D4A848]/60">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{selectionTitle}</span>
                        <div className="relative" ref={selectionRef}>
                            <button
                                onClick={() => setOpenDropdown(openDropdown === selectionKey ? null : selectionKey)}
                                className="flex items-center gap-2 bg-white/5 border border-[#D4A848]/30 text-[#FDFBF7] text-[10px] font-black uppercase px-5 py-2 rounded-full hover:bg-white transition-all min-w-[100px] justify-between group/btn"
                            >
                                <span className="truncate max-w-[100px]">{selections[selectionKey]}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openDropdown === selectionKey ? "rotate-180" : ""}`} />
                            </button>

                            {/* Custom Menu */}
                            {openDropdown === selectionKey && (
                                <div className="absolute top-full right-0 mt-2 w-32 bg-[#362B25]/95 backdrop-blur-xl border border-[#D4A848]/30 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-2 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                        {(data.experts || data.options).map((opt: string) => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    setSelections({ [selectionKey]: opt });
                                                    setOpenDropdown(null);
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-[#362B25] hover:text-[#FDFBF7] transition-colors text-[#FDFBF7]/70"
                                            >
                                                {opt}
                                                {selections[selectionKey] === opt && <Check className="w-3 h-3 text-[#FFFFFF]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Checkboxes Section */}
                {data.checkboxes && (
                    <div className="pt-2 pb-1 space-y-2.5">
                        {data.checkboxes.map((cb: any) => (
                            <label key={cb.id} className="flex items-start gap-3 cursor-pointer group/cb">
                                <div className="relative flex items-center mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={!!activeCheckboxes[cb.id]}
                                        onChange={() => setActiveCheckboxes(prev => ({ ...prev, [cb.id]: !prev[cb.id] }))}
                                        className="peer sr-only"
                                    />
                                    <div className="w-4 h-4 border border-[#D4A848] rounded-[4px] bg-white/50 peer-checked:bg-[#D4A848] peer-checked:border-gold-500 transition-all duration-300" />
                                    <Check className="w-2.5 h-2.5 text-white absolute left-0.5 opacity-0 peer-checked:opacity-100 transition-all duration-300" strokeWidth={4} />
                                </div>
                                <span className="text-[9px] font-bold text-[#D4A848] uppercase tracking-widest group-hover/cb:text-[#FFFFFF] transition-colors leading-relaxed">
                                    {cb.label}
                                    {cb.type === "addon" && (
                                        <span className="text-[#FFFFFF]/60 ml-1.5 font-black shrink-0">
                                            (+{currency} {cb.pricing[currency]?.toLocaleString()})
                                        </span>
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Highlight Badge */}
                {data.highlight && (
                    <div className="bg-gradient-to-r from-gold-400/10 to-[#D4A848]/10 border border-[#D4A848]/30 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-black text-[#FDFBF7] uppercase tracking-widest leading-none">✦ {data.highlight}</p>
                    </div>
                )}

                {/* Currency Selection (Custom Dropdown) */}
                <div className="flex justify-between items-center py-1 text-[#D4A848]/60">
                    <span className="text-[10px] font-black uppercase tracking-widest">Currency</span>
                    <div className="relative" ref={currencyRef}>
                        <button
                            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                            className="flex items-center gap-2 bg-white/5 border border-[#D4A848]/30 text-[#FDFBF7] text-[10px] font-black uppercase px-5 py-2 rounded-full hover:bg-white transition-all min-w-[100px] justify-between"
                        >
                            <span>{currency}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isCurrencyOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Custom Menu */}
                        {isCurrencyOpen && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-[#362B25]/95 backdrop-blur-xl border border-[#D4A848]/30 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="py-2 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                    {availableCurrencies.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setCurrency(c);
                                                setIsCurrencyOpen(false);
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#362B25] hover:text-[#FDFBF7] transition-colors text-[#FDFBF7]/70"
                                        >
                                            {c}
                                            {currency === c && <Check className="w-3 h-3 text-[#FFFFFF]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-[#D4A848]/30">
                    <div className="flex justify-between items-center py-1 text-[#FDFBF7]/40">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Actual Amount</span>
                        <span className="text-[11px] line-through decoration-[#D4A848]/20 leading-none">{currency} {displayActual}</span>
                    </div>

                    <div className="flex justify-between items-baseline mb-3 leading-none mt-1">
                        <span className="text-[9px] text-[#FFFFFF]/40 font-black uppercase tracking-[0.2em] leading-none">Amount</span>
                        <div className="flex items-baseline gap-2 leading-none">
                            <span className="text-2xl font-black text-[#D4A848] leading-none tracking-tighter">
                                {currency} {displayDiscounted}
                            </span>
                            {data.suffix && <span className="text-[9px] text-[#FFFFFF]/30 font-bold tracking-tight uppercase">{data.suffix}</span>}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-5 text-[#FDFBF7]/60 leading-none mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">You save</span>
                        <div className="flex items-center gap-2 leading-none text-right">
                            <span className="text-[10px] font-black text-[#FDFBF7] leading-none">{currency} {displaySave}</span>
                            <span className="bg-[#D4A848]/10 text-[#FDFBF7] px-2 py-0.5 border border-[#FFFFFF]/20 rounded-[2px] text-[9px] font-black uppercase leading-none">
                                {basePricing.off}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {user ? (
                            isInCart ? (
                                <button
                                    disabled
                                    className="w-full bg-[#362B25] border border-[#D4A848]/30 text-[#FFFFFF]/40 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4A848]/10" />
                                    Already in Cart
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="bg-[#D4A848] text-[#40332D] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all hover:-translate-y-1 active:scale-95 text-center leading-none"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={loading}
                                        className="border border-[#D4A848] text-[#FDFBF7] hover:bg-[#D4A848]/5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 text-center leading-none disabled:opacity-50"
                                    >
                                        {loading ? "Adding..." : "Add to Cart"}
                                    </button>
                                </>
                            )
                        ) : (
                            <Link
                                href="/auth/login"
                                className="bg-[#D4A848] text-[#40332D] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(194,168,120,0.4)] transition-all hover:-translate-y-1 active:scale-95 text-center flex items-center justify-center gap-2"
                            >
                                <LogIn size={14} />
                                Log In To Pay
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-2 border-t border-[#D4A848]/30 text-center">
                <p className="text-[8px] text-[#FFFFFF]/20 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 leading-none">
                    <ShieldCheck size={10} className="text-[#FFFFFF]/40" /> Secure Checkout
                </p>
            </div>
            
            <CheckoutModal 
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                items={[{ name: data.title, price: parsePrice(displayActual) }]}
                subtotal={parsePrice(displayActual)}
                discount={parsePrice(displaySave)}
                total={parsePrice(displayDiscounted)}
                currency={currency}
            />
        </div>
    );
}
