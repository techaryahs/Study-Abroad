"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Copy, CheckCircle2, Tag, RefreshCw, AlertCircle, X } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

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
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/coupons`);
      const data = await res.json();
      if (data.success) setCoupons(data.coupons || []);
    } catch {
      setError("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setForm((f) => ({ ...f, code }));
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
      setError("Failed to update coupon status.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await fetch(`${API_BASE}/api/coupons/${deletingId}`, { method: "DELETE" });
      setDeletingId(null);
      fetchCoupons();
    } catch {
      setError("Failed to delete coupon.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Coupon Management</h2>
          <p className="text-xs text-white/50 mt-1">
            Create and oversee promotional discount codes, validity windows, and usage caps.
          </p>
        </div>
        <button
          onClick={fetchCoupons}
          disabled={loading}
          className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#c2a878]" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Create Coupon Card */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#c2a878] mb-4">
          Generate New Coupon
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Code */}
          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
              Coupon Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. GLOBAL100"
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white placeholder-white/20 focus:outline-none focus:border-[#c2a878]/50"
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#c2a878] transition-all shrink-0"
              >
                Random
              </button>
            </div>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
              Discount Type
            </label>
            <select
              value={form.discountType}
              onChange={(e) =>
                setForm((f) => ({ ...f, discountType: e.target.value as "flat" | "percentage" }))
              }
              aria-label="Select discount type"
              className="w-full bg-[#0d0f12] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#c2a878]/50"
            >
              <option value="flat">Flat Amount (₹)</option>
              <option value="percentage">Percentage (%)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
              Discount Value {form.discountType === "percentage" ? "(%)" : "(₹)"}
            </label>
            <input
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
              placeholder={form.discountType === "percentage" ? "20" : "500"}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white placeholder-white/20 focus:outline-none focus:border-[#c2a878]/50"
            />
          </div>

          {/* Max Discount */}
          {form.discountType === "percentage" && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
                Max Discount Cap (₹)
              </label>
              <input
                type="number"
                value={form.maxDiscount}
                onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
                placeholder="Optional cap"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white placeholder-white/20 focus:outline-none focus:border-[#c2a878]/50"
              />
            </div>
          )}

          {/* Min Order */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
              Min Order Value (₹)
            </label>
            <input
              type="number"
              value={form.minOrderAmount}
              onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
              placeholder="0"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white placeholder-white/20 focus:outline-none focus:border-[#c2a878]/50"
            />
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
              Usage Limit
            </label>
            <input
              type="number"
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              placeholder="1"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white placeholder-white/20 focus:outline-none focus:border-[#c2a878]/50"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-white/40 mb-1.5">
              Expiry Date
            </label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#c2a878]/50"
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-[#c2a878] hover:bg-[#d4ba8a] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {creating ? (
                <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Plus size={15} />
              )}
              <span>Create Coupon</span>
            </button>
          </div>
        </form>
      </div>

      {/* Coupons List Card */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            Active & Expired Coupons ({coupons.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : coupons.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.16em] text-white/40 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Coupon Code</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Min Order</th>
                    <th className="px-6 py-4">Redemptions</th>
                    <th className="px-6 py-4">Valid Until</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {coupons.map((c) => {
                    const expired = isExpired(c.expiryDate);

                    return (
                      <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleCopy(c.code)}
                            className="flex items-center gap-2 font-mono font-bold text-xs text-[#c2a878] bg-[#c2a878]/10 hover:bg-[#c2a878]/20 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <span>{c.code}</span>
                            {copiedCode === c.code ? (
                              <CheckCircle2 size={13} className="text-emerald-400" />
                            ) : (
                              <Copy size={13} className="text-white/40" />
                            )}
                          </button>
                        </td>

                        <td className="px-6 py-4 font-bold text-white">
                          {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                          {c.maxDiscount ? (
                            <span className="text-white/40 text-[10px] block font-normal">
                              Max cap: ₹{c.maxDiscount}
                            </span>
                          ) : null}
                        </td>

                        <td className="px-6 py-4 text-white/70">₹{c.minOrderAmount}</td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">
                            {c.usedCount} / {c.usageLimit}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-white/70">
                          {new Date(c.expiryDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(c)}
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                              expired
                                ? "bg-white/5 text-white/40 border border-white/10"
                                : c.isActive
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
                            }`}
                          >
                            {expired ? "Expired" : c.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setDeletingId(c._id)}
                            className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete coupon"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-white/5">
              {coupons.map((c) => {
                const expired = isExpired(c.expiryDate);

                return (
                  <div key={c._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="flex items-center gap-2 font-mono font-bold text-xs text-[#c2a878]"
                      >
                        <span>{c.code}</span>
                        {copiedCode === c.code ? (
                          <CheckCircle2 size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} className="text-white/40" />
                        )}
                      </button>
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          expired
                            ? "bg-white/5 text-white/40"
                            : c.isActive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {expired ? "Expired" : c.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>
                        Discount:{" "}
                        {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                      </span>
                      <span>
                        Redemptions: {c.usedCount}/{c.usageLimit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/5">
                      <span>
                        Expires:{" "}
                        {new Date(c.expiryDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => setDeletingId(c._id)}
                        className="text-white/40 hover:text-rose-400 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-16 text-center space-y-2 text-white/40">
            <Tag size={32} className="mx-auto text-white/20 mb-2" />
            <p className="text-xs font-bold text-white/70">No Coupons Generated</p>
            <p className="text-[11px] text-white/40">Use the form above to issue your first coupon code.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Coupon Code?"
        description="Are you sure you want to permanently delete this coupon code? Any user attempting to redeem it in checkout will no longer receive the discount."
        confirmLabel="Delete Coupon"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}