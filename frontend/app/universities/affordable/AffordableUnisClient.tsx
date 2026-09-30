"use client";

import React from "react";
import UniversityCard from "../by-country/UniversityCard";
import { EntitlementGuard } from "@/components/shared/EntitlementGuard";
import { useMembership } from "@/app/lib/membership/MembershipContext";

export default function AffordableUnisClient({ unis }: { unis: any[] }) {
  const { canAccess } = useMembership();
  const hasPremium = canAccess("university_search");
        return (
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {unis.slice(0, 3).map((uni, idx) => (
                <UniversityCard key={uni.slug || idx} uni={uni} />
            ))}

            {unis.length > 3 && (
                <EntitlementGuard featureId="university_search" fallbackTitle={`Unlock ${unis.length} Affordable Top Universities`} fallbackDescription="Get premium access to explore all high-ranking budget-friendly universities globally, including detailed tuition analysis.">
                    <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-6 sm:mt-8">
                        {unis.slice(3, 8).map((uni, idx) => (
                            <UniversityCard key={uni.slug || idx} uni={uni} />
                        ))}
                    </div>
                </EntitlementGuard>
            )}
        </div>
    );
}
