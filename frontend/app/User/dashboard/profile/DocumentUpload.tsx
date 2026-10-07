"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { getToken } from "@/app/lib/token";

interface DocumentUploadProps {
  documentUrl?: string;
  documentName?: string;
  onDocumentChange: (doc: { documentUrl: string; documentName: string } | null) => void;
  label?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentUrl,
  documentName,
  onDocumentChange,
  label = "Academic Documents (Optional)"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL !== "undefined"
      ? process.env.NEXT_PUBLIC_BACKEND_URL
      : "http://localhost:5011";

  const handleFile = async (file: File) => {
    setErrorMsg("");

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit.");
      return;
    }

    // Validate extension
    const allowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMsg("Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG.");
      return;
    }

    setIsUploading(true);

    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("document", file);

      const res = await fetch(`${BACKEND_URL}/api/user/profile/upload-document`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload document");
      }

      onDocumentChange({
        documentUrl: data.fileUrl,
        documentName: data.fileName || file.name
      });
    } catch (err: any) {
      console.error("Document upload error:", err);
      setErrorMsg(err.message || "Error uploading document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center justify-between">
        <label className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-[#6B5E51]/80">
          {label}
        </label>
        <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider bg-[#C5A059]/10 px-2 py-0.5 rounded-full">
          Optional
        </span>
      </div>

      {documentUrl ? (
        <div className="flex items-center justify-between p-3.5 bg-[#FDFBF7] border border-[#C5A059]/30 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] shrink-0">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#3C2A21] truncate">
                {documentName || "Uploaded Document"}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                <CheckCircle2 size={12} /> Ready
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDocumentChange(null)}
            className="p-1.5 text-[#6B5E51]/60 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
            title="Remove document"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? "border-[#C5A059] bg-[#C5A059]/10"
              : "border-[#C5A059]/30 bg-[#FDFBF7] hover:border-[#C5A059] hover:bg-[#FDFBF7]/80"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-[#C5A059] animate-spin" />
              <p className="text-xs font-bold text-[#3C2A21] uppercase tracking-wider">
                Uploading document...
              </p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                <UploadCloud size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#3C2A21] uppercase tracking-wider">
                  Drag & Drop or <span className="text-[#C5A059] underline">Choose File</span>
                </p>
                <p className="text-[10px] font-bold text-[#6B5E51]/60 mt-0.5 uppercase tracking-widest">
                  PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-rose-500 text-[11px] font-bold mt-1.5 bg-rose-50 border border-rose-100 p-2 rounded-xl">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
