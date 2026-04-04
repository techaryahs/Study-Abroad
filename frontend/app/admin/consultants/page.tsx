"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/app/lib/token";
import { Video, VideoOff, User } from "lucide-react";

interface Consultant {
  _id: string;
  name: string;
  email: string;
  role: string;
  expertise: string;
  videoCallEnabled: boolean;
  isPremium: boolean;
}

export default function AdminConsultantsPage() {
  const router = useRouter();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      router.push("/auth/login");
      return;
    }
    fetchConsultants();
  }, [router]);

  const fetchConsultants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/consultants`, {
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConsultants(data.consultants);
      }
    } catch (err) {
      console.error("Error fetching consultants:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoAccess = async (consultantId: string) => {
    setToggling(consultantId);
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/consultants/${consultantId}/toggle-video`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConsultants(prev => 
          prev.map(c => 
            c._id === consultantId 
              ? { ...c, videoCallEnabled: data.videoCallEnabled }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Error toggling video access:", err);
    } finally {
      setToggling(null);
    }
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
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-10 bg-[#c2a878] rounded-full" />
            <h1 className="text-4xl font-black uppercase italic font-serif tracking-tighter">
              Consultant Management
            </h1>
          </div>
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">
            Video Call Access Control Panel
          </p>
        </div>

        {/* Consultants List */}
        <div className="space-y-4">
          {consultants.map((consultant) => (
            <div 
              key={consultant._id}
              className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/[0.05] rounded-2xl hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#c2a878]/10 border border-[#c2a878]/20 flex items-center justify-center">
                  <User size={20} className="text-[#c2a878]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{consultant.name}</h3>
                  <p className="text-gray-500 text-xs">{consultant.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                      {consultant.expertise}
                    </span>
                    {consultant.isPremium && (
                      <span className="text-[8px] px-2 py-0.5 bg-[#c2a878]/10 text-[#c2a878] font-black uppercase rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleVideoAccess(consultant._id)}
                disabled={toggling === consultant._id}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  consultant.videoCallEnabled
                    ? "bg-[#c2a878] text-black hover:bg-yellow-100"
                    : "bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {toggling === consultant._id ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : consultant.videoCallEnabled ? (
                  <>
                    <Video size={14} />
                    <span>Enabled</span>
                  </>
                ) : (
                  <>
                    <VideoOff size={14} />
                    <span>Disabled</span>
                  </>
                )}
              </button>
            </div>
          ))}

          {consultants.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-600 text-sm">No consultants found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
