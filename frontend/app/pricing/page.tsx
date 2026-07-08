"use client";

import { useState } from "react";
import { Check, Crown, Rocket, Star, Target, X } from "lucide-react";

import CheckoutModal from "@/app/User/cart/checkoutmodal";
import PricingCard from "./components/PricingCard";

type SelectedPlan = {
  title: string;
  price: number;
};

type PackageKey = "essential" | "premium" | "elite";

type PackagePlan = {
  title: string;
  price: number;
};

const packagePlans: Record<PackageKey, PackagePlan> = {
  essential: {
    title: "Essential Plan",
    price: 4999,
  },
  premium: {
    title: "Premium Plan",
    price: 14999,
  },
  elite: {
    title: "Elite Global Plan",
    price: 49999,
  },
};

const services = [
  "Counselling Session",
  "Research Paper Drafting & Publishing Help",
  "Visa Application Help",
  "Apply For An EB-1 Visa",
  "Complete Application Help",
  "Profile Evaluation & University Shortlisting",
  "Statement of Purpose/Essay Writing",
  "Apply For An O-1 Visa",
  "US Visa Mock Interview",
  "Letter of Recommendation Drafting",
  "Personal History Statement",
  "Resume Drafting",
  "GRE Prep-Plan Building",
  "University Finalization Help",
  "Plagiarism Check Report",
  "Scholarship Application Help",
  "TOEFL Prep-Plan Building/Coaching Session",
  "Canada Visa SOP/Letter of Explanation",
  "Profile Building Guidance",
  "Cover Letter Drafting",
  "LinkedIn Profile Boosting",
  "Express Entry/PNP Help",
  "Complete Application Review",
  "Apply for Global Talent Visa",
  "Portfolio Building & Management",
  "Apply for Australia National Innovation Visa",
  "Apply for Singapore ONE Pass",
  "Apply for an EB-2 NIW Visa",
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageKey | null>(null);

  const packageLimit =
    selectedPackage === "essential"
      ? Math.ceil(services.length / 3)
      : selectedPackage === "premium"
        ? Math.ceil(services.length / 2)
        : services.length;

  const visibleServices = selectedPackage ? services.slice(0, packageLimit) : [];
  const activePlan = selectedPackage ? packagePlans[selectedPackage] : null;

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
            onSelect={() => setSelectedPackage("essential")}
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
            onSelect={() => setSelectedPackage("premium")}
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
            onSelect={() => setSelectedPackage("elite")}
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
            Whether you&apos;re just exploring or ready to fly abroad,
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

      {selectedPackage && activePlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-gradient-to-r from-[#2B7CFF] to-[#145CFF] px-7 py-6 text-white">
              <div>
                <h2 className="font-serif text-3xl font-black leading-tight">
                  {activePlan.title}
                </h2>
                <p className="mt-3 text-xl font-medium">
                  Unlock{" "}
                  <span className="font-black">
                    {selectedPackage === "essential"
                      ? "1/3"
                      : selectedPackage === "premium"
                        ? "1/2"
                        : "All"}
                  </span>
                  {selectedPackage === "elite" ? " Services" : " of All Services"}
                </p>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="rounded-full p-2 text-white transition hover:bg-white/15"
                aria-label="Close package details"
              >
                <X size={28} />
              </button>
            </div>

            <div className="max-h-[34vh] overflow-y-auto bg-[#F2FFF6] px-7 py-5">
              <div className="mb-4 flex items-center gap-2 text-base font-black text-[#16A34A]">
                <Check size={20} />
                Included Services ({visibleServices.length})
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {visibleServices.map((service) => (
                  <div
                    key={service}
                    className="flex min-h-[72px] items-center gap-4 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-5 py-4 text-[#374151]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#16A34A] shadow-sm">
                      <Check size={18} />
                    </span>
                    <span className="text-sm font-bold leading-5">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white px-7 py-6">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#4B5563]">
                    Plan Price
                  </p>
                  <p className="mt-1 text-4xl font-black text-[#111827]">
                    ₹{activePlan.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#4B5563]">
                    Services Unlocked
                  </p>
                  <p className="mt-1 text-4xl font-black text-[#16A34A]">
                    {visibleServices.length}/{services.length}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPackage(null);
                  setSelectedPlan(activePlan);
                }}
                className="w-full rounded-xl bg-[#05B946] px-6 py-5 text-base font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#049B3B] active:scale-[0.99]"
              >
                Proceed To Payment →
              </button>
              <button
                onClick={() => setSelectedPackage(null)}
                className="mt-4 w-full rounded-xl bg-[#E5E7EB] px-6 py-4 text-base font-black text-[#374151] transition hover:bg-[#D1D5DB]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
