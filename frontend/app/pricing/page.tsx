"use client";

import { useState } from "react";
import { Rocket, Target, Star, Crown } from "lucide-react";

import CheckoutModal from "@/app/User/cart/checkoutmodal";
import PricingCard from "./components/PricingCard";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1D1413] py-24 px-6">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6B4A1E_0%,transparent_45%),radial-gradient(circle_at_bottom_right,#0A2C83_0%,transparent_35%)] opacity-60" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Blur Effects */}
      <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#0A2C83]/30 blur-[140px]" />
      <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#C58B14]/30 blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">

          {/* Starter */}
          <PricingCard
            title="Starter"
            subtitle="Know Your Chances"
            price={499}
            color="blue"
            icon={<Rocket size={34} />}
            features={[
              "Profile Evaluation",
              "Admission Probability Report",
              "Country Selection Strategy",
              "Scholarship Eligibility Check",
              "10-Minute Counseling Session",
            ]}
            description="Perfect for students exploring study abroad options."
            onSelect={() =>
              setSelectedPlan({
                title: "Starter",
                price: 499,
              })
            }
          />

          {/* Essential */}
          <PricingCard
            title="Essential"
            subtitle="Build Your Winning Strategy"
            price={4999}
            color="blue"
            badge="MOST POPULAR"
            icon={<Target size={34} />}
            features={[
              "Everything in Starter",
              "Personalized University Shortlist",
              "Scholarship Strategy",
              "Resume Optimization",
              "Application Timeline Planning",
              "Dedicated Counselor (30 Days)",
            ]}
            description="Everything you need to plan your study abroad journey."
            onSelect={() =>
              setSelectedPlan({
                title: "Essential",
                price: 4999,
              })
            }
          />

          {/* Premium */}
          <PricingCard
            title="Premium"
            subtitle="Admission Success Package"
            price={14999}
            color="gold"
            icon={<Star size={34} />}
            features={[
              "Everything in Essential",
              "SOP & LOR Support",
              "Application Assistance",
              "Visa Documentation Guidance",
              "Interview Preparation",
              "Dedicated Counselor (90 Days)",
            ]}
            description="Expert support to strengthen your application and secure admission."
            onSelect={() =>
              setSelectedPlan({
                title: "Premium",
                price: 14999,
              })
            }
          />

          {/* Elite */}
          <PricingCard
            title="Elite Global"
            subtitle="From Dream to Departure"
            price={49999}
            color="blue"
            badge="BEST VALUE"
            icon={<Crown size={34} />}
            features={[
              "Everything in Premium",
              "Unlimited University Applications",
              "Scholarship Application Assistance",
              "Visa Filing Assistance",
              "Accommodation Support",
              "Dedicated Success Manager",
            ]}
            description="Complete end-to-end support from application to your flight."
            onSelect={() =>
              setSelectedPlan({
                title: "Elite Global",
                price: 49999,
              })
            }
          />
        </div>
      </div>

      {/* Heading */}
        <div className="mt-20 mb-20 text-center">
          <span className="inline-flex rounded-full border border-[#B3985E]/30 bg-[#B3985E]/10 px-5 py-2 text-sm font-semibold tracking-widest uppercase text-[#D6B06C]">
            Transparent Pricing
          </span>

          <h1 className="mt-8 text-6xl md:text-7xl font-black text-white">
            Choose Your
            <span className="block bg-gradient-to-r from-[#E4C07A] via-[#F4D89E] to-[#B3985E] bg-clip-text text-transparent">
              Global Journey
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-300">
            Whether you're just exploring or ready to fly abroad,
            choose the guidance package that fits your dream.
          </p>
        </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          items={[
            {
              title: selectedPlan.title,
              name: selectedPlan.title,
              price: selectedPlan.price,
              currency: "INR",
            },
          ]}
          subtotal={selectedPlan.price}
          discount={0}
          total={selectedPlan.price}
          currency="INR"
          onSuccess={() => {
            setSelectedPlan(null);
          }}
        />
      )}
    </main>
  );
}