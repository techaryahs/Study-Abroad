"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/lib/token";
import CheckoutModal from "@/app/User/cart/checkoutmodal";
import { UserX, Clock } from "lucide-react";

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
  consultantVideoEnabled?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

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
  if (!slot.available) return true;
  if (isToday && slot.time) {
    const parsed = parseTime(slot.time);
    if (!parsed) return false;
    const now = new Date();
    // Device local time check
    const slotDt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parsed.hours, parsed.minutes);
    return slotDt <= now;
  }
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
          ? "bg-[#D4A848] border-[#D4A848] text-[#2D1F1D]"
          : active
            ? "bg-transparent border-[#D4A848] text-[#D4A848]"
            : "bg-transparent border-white/20 text-white/30"
          }`}
      >
        {done ? "✓" : step}
      </div>
      <span className={`text-[12px] font-black md:text-[13px] font-bold font-semibold uppercase tracking-wider ${active ? "text-[#D4A848]" : done ? "text-white/60" : "text-white/25"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookCounsellingModal({ isOpen, onClose }: Props) {
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
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserName(user.name || "");
      setUserEmail(user.email || "");
    }
  }, []);

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
      }, 300);
    }
  }, [isOpen]);

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

  const confirmBooking = async (paymentId?: string) => {
    if (!selectedSlot || !selectedDate || !userEmail) {
      setError("Please fill in your name and email.");
      return;
    }
    setBookingLoading(true);
    setError("");
    try {
      const body = {
        date: selectedDate,
        time: selectedSlot.time,
        userEmail,
        userName,
        paymentId: paymentId || null,
        amount: 599
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-[340px] md:max-w-[400px] bg-[#2D1F1D] border border-[#D4A848]/20 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[82vh]">

              {/* Header */}
              <div className="relative flex items-center justify-between px-4 md:px-5 pt-4 md:pt-5 pb-3 flex-shrink-0">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#D4A848]/10 border border-[#D4A848]/25 rounded-full px-2.5 py-0.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A848] animate-pulse" />
                    <span className="text-[#D4A848] text-[12px] font-black md:text-[13px] font-bold font-bold tracking-widest uppercase">Book Session</span>
                  </div>
                  <h2 className="text-base md:text-lg font-black text-white leading-tight">Counselling Session</h2>
                  <p className="text-white/40 text-[13px] font-bold md:text-[14px] font-bold mt-0.5">1-hour private session</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3}><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Steps */}
              {step < 4 && (
                <div className="flex items-center gap-2 px-4 md:px-5 pb-3 flex-shrink-0">
                  <StepDot step={1} current={step} label="Date" />
                  <div className={`flex-1 h-px ${step > 1 ? "bg-[#D4A848]/40" : "bg-white/10"}`} />
                  <StepDot step={2} current={step} label="Time" />
                  <div className={`flex-1 h-px ${step > 2 ? "bg-[#D4A848]/40" : "bg-white/10"}`} />
                  <StepDot step={3} current={step} label="Confirm" />
                </div>
              )}

              {/* Admin Badge */}
              {step < 4 && (
                <div className="px-4 md:px-5 pb-2 flex-shrink-0">
                  <div className="inline-flex items-center gap-2 bg-[#D4A848]/10 border border-[#D4A848]/25 rounded-full px-2.5 py-1">
                    <span className="text-[#D4A848] text-[12px] font-black md:text-[13px] font-bold font-bold uppercase tracking-tight">👤 Counselling with Admin</span>
                  </div>
                </div>
              )}

              <div className="h-px bg-white/5 flex-shrink-0" />

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto min-h-0 bg-black/10">
                <AnimatePresence mode="wait" custom={dir}>
                  {step === 1 && (
                    <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-4 space-y-4">
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold md:text-[14px] font-bold font-bold text-white/50 uppercase tracking-widest block">Select Date</label>
                        <div className="bg-[#362B25]/40 border border-[#D4A848]/10 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-3">
                            <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white">‹</button>
                            <span className="text-sm font-black text-white">{monthNames[calMonth]} {calYear}</span>
                            <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white">›</button>
                          </div>
                          <div className="grid grid-cols-7 mb-2">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                              <div key={d} className="text-center text-[13px] font-bold font-bold text-white/20 uppercase py-1">{d}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-0.5">
                            {cells.map((day, i) => {
                              const dateStr = day ? `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
                              const disabled = isCellDisabled(day);
                              const isSelected = dateStr === selectedDate;
                              const isToday = dateStr === todayStr;
                              return (
                                <button key={i} onClick={() => selectDay(day)} disabled={disabled}
                                  className={`h-8 w-full rounded-lg text-xs font-bold transition-all
                                    ${!day ? "invisible" : ""}
                                    ${disabled ? "text-white/10 cursor-not-allowed" : "hover:bg-[#D4A848]/10 text-white"}
                                    ${isSelected ? "!bg-[#D4A848] !text-[#2D1F1D] shadow-lg shadow-[#D4A848]/10" : ""}
                                    ${isToday && !isSelected ? "text-[#D4A848] ring-1 ring-[#D4A848]/30" : ""}
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
                    <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-4 space-y-4">
                      <div className="flex items-center gap-3 bg-[#362B25]/60 border border-[#D4A848]/10 rounded-xl px-3 py-2.5">
                        <span className="text-lg">📅</span>
                        <div>
                          <div className="text-white font-bold text-xs">{formatDate(selectedDate)}</div>
                          <div className="text-white/40 text-[13px] font-bold">Select a preferred slot below</div>
                        </div>
                      </div>
                      {error && <div className="text-red-400 text-[14px] font-bold px-2">{error}</div>}
                      {slotsLoading ? (
                        <div className="grid grid-cols-3 gap-2">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {slots.length === 0 ? (
                            <div className="col-span-3 text-center py-6">
                              <div className="text-3xl mb-2">⏰</div>
                              <div className="text-white/70 text-xs font-bold">No slots available</div>
                              <div className="text-white/40 text-[10px]">Please select another date</div>
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
                                className={`h-12 rounded-lg text-[11px] font-bold border flex flex-col items-center justify-center transition-all relative overflow-hidden
                                  ${isSelected
                                    ? "bg-[#D4A848] border-[#D4A848] text-[#2D1F1D]"
                                    : blocked ? "bg-[#362B25]/20 border-white/5 opacity-50 cursor-not-allowed" : "bg-[#362B25]/40 border-white/5 text-white/70 hover:border-[#D4A848]/30"
                                  }
                                `}
                              >
                                <span className={blocked ? "line-through text-white/40" : ""}>{slot.time}</span>
                                <span className={`text-[8px] ${isSelected ? "text-[#2D1F1D]/60" : blocked ? "text-red-400/70" : "text-white/30"}`}>{subLabel}</span>
                                {blocked && (
                                  <div className="absolute top-1 right-1 opacity-40">
                                    {isBooked ? (
                                      <UserX size={10} className="text-red-400" />
                                    ) : (
                                      <Clock size={10} className="text-white/50" />
                                    )}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="p-4 space-y-4">
                      <div className="bg-[#362B25]/60 border border-[#D4A848]/10 rounded-xl p-3.5 space-y-2">
                        <div className="text-[13px] font-bold font-bold text-white/30 uppercase tracking-widest">Summary</div>
                        <div className="text-white text-xs font-bold leading-none">{formatDate(selectedDate)}</div>
                        <div className="text-[#D4A848] text-[14px] font-bold font-bold uppercase">{selectedSlot?.time} – {selectedSlot?.endTime}</div>
                      </div>
                      <div className="space-y-2">
                        <input type="text" placeholder="Full Name" value={userName} onChange={e => setUserName(e.target.value)}
                          className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none" />
                        <input type="email" placeholder="Email Address *" value={userEmail} onChange={e => setUserEmail(e.target.value)} required
                          className="w-full bg-[#1A110F] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#D4A848]/40 outline-none" />
                      </div>
                      <div className="bg-[#D4A848]/10 border border-[#D4A848]/20 rounded-xl p-3.5 space-y-1">
                        <div className="flex justify-between items-center text-[14px] font-bold font-bold text-white/50 uppercase">
                          <span>Session Charge</span>
                          <span className="text-white">₹599</span>
                        </div>
                        <div className="text-[13px] font-bold text-[#D4A848]/60 font-medium">Charges are fully adjustable in any service you opt for later.</div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && booking && (
                    <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-5 text-center">
                      <div className="w-14 h-14 bg-[#D4A848]/10 border border-[#D4A848]/30 rounded-full flex items-center justify-center mx-auto text-2xl">🎉</div>
                      <div>
                        <h3 className="text-lg font-black text-white leading-tight">Confirmed!</h3>
                        <p className="text-white/40 text-[14px] font-bold mt-1">Sent to {userEmail}</p>
                      </div>
                      <div className="bg-black/20 border border-white/5 rounded-xl p-3 space-y-2 text-left">
                        <Row label="Date" value={formatDate(booking.date)} />
                        <Row label="Time" value={booking.time} />
                        <div className="pt-2 border-t border-white/5">
                          <div className="text-[12px] font-black text-white/30 uppercase mb-0.5">Meeting ID</div>
                          <code className="text-[#D4A848] text-xs font-bold font-mono">{booking.meetingId}</code>
                        </div>
                      </div>
                      <button onClick={() => { onClose(); router.push(`/meeting/${booking.sessionId}`); }}
                        className="w-full bg-[#D4A848] text-[#2D1F1D] font-black py-3 rounded-lg text-xs uppercase tracking-widest shadow-xl shadow-[#D4A848]/10">Join Room</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {step < 4 && (
                <div className="p-3 md:p-4 border-t border-white/5 flex gap-2">
                  {step > 1 && (
                    <button onClick={() => goBack(step - 1)} className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/50 text-[14px] font-bold font-bold uppercase transition-all">Back</button>
                  )}
                  <button
                    onClick={() => {
                      if (step === 1 && selectedDate) goNext(2);
                      else if (step === 2 && selectedSlot) goNext(3);
                      else if (step === 3) {
                        if (!userName || !userEmail) { setError("Fill details first"); return; }
                        setIsCheckoutOpen(true);
                      }
                    }}
                    disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedSlot) || (step === 3 && bookingLoading)}
                    className="flex-1 py-2.5 rounded-lg bg-[#D4A848] text-[#2D1F1D] text-[14px] font-bold font-black uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all"
                  >
                    {bookingLoading ? "..." : step === 3 ? "Confirm & Pay" : "Continue"}
                  </button>
                </div>
              )}
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
