"use client";
import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Download, CheckCircle } from "lucide-react";

interface SeminarQRModalProps {
  seminar: {
    seminarId: string;
    title?: string;
    collegeName?: string;
    collegeId?: { name?: string } | null;
    date: string | Date;
    venue?: string;
  };
  onClose: () => void;
}

export default function SeminarQRModal({ seminar, onClose }: SeminarQRModalProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  // Fallback to localhost if NEXT_PUBLIC_FRONTEND_URL isn't set properly
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL && process.env.NEXT_PUBLIC_FRONTEND_URL !== 'undefined' 
    ? process.env.NEXT_PUBLIC_FRONTEND_URL 
    : window.location.origin;

  const registrationLink = `${frontendUrl}/auth/RegisterStudent?seminarId=${encodeURIComponent(seminar.seminarId)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(registrationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40; // Add padding
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${seminar.seminarId}-QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={24} />
        </button>
        
        <div className="bg-[#0d0f12] text-white p-6 pb-8 text-center rounded-b-[2rem]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878] mb-1">Seminar QR</h2>
          <h1 className="text-2xl font-bold uppercase mb-2">{seminar.title || "Go Abroad"}</h1>
          <p className="text-xs text-gray-400">ID: {seminar.seminarId}</p>
        </div>
        
        <div className="p-8 -mt-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-auto w-fit mb-6 border border-gray-100 flex flex-col items-center">
            <QRCodeSVG
              ref={qrRef}
              value={registrationLink}
              size={200}
              level={"M"}
              includeMargin={false}
            />
          </div>
          
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-medium">College</span>
              <span className="font-bold text-gray-900">{seminar.collegeName || (seminar.collegeId && seminar.collegeId.name) || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500 font-medium">Date</span>
              <span className="font-bold text-gray-900">{new Date(seminar.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-gray-500 font-medium">Venue</span>
              <span className="font-bold text-gray-900">{seminar.venue || "-"}</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button 
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button 
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#c2a878] text-black hover:bg-[#b09665] rounded-xl text-xs font-bold uppercase transition-all"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
