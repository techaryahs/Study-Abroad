"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/lib/token";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Slot {
  time: string;
  endTime: string;
  available: boolean;
  booked: boolean;
  past: boolean;
}

interface Counsellor {
  _id: string;
  name: string;
  role: string;
  image: string;
  expertise: string;
}

interface BookingResult {
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  consultantName: string;
  userEmail: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

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

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepDot({ step, current, label }: { step: number; current: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
          done
            ? "bg-[#d4af37] border-[#d4af37] text-black"
            : active
            ? "bg-transparent border-[#d4af37] text-[#d4af37]"
            : "bg-transparent border-white/20 text-white/30"
        }`}
      >
        {done ? "✓" : step}
      </div>
      <span className={`text-[10px] font-semibold uppercase tracking-wider ${active ? "text-[#d4af37]" : done ? "text-white/60" : "text-white/25"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookCounsellingModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  // Step: 1 = date+counsellor, 2 = time slot, 3 = confirm + user info, 4 = success
  const [step, setStep] = useState(1);

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Counsellors
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState<string>("auto");

  // Time slots
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // User details form
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Booking
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill from local auth
  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserName(user.name || "");
      setUserEmail(user.email || "");
    }
  }, []);

  // Fetch counsellors once
  useEffect(() => {
    if (!isOpen) return;
    fetch(`${API_BASE}/api/bookings/consultants`)
      .then((r) => r.json())
      .then((d) => setCounsellors(d.consultants || []))
      .catch(() => setCounsellors([]));
  }, [isOpen]);

  // Fetch available slots when date/counsellor changes
  const fetchSlots = useCallback(async (date: string, counsellorId: string) => {
    if (!date) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    setError("");
    try {
      const params = new URLSearchParams({ date });
      if (counsellorId !== "auto") params.append("counsellorId", counsellorId);
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

  useEffect(() => {
    if (step === 2 && selectedDate) {
      fetchSlots(selectedDate, selectedCounsellor);
    }
  }, [step, selectedDate, selectedCounsellor, fetchSlots]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedDate("");
        setSelectedSlot(null);
        setBooking(null);
        setError("");
      }, 300);
    }
  }, [isOpen]);

  // ── Calendar helpers ────────────────────────────────────────────────
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

  // ── Book session ────────────────────────────────────────────────────
  const confirmBooking = async () => {
    if (!selectedSlot || !selectedDate || !userEmail) {
      setError("Please fill in your name and email.");
      return;
    }
    setBookingLoading(true);
    setError("");
    try {
      const body: Record<string, string> = {
        date: selectedDate,
        time: selectedSlot.time,
        userEmail,
        userName,
      };
      if (selectedCounsellor !== "auto") body.consultantId = selectedCounsellor;

      const res = await fetch(`${API_BASE}/api/bookings/book-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Booking failed. Please try again.");
        return;
      }
      setBooking(data.booking);
      setStep(4);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setBookingLoading(false);
    }
  };

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const [dir, setDir] = useState(1);
  const goNext = (nextStep: number) => { setDir(1); setStep(nextStep); };
  const goBack = (prevStep: number) => { setDir(-1); setStep(prevStep); };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

              {/* Header */}
              <div className="relative flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/25 rounded-full px-3 py-1 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                    <span className="text-[#d4af37] text-[10px] font-bold tracking-widest uppercase">Book Session</span>
                  </div>
                  <h2 className="text-xl font-black text-white leading-tight">Counselling Session</h2>
                  <p className="text-white/40 text-xs mt-0.5">1-hour private session with your counsellor</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Step indicator */}
              {step < 4 && (
                <div className="flex items-center gap-2 px-6 pb-4 flex-shrink-0">
                  <StepDot step={1} current={step} label="Date" />
                  <div className={`flex-1 h-px transition-colors duration-300 ${step > 1 ? "bg-[#d4af37]/40" : "bg-white/10"}`} />
                  <StepDot step={2} current={step} label="Time" />
                  <div className={`flex-1 h-px transition-colors duration-300 ${step > 2 ? "bg-[#d4af37]/40" : "bg-white/10"}`} />
                  <StepDot step={3} current={step} label="Confirm" />
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-white/[0.06] flex-shrink-0" />

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait" custom={dir}>
                  {/* ── STEP 1: Date & counsellor ───────────────────────────── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="p-6 space-y-5"
                    >
                      {/* Counsellor Selector */}
                      <div>
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                          Counsellor (optional)
                        </label>
                        <select
                          value={selectedCounsellor}
                          onChange={(e) => setSelectedCounsellor(e.target.value)}
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/40 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="auto">🤖 Auto-assign best counsellor</option>
                          {counsellors.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name} — {c.expertise}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Calendar */}
                      <div>
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 block">
                          Select Date
                        </label>
                        <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-4">
                          {/* Month nav */}
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={prevMonth}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
                            >
                              ‹
                            </button>
                            <span className="text-sm font-bold text-white">
                              {monthNames[calMonth]} {calYear}
                            </span>
                            <button
                              onClick={nextMonth}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
                            >
                              ›
                            </button>
                          </div>

                          {/* Day headers */}
                          <div className="grid grid-cols-7 mb-2">
                            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                              <div key={d} className="text-center text-[10px] font-semibold text-white/30 uppercase tracking-wider py-1">
                                {d}
                              </div>
                            ))}
                          </div>

                          {/* Day cells */}
                          <div className="grid grid-cols-7 gap-0.5">
                            {cells.map((day, i) => {
                              const dateStr = day
                                ? `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                                : "";
                              const disabled = isCellDisabled(day);
                              const isSelected = dateStr === selectedDate;
                              const isToday = dateStr === todayStr;
                              return (
                                <button
                                  key={i}
                                  onClick={() => selectDay(day)}
                                  disabled={disabled}
                                  className={`
                                    relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-150
                                    ${!day ? "invisible" : ""}
                                    ${disabled ? "text-white/20 cursor-not-allowed" : "hover:bg-[#d4af37]/10 cursor-pointer"}
                                    ${isSelected ? "!bg-[#d4af37] !text-black font-bold shadow-lg shadow-[#d4af37]/20" : ""}
                                    ${isToday && !isSelected ? "text-[#d4af37] ring-1 ring-[#d4af37]/40 ring-inset" : ""}
                                    ${!disabled && !isSelected ? "text-white" : ""}
                                  `}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 2: Time Slots ──────────────────────────────────── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="p-6 space-y-4"
                    >
                      <div className="flex items-center gap-3 bg-[#141414] border border-white/[0.07] rounded-xl px-4 py-3">
                        <span className="text-[#d4af37] text-lg">📅</span>
                        <div>
                          <div className="text-white font-semibold text-sm">{formatDate(selectedDate)}</div>
                          <div className="text-white/40 text-xs">Select a 1-hour slot below</div>
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      {slotsLoading ? (
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {slots.map((slot) => {
                            const isSelected = selectedSlot?.time === slot.time;
                            return (
                              <button
                                key={slot.time}
                                disabled={!slot.available}
                                onClick={() => setSelectedSlot(slot)}
                                className={`
                                  relative flex flex-col items-center justify-center h-16 rounded-xl text-sm font-semibold
                                  border transition-all duration-200
                                  ${isSelected
                                    ? "bg-[#d4af37] border-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20 scale-[1.03]"
                                    : slot.available
                                    ? "bg-[#141414] border-white/10 text-white hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5 cursor-pointer"
                                    : slot.booked
                                    ? "bg-red-950/30 border-red-900/30 text-red-400/50 cursor-not-allowed"
                                    : "bg-white/[0.02] border-white/5 text-white/20 cursor-not-allowed"
                                  }
                                `}
                              >
                                <span className="font-bold">{slot.time}</span>
                                <span className={`text-[10px] ${isSelected ? "text-black/60" : "text-white/40"}`}>
                                  {slot.available ? `–  ${slot.endTime}` : slot.booked ? "Booked" : "Past"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Legend */}
                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-sm bg-[#d4af37]" />
                          <span className="text-white/40 text-[10px]">Selected</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-sm bg-[#141414] border border-white/20" />
                          <span className="text-white/40 text-[10px]">Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-sm bg-red-950/30 border border-red-900/30" />
                          <span className="text-white/40 text-[10px]">Booked</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: User Info + Confirm ─────────────────────────── */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="p-6 space-y-5"
                    >
                      {/* Summary card */}
                      <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-4 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Booking Summary</h3>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-0.5">📅</span>
                          <div>
                            <div className="text-white font-semibold">{formatDate(selectedDate)}</div>
                            <div className="text-white/50 text-sm">
                              {selectedSlot?.time} – {selectedSlot?.endTime} &nbsp;·&nbsp; 60 minutes
                            </div>
                            {selectedCounsellor !== "auto" && counsellors.find((c) => c._id === selectedCounsellor) && (
                              <div className="text-[#d4af37] text-sm mt-1">
                                with {counsellors.find((c) => c._id === selectedCounsellor)?.name}
                              </div>
                            )}
                            {selectedCounsellor === "auto" && (
                              <div className="text-white/40 text-xs mt-1">Counsellor auto-assigned</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* User info */}
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block">Your Details</label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#d4af37]/40 transition-colors"
                        />
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          required
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#d4af37]/40 transition-colors"
                        />
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                          {error}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── STEP 4: Success ─────────────────────────────────────── */}
                  {step === 4 && booking && (
                    <motion.div
                      key="step4"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="p-6 space-y-5"
                    >
                      {/* Success icon */}
                      <div className="flex flex-col items-center text-center gap-3 py-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                          className="w-20 h-20 rounded-full bg-[#d4af37]/10 border-2 border-[#d4af37]/30 flex items-center justify-center text-4xl"
                        >
                          🎉
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-black text-white">Session Booked!</h3>
                          <p className="text-white/45 text-sm mt-1 max-w-xs">
                            A confirmation email has been sent to <span className="text-white">{booking.userEmail}</span>
                          </p>
                        </div>
                      </div>

                      {/* Session details */}
                      <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-4 space-y-3">
                        <Row label="Date" value={formatDate(booking.date)} />
                        <Row label="Time" value={`${booking.time} – ${booking.endTime}`} />
                        <Row label="Counsellor" value={booking.consultantName} />
                        <div className="pt-1 border-t border-white/[0.06]">
                          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Meeting ID</div>
                          <code className="text-[#d4af37] font-mono font-bold text-sm tracking-widest">{booking.meetingId}</code>
                        </div>
                        <div>
                          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Session ID</div>
                          <code className="text-white/50 font-mono text-[11px] break-all">{booking.sessionId}</code>
                        </div>
                      </div>

                      {/* Join meeting CTA */}
                      <button
                        id="join-meeting-btn"
                        onClick={() => {
                          onClose();
                          router.push(`/meeting/${booking.sessionId}`);
                        }}
                        className="w-full group relative overflow-hidden bg-[#d4af37] text-black font-black text-sm py-4 rounded-2xl hover:bg-yellow-400 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#d4af37]/20"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                          </svg>
                          Join Meeting Room
                        </span>
                      </button>

                      <p className="text-center text-white/25 text-xs">
                        You can also join later from your dashboard at the scheduled time.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer actions */}
              {step < 4 && (
                <div className="flex-shrink-0 border-t border-white/[0.06] px-6 py-4 flex items-center gap-3">
                  {step > 1 && (
                    <button
                      onClick={() => goBack(step - 1)}
                      className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:border-white/20 hover:text-white transition-all"
                    >
                      ← Back
                    </button>
                  )}

                  {step === 1 && (
                    <button
                      onClick={() => { if (selectedDate) goNext(2); }}
                      disabled={!selectedDate}
                      id="step1-next-btn"
                      className="flex-1 py-3 rounded-xl bg-[#d4af37] text-black text-sm font-black hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next — Choose Time →
                    </button>
                  )}
                  {step === 2 && (
                    <button
                      onClick={() => { if (selectedSlot) goNext(3); }}
                      disabled={!selectedSlot}
                      id="step2-next-btn"
                      className="flex-1 py-3 rounded-xl bg-[#d4af37] text-black text-sm font-black hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next — Your Details →
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      onClick={confirmBooking}
                      disabled={bookingLoading || !userEmail}
                      id="confirm-booking-btn"
                      className="flex-1 py-3 rounded-xl bg-[#d4af37] text-black text-sm font-black hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {bookingLoading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Booking…
                        </>
                      ) : (
                        "✓ Confirm Booking"
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Small helper component ───────────────────────────────────────────────────
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/40 text-xs">{label}</span>
      <span className="text-white text-sm font-semibold">{value}</span>
    </div>
  );
}
