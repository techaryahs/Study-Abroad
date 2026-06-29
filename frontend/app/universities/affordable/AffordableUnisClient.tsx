"use client";

import React from "react";
import UniversityCard from "../by-country/UniversityCard";
import PremiumLock from "@/components/shared/PremiumLock";
import { usePremiumStatus } from "@/app/lib/usePremiumStatus";

export default function AffordableUnisClient({ unis }: { unis: any[] }) {
    const { isPremium } = usePremiumStatus();

    return (
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {unis.slice(0, 3).map((uni, idx) => (
                <UniversityCard key={uni.slug || idx} uni={uni} />
            ))}

            {unis.length > 3 && (
                <PremiumLock 
                    isPremium={isPremium} 
                    title={`Unlock ${unis.length} Affordable Top Universities`} 
                    description="Get premium access to explore all high-ranking budget-friendly universities globally, including detailed tuition analysis."
                >
                    <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-6 sm:mt-8">
                        {unis.slice(3, 8).map((uni, idx) => (
                            <UniversityCard key={uni.slug || idx} uni={uni} />
                        ))}
                    </div>
                </PremiumLock>
            )}
        </div>
    );
}
