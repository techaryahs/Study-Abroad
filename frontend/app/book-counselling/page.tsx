"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Country } from "country-state-city";
import { clearAuth, getToken, getUser, setToken, setUser } from "@/app/lib/token";
import CheckoutModal from "@/app/User/cart/checkoutmodal";
import { UserX, Clock, Gift, UserPlus, Phone } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Slot {
  time: string;
  endTime: string;
  available: boolean;
  booked: boolean;
  past: boolean;
}

interface BookingResult {
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  consultantName: string;
  userEmail: string;
  userPhone?: string;
  isFreeBooking?: boolean;
  isPaid?: boolean;
  amountPaid?: number;
  consultantVideoEnabled?: boolean;
}

interface FreeEligibility {
  eligible: boolean;
  isNewUser: boolean;
  hasUsedFreeBooking?: boolean;
  message: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
const DEFAULT_COUNTRY_ISO = "IN";

function normalizeDialCode(phonecode: string): string {
  const digits = phonecode.replace(/\D/g, "");
  return digits ? `+${digits}` : "+91";
}

const COUNTRY_CODE_OPTIONS = Country.getAllCountries()
  .map(country => ({
    isoCode: country.isoCode,
    name: country.name,
    flag: country.flag,
    dialCode: normalizeDialCode(country.phonecode)
  }))
  .filter(country => country.dialCode.length > 1)
  .sort((a, b) => {
    if (a.isoCode === DEFAULT_COUNTRY_ISO) return -1;
    if (b.isoCode === DEFAULT_COUNTRY_ISO) return 1;
    return a.name.localeCompare(b.name);
  });

function getDialCode(isoCode: string): string {
  return COUNTRY_CODE_OPTIONS.find(country => country.isoCode === isoCode)?.dialCode || "+91";
}

function buildPhoneNumber(isoCode: string, nationalNumber: string): string {
  const digits = nationalNumber.replace(/\D/g, "");
  return digits ? `${getDialCode(isoCode)}${digits}` : "";
}

// ─── Helper: Format YYYY-MM-DD → "Mon, 14 Apr 2025" ─────────────────────────
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// ─── Helper: Build a 42-cell calendar grid ───────────────────────────────────
function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ─── Helper: Parse Time and Check Blocked ──────────────────────────────────────
function parseTime(timeStr: string) {
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM|am|pm)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function isSlotBlocked(slot: Slot, isToday: boolean) {
  // If backend says slot is unavailable, block it.
  if (!slot.available) return true;

  // Only check time when selected date is today.
  if (isToday && slot.time) {
    const parsed = parseTime(slot.time);
    if (!parsed) return false;

    // Force current time to Indian Standard Time (UTC+5:30)
    const nowUtc = new Date();
    const now = new Date(
      nowUtc.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    // Build slot datetime using IST date
    const slotDt = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parsed.hours,
      parsed.minutes
    );

    // Block if slot time is less than or equal to current IST time
    return slotDt <= now;
  }

  // Future dates remain available
  return false;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepDot({ step, current, label }: { step: number; current: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[14px] font-bold md:text-xs font-bold border-2 transition-all duration-300 ${done
          ? "bg-[#d2a14a] border-[#d2a14a] text-[#10324a]"
          : active
            ? "bg-transparent border-[#d2a14a] text-[#d2a14a]"
            : "bg-transparent border-white/20 text-white/30"
          }`}
      >
        {done ? "✓" : step}
      </div>
      <span className={`text-[12px] font-black md:text-[13px] font-bold font-semibold uppercase tracking-wider ${active ? "text-[#d2a14a]" : done ? "text-white/60" : "text-white/25"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookCounsellingPage() {
  const isOpen = true;
  const onClose = () => router.push('/');
  const router = useRouter();

  const [step, setStep] = useState(1);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [selectedCountryIso, setSelectedCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [freeEligibility, setFreeEligibility] = useState<FreeEligibility | null>(null);
  const [showAuthStep, setShowAuthStep] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [shouldPromptProfileCompletion, setShouldPromptProfileCompletion] = useState(false);
  const [lastBookingWasFree, setLastBookingWasFree] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [authConflict, setAuthConflict] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const resetOtpState = useCallback(() => {
    setOtpSent(false);
    setOtp("");
    setOtpVerified(false);
    setOtpError("");
    setAuthConflict(false);
    setOtpTimer(0);
  }, []);

  const resetGuestDetails = useCallback(() => {
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setSelectedCountryIso(DEFAULT_COUNTRY_ISO);
    setPhoneNumber("");
    setIsLoggedIn(false);
    setShowAuthStep(true);
    setFreeEligibility(null);
    setShouldPromptProfileCompletion(false);
    resetOtpState();
  }, [resetOtpState]);

  const useDifferentDetails = useCallback(() => {
    clearAuth();
    setSelectedDate("");
    setSelectedSlot(null);
    setError("");
    resetGuestDetails();
    setStep(1);
  }, [resetGuestDetails]);

  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    setError("");
    try {
      const params = new URLSearchParams({ date });
      const res = await fetch(`${API_BASE}/api/bookings/available-slots?${params}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setError("Could not load time slots. Please try again.");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const checkFreeEligibility = useCallback(async (email: string): Promise<FreeEligibility | null> => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) return null;

    setIsCheckingEligibility(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/free-eligibility?email=${encodeURIComponent(emailTrimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setFreeEligibility(null);
        return null;
      }
      setFreeEligibility(data);
      return data;
    } catch {
      setFreeEligibility(null);
      return null;
    } finally {
      setIsCheckingEligibility(false);
    }
  }, []);

  const createBasicAccount = async (phoneOverride?: string) => {
    const phoneForAccount = phoneOverride || userPhone;

    if (!userEmail || !phoneForAccount) {
      const message = "Please enter your email and phone number";
      setError(message);
      setOtpError(message);
      return false;
    }

    setAuthLoading(true);
    setError("");
    setOtpError("");
    setAuthConflict(false);

    try {
      const res = await fetch(`${API_BASE}/api/auth/create-basic-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName || "Guest User",
          email: userEmail,
          phone: phoneForAccount
        })
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || "Failed to create account";
        setError(message);
        setOtpError(message);
        setAuthConflict(data.code === "LOGIN_REQUIRED");
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      setUserPhone(phoneForAccount);
      setIsLoggedIn(true);
      setOtpVerified(true);
      setShouldPromptProfileCompletion(Boolean(data.user?.isBasicAccount || data.isNewUser));

      await checkFreeEligibility(userEmail);
      setShowAuthStep(false);
      setStep(1);
      return true;
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      setOtpError(message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const sendOtp = async () => {
    const fullPhone = buildPhoneNumber(selectedCountryIso, phoneNumber);

    if (!phoneNumber) {
      setOtpError("Please enter your phone number");
      return;
    }

    if (phoneNumber.replace(/\D/g, "").length < 6 || !fullPhone) {
      setOtpError("Please enter a valid phone number");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setError("");
    setAuthConflict(false);
    setOtp("");
    setOtpVerified(false);
    setUserPhone(fullPhone);

    try {
      const res = await fetch(`${API_BASE}/api/bookings/send-booking-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, mobile: fullPhone })
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Failed to send OTP");
        setAuthConflict(data.code === "LOGIN_REQUIRED");
        return;
      }

      setOtpSent(true);
      setOtpTimer(data.expiresIn || 600);
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }

    const mobileForOtp = userPhone || buildPhoneNumber(selectedCountryIso, phoneNumber);

    setOtpLoading(true);
    setOtpError("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/bookings/verify-booking-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileForOtp, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Invalid OTP");
        return;
      }

      setOtpVerified(true);
      setUserPhone(mobileForOtp);
      const accountReady = await createBasicAccount(mobileForOtp);
      if (!accountReady) {
        setOtpVerified(false);
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const token = getToken();
    const user = token ? getUser() : null;
    if (user) {
      setUserName(user.name || "");
      setUserEmail(user.email || "");
      setUserPhone(user.mobile || "");
      setSelectedCountryIso(DEFAULT_COUNTRY_ISO);
      setPhoneNumber("");
      setIsLoggedIn(true);
      resetOtpState();
      setOtpVerified(true);
      setShowAuthStep(false);
      setShouldPromptProfileCompletion(Boolean(user.isBasicAccount));
      if (user.email) {
        void checkFreeEligibility(user.email);
      }
    } else {
      resetGuestDetails();
    }
  }, [isOpen, checkFreeEligibility, resetGuestDetails, resetOtpState]);

  useEffect(() => {
    if (step === 2 && selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [step, selectedDate, fetchSlots]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedDate("");
        setSelectedSlot(null);
        setBooking(null);
        setError("");
        setFreeEligibility(null);
        setLastBookingWasFree(false);
        setIsCheckoutOpen(false);
        resetOtpState();
      }, 300);
    }
  }, [isOpen, resetOtpState]);

  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  const cells = buildCalendarGrid(calYear, calMonth);
  const todayStr = today.toISOString().split("T")[0];

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };
  const isCellDisabled = (day: number | null) => {
    if (!day) return true;
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr < todayStr;
  };
  const selectDay = (day: number | null) => {
    if (!day || isCellDisabled(day)) return;
    setSelectedDate(`${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  const confirmBooking = async (paymentId?: string, forceFree = false) => {
    if (!selectedSlot || !selectedDate || !userEmail || !userPhone) {
      setError("Please fill in all required fields.");
      return;
    }
    setBookingLoading(true);
    setError("");
    try {
      const isFree = Boolean((forceFree || freeEligibility?.eligible) && !paymentId);
      const body = {
        date: selectedDate,
        time: selectedSlot.time,
        userEmail,
        userName,
        userPhone,
        paymentId: paymentId || null,
        amount: 599,
        isFreeBooking: isFree
      };
      const res = await fetch(`${API_BASE}/api/bookings/book-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Booking failed.");
        return;
      }
      if (isFree) {
        const currentUser = getUser();
        if (currentUser) {
          setUser({ ...currentUser, hasUsedFreeBooking: true });
        }
      }
      setLastBookingWasFree(isFree);
      setBooking(data.booking);
      setStep(4);
    } catch {
      setError("Network error.");
    } finally {
      setBookingLoading(false);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  const [dir, setDir] = useState(1);
  const goNext = (nextStep: number) => { setDir(1); setStep(nextStep); };
  const goBack = (prevStep: number) => { setDir(-1); setStep(prevStep); };
  const needsQuickAuth = showAuthStep && !isLoggedIn && step === 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#10324a]/50"
          >
            <div className="w-full max-w-5xl bg-[#10324a] border border-[#d2a14a]/25 rounded-3xl shadow-[0_20px_50px_rgba(16,50,74,0.5)] overflow-hidden flex flex-col lg:flex-row min-h-[600px] relative">

              {/* ── Left Panel (Hero/Info) ── */}
              <div className="lg:w-[40%] bg-white/5 p-6 md:p-10 flex flex-col relative border-b lg:border-b-0 lg:border-r border-[#d2a14a]/15 overflow-hidden shrink-0">
                {/* Background Decor */}
                <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-[#d2a14a]/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-[#2ca59d]/12 rounded-full blur-[80px] pointer-events-none" />

                {/* Back Button */}
                <button onClick={onClose} className="absolute top-6 left-6 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  Back
                </button>

                <div className="flex-1 flex flex-col justify-center relative z-10 mt-12 lg:mt-0">
                  <div className="inline-flex items-center gap-2 bg-[#d2a14a]/10 border border-[#d2a14a]/30 rounded-full px-3 py-1 mb-5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d2a14a] animate-pulse" />
                    <span className="text-[#d2a14a] text-[11px] font-black tracking-widest uppercase">Book Session</span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-3">
                    <span
                      style={{
                        background: "linear-gradient(90deg, #d2a14a, #f4d89e, #d2a14a, #b3985e, #d2a14a)",
                        backgroundSize: "300% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Counselling<br />Session
                    </span>
                  </h2>
                  <p className="text-white/50 text-sm mb-8 font-medium max-w-[250px]">1-hour private one-on-one session with our experts.</p>

                  {/* Admin Badge */}
                  <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 w-fit backdrop-blur-md">
                    <div className="w-10 h-10 rounded-full bg-[#d2a14a]/20 flex items-center justify-center text-[#d2a14a] shrink-0 text-lg">
                      👤
                    </div>
                    <div>
                      <div className="text-white text-[11px] font-black uppercase tracking-widest mb-0.5">Expert Help</div>
                      <div className="text-white/40 text-[9px] font-black uppercase tracking-wider">With Admin / Consultant</div>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="mt-12 space-y-4 hidden lg:block">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#d2a14a]/10 border border-[#d2a14a]/25 flex items-center justify-center text-[#d2a14a] shrink-0 mt-0.5 text-[10px]">✓</div>
                      <p className="text-sm font-medium text-white/60">Personalized university shortlisting</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#d2a14a]/10 border border-[#d2a14a]/25 flex items-center justify-center text-[#d2a14a] shrink-0 mt-0.5 text-[10px]">✓</div>
                      <p className="text-sm font-medium text-white/60">Profile evaluation & strengthening</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#d2a14a]/10 border border-[#d2a14a]/25 flex items-center justify-center text-[#d2a14a] shrink-0 mt-0.5 text-[10px]">✓</div>
                      <p className="text-sm font-medium text-white/60">Application timeline planning</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right Panel (Interactive) ── */}
              <div className="lg:w-[60%] flex flex-col relative bg-[#10324a]">

                {/* Mobile Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all z-20 lg:hidden">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3}><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>

                {/* Steps */}
                {step < 4 && !needsQuickAuth && (
                  <div className="flex items-center gap-2 px-6 md:px-10 pt-8 pb-4 flex-shrink-0">
                    <StepDot step={1} current={step} label="Date" />
                    <div className={`flex-1 h-px ${step > 1 ? "bg-[#d2a14a]/40" : "bg-white/10"}`} />
                    <StepDot step={2} current={step} label="Time" />
                    <div className={`flex-1 h-px ${step > 2 ? "bg-[#d2a14a]/40" : "bg-white/10"}`} />
                    <StepDot step={3} current={step} label="Confirm" />
                  </div>
                )}

                {step < 4 && !needsQuickAuth && <div className="h-px bg-white/5 mx-6 md:mx-10 flex-shrink-0" />}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {needsQuickAuth ? (
                    <motion.div key="auth" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 md:p-10 space-y-5 flex flex-col justify-center h-full">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#d2a14a]/10 border border-[#d2a14a]/30 flex items-center justify-center text-[#d2a14a]">
                          {otpSent ? <Phone size={20} /> : <UserPlus size={20} />}
                        </div>
                        <div className="text-white text-lg font-black tracking-tight">Quick Booking</div>
                        <div className="text-white/40 text-[13px] font-medium mt-1">
                          {otpSent ? "Verify your phone number" : "Enter your details to get started"}
                        </div>
                      </div>

                      {!otpSent ? (
                        <div className="space-y-4 max-w-sm mx-auto w-full">
                          <input type="text" placeholder="Your Name" value={userName} onChange={e => setUserName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:border-[#d2a14a]/50 outline-none transition-colors" />
                          <input type="email" placeholder="Email Address *" value={userEmail} onChange={e => setUserEmail(e.target.value)} required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:border-[#d2a14a]/50 outline-none transition-colors" />
                          <div className="grid grid-cols-[120px_1fr] gap-3">
                            <select
                              aria-label="Country code"
                              value={selectedCountryIso}
                              onChange={e => {
                                const nextIso = e.target.value;
                                setSelectedCountryIso(nextIso);
                                setUserPhone(buildPhoneNumber(nextIso, phoneNumber));
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3.5 text-sm text-white focus:border-[#d2a14a]/50 outline-none transition-colors"
                            >
                              {COUNTRY_CODE_OPTIONS.map(country => (
                                <option key={country.isoCode} value={country.isoCode}>
                                  {country.flag} {country.dialCode}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              placeholder="Phone Number *"
                              value={phoneNumber}
                              onChange={e => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
                                setPhoneNumber(digits);
                                setUserPhone(buildPhoneNumber(selectedCountryIso, digits));
                              }}
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:border-[#d2a14a]/50 outline-none transition-colors"
                            />
                          </div>

                          {(otpError || error) && <div className="text-red-400 text-xs px-1 font-medium">{otpError || error}</div>}
                          {authConflict && (
                            <button
                              type="button"
                              onClick={() => router.push("/auth/login")}
                              className="w-full py-3.5 rounded-xl border border-[#d2a14a]/40 text-[#d2a14a] text-xs font-black uppercase tracking-widest hover:bg-[#d2a14a]/10 transition-all"
                            >
                              Login Instead
                            </button>
                          )}

                          <button type="button" onClick={sendOtp} disabled={otpLoading || authLoading || !userEmail || !phoneNumber}
                            className="w-full py-3.5 rounded-xl bg-[#d2a14a] text-[#10324a] text-[14px] font-black uppercase tracking-widest disabled:opacity-30 transition-all shadow-lg hover:shadow-[#d2a14a]/20 mt-2">
                            {otpLoading ? "Sending..." : "Send OTP"}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5 max-w-sm mx-auto w-full">
                          <div className="bg-white/5 border border-[#d2a14a]/15 rounded-2xl p-4 space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#d2a14a]/10 flex items-center justify-center text-[#d2a14a]">
                                <Phone size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-xs font-bold mb-0.5">OTP sent to</div>
                                <div className="text-[#d2a14a] text-sm truncate">{userPhone}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setOtpSent(false);
                                  setOtp("");
                                  setOtpError("");
                                  setError("");
                                  setOtpTimer(0);
                                  setOtpVerified(false);
                                }}
                                className="text-white/40 hover:text-white text-[10px] uppercase font-black tracking-wider bg-white/5 px-2 py-1.5 rounded-md"
                              >
                                Change
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              placeholder="Enter 6-digit OTP"
                              value={otp}
                              onChange={e => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                                setOtp(val);
                              }}
                              maxLength={6}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-white placeholder-white/20 focus:border-[#d2a14a]/50 outline-none font-mono transition-colors"
                            />

                            {otpTimer > 0 && (
                              <div className="text-center text-white/40 text-xs font-medium">
                                OTP expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, "0")}
                              </div>
                            )}
                          </div>

                          {(otpError || error) && <div className="text-red-400 text-xs px-1 font-medium">{otpError || error}</div>}
                          {authConflict && (
                            <button
                              type="button"
                              onClick={() => router.push("/auth/login")}
                              className="w-full py-3.5 rounded-xl border border-[#d2a14a]/40 text-[#d2a14a] text-xs font-black uppercase tracking-widest hover:bg-[#d2a14a]/10 transition-all"
                            >
                              Login Instead
                            </button>
                          )}

                          <button type="button" onClick={verifyOtp} disabled={otpLoading || authLoading || otpVerified || otp.length !== 6}
                            className="w-full py-3.5 rounded-xl bg-[#d2a14a] text-[#10324a] text-[14px] font-black uppercase tracking-widest disabled:opacity-30 transition-all shadow-lg hover:shadow-[#d2a14a]/20 mt-2">
                            {otpLoading || authLoading ? "Verifying..." : otpVerified ? "Verified" : "Verify & Continue"}
                          </button>

                          {otpTimer === 0 && (
                            <button type="button" onClick={sendOtp} disabled={otpLoading || authLoading}
                              className="w-full text-[#d2a14a] text-[13px] font-bold hover:underline disabled:opacity-40">
                              Resend OTP
                            </button>
                          )}
                        </div>
                      )}

                      <div className="text-center mt-6">
                        <button onClick={() => router.push("/auth/login")} className="text-[#d2a14a] text-[13px] font-bold hover:underline">
                          Already have an account? Login
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait" custom={dir}>
                      {step === 1 && (
                        <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-6 md:p-10 space-y-6">
                          <div className="space-y-4 max-w-sm mx-auto">
                            <label className="text-[13px] font-bold md:text-[14px] font-black text-white/50 uppercase tracking-widest block text-center">Select Date</label>
                            <div className="bg-white/5 border border-[#d2a14a]/15 rounded-2xl p-4 md:p-5 shadow-inner">
                              <div className="flex items-center justify-between mb-5">
                                <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">‹</button>
                                <span className="text-[15px] font-black text-white uppercase tracking-wider">{monthNames[calMonth]} {calYear}</span>
                                <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">›</button>
                              </div>
                              <div className="grid grid-cols-7 mb-3">
                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                  <div key={d} className="text-center text-[12px] font-black text-[#d2a14a]/60 uppercase py-1">{d}</div>
                                ))}
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {cells.map((day, i) => {
                                  const dateStr = day ? `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
                                  const disabled = isCellDisabled(day);
                                  const isSelected = dateStr === selectedDate;
                                  const isToday = dateStr === todayStr;
                                  return (
                                    <button key={i} onClick={() => selectDay(day)} disabled={disabled}
                                      className={`aspect-square w-full rounded-xl text-sm font-bold transition-all flex items-center justify-center
                                      ${!day ? "invisible" : ""}
                                      ${disabled ? "text-white/10 cursor-not-allowed" : "hover:bg-[#d2a14a]/10 text-white"}
                                      ${isSelected ? "!bg-[#d2a14a] !text-[#10324a] shadow-lg shadow-[#d2a14a]/20 scale-105" : ""}
                                      ${isToday && !isSelected ? "text-[#d2a14a] ring-1 ring-[#d2a14a]/30" : ""}
                                    `}
                                    >{day}</button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-6 md:p-10 space-y-6">
                          <div className="flex items-center justify-center gap-4 bg-white/5 border border-[#d2a14a]/15 rounded-2xl px-5 py-4 max-w-sm mx-auto shadow-inner">
                            <div className="w-10 h-10 rounded-full bg-[#d2a14a]/10 flex items-center justify-center text-xl">📅</div>
                            <div className="text-left">
                              <div className="text-white font-black text-sm uppercase tracking-wider">{formatDate(selectedDate)}</div>
                              <div className="text-[#d2a14a]/70 text-[11px] font-black uppercase tracking-widest mt-0.5">Select a preferred slot below</div>
                            </div>
                          </div>

                          {error && <div className="text-red-400 text-[14px] font-bold text-center">{error}</div>}

                          <div className="max-w-md mx-auto">
                            {slotsLoading ? (
                              <div className="grid grid-cols-3 gap-3">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}</div>
                            ) : (
                              <div className="grid grid-cols-3 gap-3">
                                {slots.length === 0 ? (
                                  <div className="col-span-3 text-center py-10 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-4xl mb-3 opacity-50">⏰</div>
                                    <div className="text-white/70 text-[15px] font-black tracking-wide">No slots available</div>
                                    <div className="text-white/40 text-xs mt-1">Please select another date</div>
                                  </div>
                                ) : slots.map((slot) => {
                                  const isToday = selectedDate === todayStr;
                                  const blocked = isSlotBlocked(slot, isToday);
                                  const isSelected = selectedSlot?.time === slot.time && !blocked;
                                  const isBooked = !slot.available;
                                  const isPast = !isBooked && blocked;

                                  let subLabel = slot.endTime;
                                  if (isBooked) subLabel = "Booked";
                                  else if (isPast) subLabel = "Past";

                                  return (
                                    <button key={slot.time} disabled={blocked} onClick={() => setSelectedSlot(slot)}
                                      className={`h-14 rounded-xl text-xs font-black uppercase tracking-wider border flex flex-col items-center justify-center transition-all relative overflow-hidden
                                      ${isSelected
                                          ? "bg-[#d2a14a] border-[#d2a14a] text-[#10324a] shadow-[0_5px_15px_rgba(210,161,74,0.3)] scale-105 z-10"
                                          : blocked ? "bg-white/5 border-white/10 opacity-40 cursor-not-allowed" : "bg-white/5 border-white/10 text-white/70 hover:border-[#d2a14a]/40 hover:bg-[#d2a14a]/5"
                                        }
                                    `}
                                    >
                                      <span className={blocked ? "line-through text-white/40" : ""}>{slot.time}</span>
                                      <span className={`text-[9px] mt-0.5 tracking-widest ${isSelected ? "text-[#10324a]/70" : blocked ? "text-red-400/70" : "text-[#d2a14a]/50"}`}>{subLabel}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-6 md:p-10 space-y-6">
                          <div className="max-w-sm mx-auto space-y-5">
                            {freeEligibility?.eligible && (
                              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                                    <Gift size={18} />
                                  </div>
                                  <div>
                                    <div className="text-green-400 text-sm font-black uppercase tracking-wide">Your First Session is FREE!</div>
                                    <div className="text-green-400/60 text-xs font-medium mt-0.5">No payment required</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {!freeEligibility?.eligible && freeEligibility?.message && (
                              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-white/50 text-xs text-center font-medium">
                                {freeEligibility.message}
                              </div>
                            )}

                            <div className="bg-white/5 border border-[#d2a14a]/15 rounded-2xl p-5 space-y-2 text-center shadow-inner">
                              <div className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Session Summary</div>
                              <div className="text-white text-sm font-black uppercase tracking-wider">{formatDate(selectedDate)}</div>
                              <div className="text-[#d2a14a] text-lg font-black uppercase tracking-widest">{selectedSlot?.time} – {selectedSlot?.endTime}</div>
                            </div>

                            <div className="space-y-3">
                              <input type="text" placeholder="Full Name" value={userName} onChange={e => setUserName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:border-[#d2a14a]/50 outline-none transition-colors" />
                              <input type="email" placeholder="Email Address *" value={userEmail} onChange={e => setUserEmail(e.target.value)} onBlur={() => void checkFreeEligibility(userEmail)} required disabled={isLoggedIn}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:border-[#d2a14a]/50 outline-none disabled:opacity-50 transition-colors" />
                              <input type="tel" placeholder="Phone Number *" value={userPhone} onChange={e => setUserPhone(e.target.value)} required disabled={isLoggedIn}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:border-[#d2a14a]/50 outline-none disabled:opacity-50 transition-colors" />
                            </div>

                            {isLoggedIn && (
                              <div className="flex items-center justify-between gap-3 text-[12px] px-2 bg-white/5 py-2 rounded-lg border border-white/10">
                                <span className="text-white/50 font-medium">Using saved account details</span>
                                <button
                                  type="button"
                                  onClick={useDifferentDetails}
                                  className="text-[#d2a14a] hover:text-white transition-colors font-black uppercase tracking-wider text-[10px]"
                                >
                                  Change
                                </button>
                              </div>
                            )}

                            {error && <div className="text-red-400 text-xs text-center font-medium">{error}</div>}

                            {!freeEligibility?.eligible && (
                              <div className="bg-[#d2a14a]/10 border border-[#d2a14a]/25 rounded-2xl p-5 space-y-2">
                                <div className="flex justify-between items-center text-[13px] font-black text-white/60 uppercase tracking-widest">
                                  <span>Session Charge</span>
                                  <span className="text-[#d2a14a] text-base">Rs. 599</span>
                                </div>
                                <div className="text-[11px] text-[#d2a14a]/70 font-medium leading-relaxed">Charges are fully adjustable against any EduLeaderGlobal premium service you opt for later.</div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && booking && (
                        <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 md:p-12 space-y-8 text-center max-w-md mx-auto flex flex-col justify-center h-full min-h-[400px]">
                          <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            {lastBookingWasFree ? <Gift size={32} /> : <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-wide">
                              {lastBookingWasFree ? "Free Session Booked!" : "Session Confirmed!"}
                            </h3>
                            <p className="text-white/50 text-[14px] font-medium mt-2">Confirmation sent to <span className="text-white">{userEmail}</span></p>
                          </div>

                          <div className="bg-white/5 border border-[#d2a14a]/25 rounded-2xl p-5 space-y-4 text-left shadow-inner">
                            <Row label="Date" value={formatDate(booking.date)} />
                            <Row label="Time" value={booking.time} />
                            <div className="pt-4 border-t border-white/10">
                              <div className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-1.5">Meeting ID</div>
                              <code className="block w-full bg-black/30 px-4 py-3 rounded-xl text-[#d2a14a] text-sm font-black font-mono text-center tracking-widest border border-[#d2a14a]/15">{booking.meetingId}</code>
                            </div>
                          </div>

                          {shouldPromptProfileCompletion && lastBookingWasFree && (
                            <div className="bg-[#d2a14a]/10 border border-[#d2a14a]/25 rounded-2xl p-5 text-left">
                              <div className="text-[#d2a14a] text-sm font-black uppercase tracking-wider mb-2">Complete Your Profile</div>
                              <div className="text-white/60 text-xs font-medium mb-4 leading-relaxed">Add your profile details to book more sessions and access your full student dashboard.</div>
                              <button onClick={() => { onClose(); router.push("/User/edit-profile"); }}
                                className="w-full py-3 rounded-xl border-2 border-[#d2a14a] text-[#d2a14a] text-xs font-black uppercase tracking-widest hover:bg-[#d2a14a] hover:text-[#10324a] transition-colors">
                                Complete Profile Now
                              </button>
                            </div>
                          )}

                          <button onClick={() => { onClose(); router.push(`/meeting/${booking.sessionId}`); }}
                            className="w-full bg-[#d2a14a] text-[#10324a] font-black py-4 rounded-xl text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(210,161,74,0.2)] hover:shadow-[0_15px_30px_rgba(210,161,74,0.3)] transition-all hover:-translate-y-1">
                            Enter Meeting Room
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {/* Footer Controls */}
                {step < 4 && !needsQuickAuth && (
                  <div className="p-6 md:p-10 pt-4 border-t border-white/10 flex gap-3 mt-auto shrink-0 bg-[#10324a]">
                    {step > 1 && (
                      <button onClick={() => goBack(step - 1)} className="flex-[0.4] py-3.5 rounded-xl border border-white/15 text-white/60 hover:text-white hover:bg-white/5 text-[12px] font-black uppercase tracking-widest transition-all">Back</button>
                    )}
                    <button
                      onClick={async () => {
                        if (step === 1 && selectedDate) goNext(2);
                        else if (step === 2 && selectedSlot) {
                          goNext(3);
                          if (userEmail) {
                            void checkFreeEligibility(userEmail);
                          }
                        }
                        else if (step === 3) {
                          if (!userName || !userEmail || !userPhone) {
                            setError("Please fill all details");
                            return;
                          }

                          const eligibility = await checkFreeEligibility(userEmail);
                          if ((eligibility || freeEligibility)?.eligible) {
                            await confirmBooking(undefined, true);
                          } else {
                            setIsCheckoutOpen(true);
                          }
                        }
                      }}
                      disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedSlot) || (step === 3 && (bookingLoading || isCheckingEligibility))}
                      className="flex-1 py-3.5 rounded-xl bg-[#d2a14a] text-[#10324a] text-[13px] font-black uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-[#d2a14a]/15 hover:shadow-[#d2a14a]/25"
                    >
                      {bookingLoading ? "Booking..." : isCheckingEligibility ? "Checking..." : step === 3 ? (freeEligibility?.eligible ? "Confirm Free Session" : "Confirm & Pay (Rs.599)") : "Continue"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={confirmBooking}
            items={[{ name: "Counselling Session", price: 999 }]}
            subtotal={999}
            discount={400}
            total={599}
            currency="INR"
          />
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/30 text-[14px] font-bold font-bold uppercase">{label}</span>
      <span className="text-white text-[11px] font-bold">{value}</span>
    </div>
  );
}