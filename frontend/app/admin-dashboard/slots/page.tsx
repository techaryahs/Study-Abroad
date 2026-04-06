"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/app/lib/token";
import { Calendar, Clock, Plus, Trash2, Power, Save, X, Check, Edit2 } from "lucide-react";

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  duration: number;
  isActive: boolean;
}

interface DaySchedule {
  dayOfWeek: string;
  isEnabled: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  _id: string;
  name: string;
  isActive: boolean;
  schedule: DaySchedule[];
  notes: string;
}

const DAYS = [
  { key: "monday", label: "Monday", emoji: "📅" },
  { key: "tuesday", label: "Tuesday", emoji: "📅" },
  { key: "wednesday", label: "Wednesday", emoji: "📅" },
  { key: "thursday", label: "Thursday", emoji: "📅" },
  { key: "friday", label: "Friday", emoji: "📅" },
  { key: "saturday", label: "Saturday", emoji: "🎯" },
  { key: "sunday", label: "Sunday", emoji: "🎯" }
];

// Helper function to convert 24-hour to 12-hour AM/PM format
const formatTime12Hour = (time24: string): string => {
  if (!time24 || typeof time24 !== 'string') return '';
  
  const parts = time24.split(':');
  if (parts.length !== 2) return time24;
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  if (isNaN(hours) || isNaN(minutes)) return time24;
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Helper function to convert 12-hour AM/PM to 24-hour format
const convertTo24Hour = (hour: string, minute: string, period: string): string => {
  let h = parseInt(hour, 10);
  
  if (period === "PM" && h !== 12) {
    h += 12;
  } else if (period === "AM" && h === 12) {
    h = 0;
  }
  
  return `${h.toString().padStart(2, '0')}:${minute}`;
};

export default function AdminWeeklySchedulePage() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showEditSlotModal, setShowEditSlotModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<{ dayOfWeek: string; slot: TimeSlot } | null>(null);
  const [copyToAllDays, setCopyToAllDays] = useState(true); // Auto-copy to all days by default
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  // New time slot form with 12-hour format
  const [newSlot, setNewSlot] = useState({
    startHour: "9",
    startMinute: "00",
    startPeriod: "AM",
    endHour: "10",
    endMinute: "00",
    endPeriod: "AM",
    duration: 60
  });

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      router.push("/auth/login");
      return;
    }
    fetchSchedule();
  }, [router]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/weekly-schedule`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSchedule(data.schedule);
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = async (dayOfWeek: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/weekly-schedule/day/${dayOfWeek}/toggle`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        fetchSchedule();
      }
    } catch (err) {
      console.error("Error toggling day:", err);
    }
  };

  const addTimeSlot = async () => {
    if (!selectedDay) return;
    
    // Convert 12-hour format to 24-hour format for backend
    const startTime = convertTo24Hour(newSlot.startHour, newSlot.startMinute, newSlot.startPeriod);
    const endTime = convertTo24Hour(newSlot.endHour, newSlot.endMinute, newSlot.endPeriod);
    
    try {
      if (copyToAllDays) {
        // Use batch endpoint to add to all days atomically
        console.log("Adding slot to all days:", { startTime, endTime, duration: newSlot.duration });
        
        const response = await fetch(`${BACKEND_URL}/api/weekly-schedule/slots/batch`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            days: DAYS.map(d => d.key),
            startTime,
            endTime,
            duration: newSlot.duration
          })
        });
        
        if (!response.ok) {
          const data = await response.json();
          alert(data.message || "Error adding time slots");
          return;
        }
        
        const data = await response.json();
        alert(data.message || "Successfully added slots to all days");
      } else {
        // Add to selected day only
        const response = await fetch(`${BACKEND_URL}/api/weekly-schedule/day/${selectedDay}/slot`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            startTime,
            endTime,
            duration: newSlot.duration
          })
        });
        
        if (!response.ok) {
          const data = await response.json();
          alert(data.message || "Error adding time slot");
          return;
        }
      }
      
      setShowAddSlotModal(false);
      setNewSlot({
        startHour: "9",
        startMinute: "00",
        startPeriod: "AM",
        endHour: "10",
        endMinute: "00",
        endPeriod: "AM",
        duration: 60
      });
      setCopyToAllDays(true);
      fetchSchedule();
    } catch (err) {
      console.error("Error adding time slot:", err);
      alert("Network error: " + err.message);
    }
  };

  const openEditSlot = (dayOfWeek: string, slot: TimeSlot) => {
    // Parse 24-hour time to 12-hour format
    const [startHours, startMinutes] = slot.startTime.split(':');
    const [endHours, endMinutes] = slot.endTime.split(':');
    
    const startHour24 = parseInt(startHours, 10);
    const endHour24 = parseInt(endHours, 10);
    
    const startHour12 = startHour24 % 12 || 12;
    const endHour12 = endHour24 % 12 || 12;
    
    const startPeriod = startHour24 >= 12 ? "PM" : "AM";
    const endPeriod = endHour24 >= 12 ? "PM" : "AM";
    
    setEditingSlot({ dayOfWeek, slot });
    setNewSlot({
      startHour: startHour12.toString(),
      startMinute: startMinutes,
      startPeriod,
      endHour: endHour12.toString(),
      endMinute: endMinutes,
      endPeriod,
      duration: slot.duration
    });
    setShowEditSlotModal(true);
  };

  const updateTimeSlot = async () => {
    if (!editingSlot) return;
    
    // Convert 12-hour format to 24-hour format for backend
    const startTime = convertTo24Hour(newSlot.startHour, newSlot.startMinute, newSlot.startPeriod);
    const endTime = convertTo24Hour(newSlot.endHour, newSlot.endMinute, newSlot.endPeriod);
    
    try {
      // Remove old slot
      await fetch(`${BACKEND_URL}/api/weekly-schedule/day/${editingSlot.dayOfWeek}/slot/${editingSlot.slot._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      
      // Add updated slot
      const response = await fetch(`${BACKEND_URL}/api/weekly-schedule/day/${editingSlot.dayOfWeek}/slot`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          startTime,
          endTime,
          duration: newSlot.duration
        })
      });
      
      if (response.ok) {
        setShowEditSlotModal(false);
        setEditingSlot(null);
        setNewSlot({
          startHour: "9",
          startMinute: "00",
          startPeriod: "AM",
          endHour: "10",
          endMinute: "00",
          endPeriod: "AM",
          duration: 60
        });
        fetchSchedule();
      } else {
        const data = await response.json();
        alert(data.message || "Error updating time slot");
      }
    } catch (err) {
      console.error("Error updating time slot:", err);
      alert("Network error");
    }
  };

  const removeTimeSlot = async (dayOfWeek: string, slotId: string) => {
    if (!window.confirm("Remove this time slot?")) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/weekly-schedule/day/${dayOfWeek}/slot/${slotId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        fetchSchedule();
      }
    } catch (err) {
      console.error("Error removing time slot:", err);
    }
  };

  const toggleTimeSlot = async (dayOfWeek: string, slotId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/weekly-schedule/day/${dayOfWeek}/slot/${slotId}/toggle`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        fetchSchedule();
      }
    } catch (err) {
      console.error("Error toggling time slot:", err);
    }
  };

  const getDaySchedule = (dayKey: string): DaySchedule | undefined => {
    return schedule?.schedule.find(d => d.dayOfWeek === dayKey);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#c2a878] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-10 bg-[#c2a878] rounded-full" />
            <h1 className="text-4xl font-black uppercase italic font-serif tracking-tighter">
              Weekly Schedule
            </h1>
          </div>
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">
            Set Your Recurring Availability • Automatic Slot Generation
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => router.push("/admin-dashboard")}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-wider hover:text-white transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="space-y-4">
          {DAYS.map((day) => {
            const daySchedule = getDaySchedule(day.key);
            const isEnabled = daySchedule?.isEnabled ?? false;
            const timeSlots = daySchedule?.timeSlots ?? [];

            return (
              <div
                key={day.key}
                className={`rounded-2xl border transition-all ${
                  isEnabled
                    ? "bg-[#c2a878]/[0.02] border-[#c2a878]/10"
                    : "bg-white/[0.01] border-white/5 opacity-50"
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{day.emoji}</span>
                    <div>
                      <h3 className="text-lg font-black text-white">{day.label}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                        {timeSlots.filter(s => s.isActive).length} active slots
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedDay(day.key);
                        setShowAddSlotModal(true);
                      }}
                      disabled={!isEnabled}
                      className="flex items-center gap-2 px-4 py-2 bg-[#c2a878]/10 border border-[#c2a878]/20 text-[#c2a878] rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-[#c2a878]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus size={14} /> Add Slot
                    </button>
                    <button
                      onClick={() => toggleDay(day.key)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        isEnabled ? "bg-[#c2a878]" : "bg-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          isEnabled ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Time Slots */}
                {isEnabled && timeSlots.length > 0 && (
                  <div className="p-5 space-y-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot._id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          slot.isActive
                            ? "bg-white/[0.02] border-white/10"
                            : "bg-white/[0.01] border-white/5 opacity-40"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Clock size={14} className="text-[#c2a878]" />
                          <span className="text-white font-bold text-sm">
                            {formatTime12Hour(slot.startTime)} - {formatTime12Hour(slot.endTime)}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({slot.duration}min)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditSlot(day.key, slot)}
                            className="p-2 rounded-lg transition-colors text-[#c2a878] hover:bg-[#c2a878]/10"
                            title="Edit slot"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => toggleTimeSlot(day.key, slot._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              slot.isActive
                                ? "text-emerald-500 hover:bg-emerald-500/10"
                                : "text-gray-500 hover:bg-gray-500/10"
                            }`}
                            title={slot.isActive ? "Disable slot" : "Enable slot"}
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => removeTimeSlot(day.key, slot._id)}
                            className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Remove slot"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {isEnabled && timeSlots.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 text-sm">
                      No time slots configured. Click "Add Slot" to get started.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Time Slot Modal */}
        {showAddSlotModal && selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">
                  Add Time Slot - {DAYS.find(d => d.key === selectedDay)?.label}
                </h2>
                <button
                  onClick={() => setShowAddSlotModal(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Start Time */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                    Start Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={newSlot.startHour}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startHour: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      value={newSlot.startMinute}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startMinute: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      value={newSlot.startPeriod}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startPeriod: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-[#c2a878] mt-1 text-center">
                    {newSlot.startHour}:{newSlot.startMinute} {newSlot.startPeriod}
                  </p>
                </div>

                {/* End Time */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                    End Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={newSlot.endHour}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endHour: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      value={newSlot.endMinute}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endMinute: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      value={newSlot.endPeriod}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endPeriod: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-[#c2a878] mt-1 text-center">
                    {newSlot.endHour}:{newSlot.endMinute} {newSlot.endPeriod}
                  </p>
                </div>
                
                {/* Duration */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newSlot.duration}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>

                {/* Copy to all days checkbox */}
                <div className="flex items-center gap-3 p-4 bg-[#c2a878]/10 border border-[#c2a878]/20 rounded-xl">
                  <input
                    type="checkbox"
                    id="copyToAll"
                    checked={copyToAllDays}
                    onChange={(e) => setCopyToAllDays(e.target.checked)}
                    className="w-5 h-5 rounded border-[#c2a878]/40 bg-[#141414] text-[#c2a878] focus:ring-[#c2a878]/40 cursor-pointer"
                  />
                  <label htmlFor="copyToAll" className="text-sm text-[#c2a878] font-semibold cursor-pointer flex-1">
                    Add this slot to all days (Monday-Sunday)
                  </label>
                </div>
              </div>
              
              <button
                onClick={addTimeSlot}
                className="w-full py-3 bg-[#c2a878] text-black font-black text-sm rounded-xl hover:bg-yellow-100 transition-all"
              >
                {copyToAllDays ? "Add to All Days" : `Add to ${DAYS.find(d => d.key === selectedDay)?.label}`}
              </button>
            </div>
          </div>
        )}

        {/* Edit Time Slot Modal */}
        {showEditSlotModal && editingSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white">
                  Edit Time Slot - {DAYS.find(d => d.key === editingSlot.dayOfWeek)?.label}
                </h2>
                <button
                  onClick={() => {
                    setShowEditSlotModal(false);
                    setEditingSlot(null);
                  }}
                  className="text-gray-500 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Start Time */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                    Start Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={newSlot.startHour}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startHour: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      value={newSlot.startMinute}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startMinute: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      value={newSlot.startPeriod}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startPeriod: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-[#c2a878] mt-1 text-center">
                    {newSlot.startHour}:{newSlot.startMinute} {newSlot.startPeriod}
                  </p>
                </div>

                {/* End Time */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                    End Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={newSlot.endHour}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endHour: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      value={newSlot.endMinute}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endMinute: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      value={newSlot.endPeriod}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endPeriod: e.target.value }))}
                      className="px-3 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-[#c2a878] mt-1 text-center">
                    {newSlot.endHour}:{newSlot.endMinute} {newSlot.endPeriod}
                  </p>
                </div>
                
                {/* Duration */}
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newSlot.duration}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-[#141414] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#c2a878]/40"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={updateTimeSlot}
                className="w-full py-3 bg-[#c2a878] text-black font-black text-sm rounded-xl hover:bg-yellow-100 transition-all"
              >
                Update Time Slot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
