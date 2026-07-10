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
    <main
      className="relative min-h-screen overflow-hidden py-24 px-6"
      style={{
        background: "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
      }}
    >
      {/* Blur Effects */}
      <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#2ca59d]/15 blur-[140px]" />
      <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#d2a14a]/20 blur-[120px]" />

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
        <div className="mt-20 mb-20 text-center relative z-10">
          <span className="inline-flex rounded-full border border-[#2ca59d]/25 bg-[#2ca59d]/10 px-5 py-2 text-sm font-semibold tracking-widest uppercase text-[#0f4c5c]">
            Transparent Pricing
          </span>

          <h1 className="mt-8 text-6xl md:text-7xl font-black text-[#D4A54A]">
            Choose Your
            <span className="block text-[#D4A54A]">
              Global Journey
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#4b5b6a]">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10324a]/60 px-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-[#10324a] px-7 py-6 text-white relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(210,161,74,0.15),transparent_60%)]" />
              <div className="relative">
                <h2 className="font-serif text-3xl font-black leading-tight text-[#d2a14a]">
                  {activePlan.title}
                </h2>
                <p className="mt-3 text-xl font-medium">
                  Unlock{" "}
                  <span className="font-black text-[#d2a14a]">
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
                className="relative rounded-full p-2 text-white transition hover:bg-white/15"
                aria-label="Close package details"
              >
                <X size={28} />
              </button>
            </div>

            <div className="max-h-[34vh] overflow-y-auto bg-[#f8f4ea]/60 px-7 py-5">
              <div className="mb-4 flex items-center gap-2 text-base font-black text-[#2ca59d]">
                <Check size={20} />
                Included Services ({visibleServices.length})
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {visibleServices.map((service) => (
                  <div
                    key={service}
                    className="flex min-h-[72px] items-center gap-4 rounded-xl border border-[#2ca59d]/20 bg-white px-5 py-4 text-[#10324a]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8f4ea] text-sm font-black text-[#2ca59d] shadow-sm">
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
                  <p className="text-sm font-medium text-[#4b5b6a]">
                    Plan Price
                  </p>
                  <p className="mt-1 text-4xl font-black text-[#10324a]">
                    ₹{activePlan.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#4b5b6a]">
                    Services Unlocked
                  </p>
                  <p className="mt-1 text-4xl font-black text-[#2ca59d]">
                    {visibleServices.length}/{services.length}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPackage(null);
                  setSelectedPlan(activePlan);
                }}
                className="w-full rounded-xl bg-[#d2a14a] px-6 py-5 text-base font-black uppercase tracking-[0.16em] text-[#16364b] transition hover:bg-[#10324a] hover:text-white active:scale-[0.99]"
              >
                Proceed To Payment →
              </button>
              <button
                onClick={() => setSelectedPackage(null)}
                className="mt-4 w-full rounded-xl bg-[#f8f4ea] px-6 py-4 text-base font-black text-[#10324a] transition hover:bg-[#eee7d8]"
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