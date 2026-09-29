"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/app/lib/token";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPremiumStatus = async () => {
    try {
      const user = getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user object in token already has it (some tokens might store it)
      if (user.isPremium || user.profile?.isPremium) {
        setIsPremium(true);
        setLoading(false);
        return;
      }

      // Otherwise fetch from backend
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/user/premium-status`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setIsPremium(data.isPremium);
      }
    } catch (error) {
      console.error("Error fetching premium status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPremiumStatus();
    // Listen for custom event when payment succeeds
    const handleUpgrade = () => {
      setIsPremium(true);
    };
    window.addEventListener("premium-upgraded", handleUpgrade);
    return () => window.removeEventListener("premium-upgraded", handleUpgrade);
  }, []);

  return { isPremium, loading, refetch: fetchPremiumStatus };
}
