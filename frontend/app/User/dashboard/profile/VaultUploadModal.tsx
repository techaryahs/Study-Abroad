'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, FileText, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';

interface VaultUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: any;
}

const CATEGORIES = [
  'Academic Transcripts & Marksheets',
  'Resume & Curriculum Vitae',
  'Standardized Test Scorecards',
  'Identity & Passport Documents',
  'Letters of Recommendation (LOR)',
  'Statement of Purpose (SOP)',
  'Financial Proof & Bank Statements',
  'Certificates & Honors',
  'Work & Internship Documents',
  'Other Supporting Document',
];

export const VaultUploadModal = ({ isOpen, onClose, onSubmit, initialData }: VaultUploadModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic Transcripts & Marksheets',
    description: '',
    documentUrl: '',
    documentName: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [formErrorMsg, setFormErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Academic Transcripts & Marksheets',
        description: initialData.description || '',
        documentUrl: initialData.documentUrl || '',
        documentName: initialData.documentName || '',
      });
    } else {
      setFormData({
        title: '',
        category: 'Academic Transcripts & Marksheets',
        description: '',
        documentUrl: '',
        documentName: '',
      });
    }
    setErrors({});
    setFormErrorMsg('');
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.title.trim()) newErrors.title = true;
    if (!formData.documentUrl) newErrors.documentUrl = true;

    setErrors(newErrors);
    if (newErrors.title && newErrors.documentUrl) {
      setFormErrorMsg('Please provide a document title and upload a file.');
    } else if (newErrors.title) {
      setFormErrorMsg('Please enter a document title.');
    } else if (newErrors.documentUrl) {
      setFormErrorMsg('Please upload a supporting document file.');
    } else {
      setFormErrorMsg('');
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        addedAt: new Date().toISOString(),
      });
      onClose();
    } catch (err: any) {
      console.error('Failed to submit vault document:', err);
      setFormErrorMsg(err.message || 'Failed to save document to vault.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-xl bg-white border border-[#E8E0D8] rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#FDFBF7] border-b border-[#F1EDEA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] shadow-xs">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="fd text-lg font-bold text-[#3C2A21] tracking-tight">
                  {initialData ? 'Update Vault Document' : 'Upload to Document Vault'}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B5E51] opacity-70">
                  Secure application document repository
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] hover:text-[#3C2A21] hover:border-[#C5A059]/30 transition-all shadow-xs"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-5">
            {formErrorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{formErrorMsg}</span>
              </motion.div>
            )}

            {/* Document Title */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#6B5E51] mb-2">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Passport Bio Page, Degree Certificate, LOR - Prof. Kumar"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: false });
                }}
                className={`w-full px-4 py-3 bg-[#FDFBF7] border ${
                  errors.title ? 'border-red-400 focus:border-red-500' : 'border-[#F1EDEA] focus:border-[#C5A059]'
                } rounded-xl text-xs font-semibold text-[#3C2A21] placeholder-[#6B5E51]/40 outline-none transition-all`}
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#6B5E51] mb-2">
                Document Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] focus:border-[#C5A059] rounded-xl text-xs font-semibold text-[#3C2A21] outline-none transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description (Optional) */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#6B5E51] mb-2">
                Notes / Issuing Authority (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Issued by Ministry of External Affairs / Official Seal"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#F1EDEA] focus:border-[#C5A059] rounded-xl text-xs font-semibold text-[#3C2A21] placeholder-[#6B5E51]/40 outline-none transition-all"
              />
            </div>

            {/* Document File Upload */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#6B5E51] mb-2">
                Document File (PDF, DOC, DOCX, PNG, JPG) <span className="text-red-500">*</span>
              </label>
              <DocumentUpload
                documentUrl={formData.documentUrl}
                documentName={formData.documentName}
                onDocumentChange={(doc) => {
                  setFormData({
                    ...formData,
                    documentUrl: doc ? doc.documentUrl : '',
                    documentName: doc ? doc.documentName : '',
                  });
                  if (errors.documentUrl) setErrors({ ...errors, documentUrl: false });
                }}
                label="Supporting Document File"
              />
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 p-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl text-[11px] text-[#6B5E51] font-semibold">
              <ShieldCheck size={16} className="text-[#C5A059] shrink-0" />
              <span>Documents in the vault are encrypted and shared only with verified university evaluators.</span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F1EDEA]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#F1EDEA] text-xs font-bold uppercase tracking-wider text-[#6B5E51] hover:text-[#3C2A21] hover:bg-[#FDFBF7] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3C2A21] transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <span>{isSubmitting ? 'Securing Document...' : initialData ? 'Update Document' : 'Save to Vault'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
