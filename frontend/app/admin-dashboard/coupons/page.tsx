"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Copy, CheckCircle2, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/lib/token";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function CouponAdminPage() {
  const router = useRouter();

  // ── Admin Auth Guard ───────────────────────────────────────────────────
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace("/auth/login");
    } else {
      setAuthChecked(true);
    }
  }, []);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    code: "",
    discountType: "flat" as "flat" | "percentage",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "1",
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/coupons`);
      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch {
      setError("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) fetchCoupons();
  }, [authChecked]);

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setForm(f => ({ ...f, code }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.code || !form.discountValue || !form.expiryDate) {
      setError("Code, discount value, and expiry date are required.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/api/coupons/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minOrderAmount: Number(form.minOrderAmount) || 0,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
          expiryDate: form.expiryDate,
          usageLimit: Number(form.usageLimit) || 1,
          isActive: true,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to create coupon.");
        return;
      }

      setForm({
        code: "",
        discountType: "flat",
        discountValue: "",
        minOrderAmount: "0",
        maxDiscount: "",
        expiryDate: "",
        usageLimit: "1",
      });
      fetchCoupons();
    } catch {
      setError("Failed to create coupon.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await fetch(`${API_BASE}/api/coupons/${coupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      fetchCoupons();
    } catch {
      setError("Failed to update coupon.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await fetch(`${API_BASE}/api/coupons/${id}`, { method: "DELETE" });
      fetchCoupons();
    } catch {
      setError("Failed to delete coupon.");
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  const statusBadge = (c: Coupon) => {
    const expired = isExpired(c.expiryDate);
    return (
      <button
        onClick={() => handleToggleActive(c)}
        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap ${
          expired
            ? "bg-gray-100 text-gray-400"
            : c.isActive
            ? "bg-green-50 text-green-600"
            : "bg-red-50 text-red-500"
        }`}
      >
        {expired ? "Expired" : c.isActive ? "Active" : "Inactive"}
      </button>
    );
  };

  // ── Auth Loading State ─────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#302621]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3] p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#302621] flex items-center justify-center flex-shrink-0">
            <Tag size={18} className="text-[#D4A848]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#362B25]">Coupon Codes</h1>
            <p className="text-[10px] sm:text-[11px] text-black/40 font-bold uppercase tracking-widest">Generate & manage discount coupons</p>
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-[#362B25] mb-4">Generate New Coupon</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold rounded-lg px-4 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Code */}
            <div className="sm:col-span-2 md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-1.5">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. WELCOME100"
                  className="flex-1 min-w-0 border border-black/10 rounded-xl px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#362B25] placeholder-black/30 outline-none focus:border-[#302621]/40"
                />
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-3 sm:px-4 py-2.5 bg-black/5 hover:bg-black/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#362B25] transition-all whitespace-nowrap"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-1.5">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm(f => ({ ...f, discountType: e.target.value as "flat" | "percentage" }))}
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#362B25] outline-none focus:border-[#302621]/40 bg-white"
              >
                <option value="flat">Flat (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-1.5">
                Discount Value {form.discountType === "percentage" ? "(%)" : "(₹)"}
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) => setForm(f => ({ ...f, discountValue: e.target.value }))}
                placeholder={form.discountType === "percentage" ? "20" : "100"}
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#362B25] placeholder-black/30 outline-none focus:border-[#302621]/40"
              />
            </div>

            {/* Max Discount (only for percentage) */}
            {form.discountType === "percentage" && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-1.5">Max Discount (₹)</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => setForm(f => ({ ...f, maxDiscount: e.target.value }))}
                  placeholder="Optional cap"
                  className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#362B25] placeholder-black/30 outline-none focus:border-[#302621]/40"
                />
              </div>
            )}

            {/* Min Order Amount */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-1.5">Min Order Amount (₹)</label>
              <input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                placeholder="0"
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#362B25] placeholder-black/30 outline-none focus:border-[#302621]/40"
              />
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-1.5">Usage Limit</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                placeholder="1"
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#362B25] placeholder-black/30 outline-none focus:border-[#302621]/40"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-1.5">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#362B25] outline-none focus:border-[#302621]/40"
              />
            </div>

            {/* Submit */}
            <div className="sm:col-span-2 md:col-span-3 flex justify-stretch sm:justify-end">
              <button
                type="submit"
                disabled={creating}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#302621] text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#251d1a] transition-all disabled:opacity-50"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Create Coupon
              </button>
            </div>
          </form>
        </div>

        {/* Coupon List */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-black/5">
            <h2 className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-[#362B25]">All Coupons ({coupons.length})</h2>
          </div>

          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader2 size={20} className="animate-spin text-[#302621]" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-10 text-center text-[12px] font-bold text-black/30 uppercase tracking-widest">
              No coupons yet
            </div>
          ) : (
            <>
              {/* Mobile / Tablet: Card view */}
              <div className="md:hidden divide-y divide-black/5">
                {coupons.map((c) => (
                  <div key={c._id} className="p-4 space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="flex items-center gap-2 font-black text-[13px] text-[#362B25] tracking-wider break-all"
                      >
                        {c.code}
                        {copiedCode === c.code ? (
                          <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <Copy size={13} className="text-black/20 flex-shrink-0" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-black/20 hover:text-red-500 transition-all flex-shrink-0 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-black/40 uppercase tracking-widest text-[9px]">Discount</span>
                      <span className="text-[#362B25]">
                        {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                        {c.maxDiscount ? <span className="text-black/30 text-[10px]"> (max ₹{c.maxDiscount})</span> : ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-black/40 uppercase tracking-widest text-[9px]">Min Order</span>
                      <span className="text-black/60">₹{c.minOrderAmount}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-black/40 uppercase tracking-widest text-[9px]">Usage</span>
                      <span className="text-black/60">{c.usedCount} / {c.usageLimit}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-black/40 uppercase tracking-widest text-[9px]">Expiry</span>
                      <span className="text-black/60">
                        {new Date(c.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-black/40 uppercase tracking-widest text-[9px] font-bold">Status</span>
                      {statusBadge(c)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-black/30 border-b border-black/5">
                      <th className="px-6 py-3">Code</th>
                      <th className="px-6 py-3">Discount</th>
                      <th className="px-6 py-3">Min Order</th>
                      <th className="px-6 py-3">Usage</th>
                      <th className="px-6 py-3">Expiry</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c._id} className="border-b border-black/5 hover:bg-black/[0.015] transition-all">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleCopy(c.code)}
                            className="flex items-center gap-2 font-black text-[12px] text-[#362B25] tracking-wider"
                          >
                            {c.code}
                            {copiedCode === c.code ? (
                              <CheckCircle2 size={13} className="text-green-500" />
                            ) : (
                              <Copy size={13} className="text-black/20" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-[12px] font-bold text-[#362B25]">
                          {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                          {c.maxDiscount ? <span className="text-black/30 text-[10px]"> (max ₹{c.maxDiscount})</span> : ""}
                        </td>
                        <td className="px-6 py-4 text-[12px] font-bold text-black/50">₹{c.minOrderAmount}</td>
                        <td className="px-6 py-4 text-[12px] font-bold text-black/50">{c.usedCount} / {c.usageLimit}</td>
                        <td className="px-6 py-4 text-[12px] font-bold text-black/50">
                          {new Date(c.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4">{statusBadge(c)}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="text-black/20 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}