import { ReactNode } from "react";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: number;
  color: "blue" | "gold";
  badge?: string;
  icon: ReactNode;
  features: string[];
  description: string;
  onSelect: () => void;
}

export default function PricingCard({
  title,
  subtitle,
  price,
  color,
  badge,
  icon,
  features,
  description,
  onSelect,
}: PricingCardProps) {
  const blue = color === "blue";

  return (
    <div className="group relative">
      {/* Hover Glow */}
      <div
        className={`absolute -inset-2 rounded-[28px] blur-3xl opacity-0 transition duration-500 group-hover:opacity-100 ${
          blue ? "bg-blue-500/20" : "bg-yellow-500/20"
        }`}
      />

      <div
        className={`relative flex h-[780px] flex-col overflow-hidden rounded-[28px] border-2 bg-white shadow-2xl transition-all duration-300 group-hover:-translate-y-2 ${
          blue ? "border-[#1E4BE9]" : "border-[#E5A400]"
        }`}
      >
        {/* Top Border */}
        <div
          className={`h-2 w-full ${
            blue
              ? "bg-gradient-to-r from-[#1E4BE9] via-[#2563EB] to-[#1E4BE9]"
              : "bg-gradient-to-r from-[#F2B100] via-[#E5A400] to-[#F2B100]"
          }`}
        />

        {/* Badge */}
        {badge && (
          <div
            className={`absolute right-0 top-7 rounded-l-full px-5 py-2 text-[11px] font-bold tracking-wider text-white ${
              blue ? "bg-[#1E4BE9]" : "bg-[#E5A400]"
            }`}
          >
            {badge}
          </div>
        )}

        {/* Icon */}
        <div className="flex justify-center pt-6">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition duration-300 group-hover:scale-110 ${
              blue
                ? "bg-gradient-to-br from-[#1B3EA8] to-[#2F6EFF]"
                : "bg-gradient-to-br from-[#C88900] to-[#FFBC00]"
            }`}
          >
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-7 pt-3 pb-5">
          {/* Title */}
          <h2 className="text-center text-[34px] font-extrabold leading-none text-[#1F2C63]">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="mt-1 text-center text-[15px] text-gray-500">
            {subtitle}
          </p>

          {/* Price */}
          <h3
            className={`mt-3 text-center text-[54px] font-black leading-none ${
                blue ? "text-[#1E4BE9]" : "text-[#F59E0B]"
            }`}
            >
            ₹{price.toLocaleString("en-IN")}
          </h3>
          {/* Divider */}
          <div className="my-4 h-px bg-gray-200" />

          {/* Features */}
          <div className="flex-1 space-y-3">
            {features.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    blue ? "bg-[#1E4BE9]" : "bg-[#F59E0B]"
                  }`}
                >
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>

                <span className="text-[15px] leading-7 text-gray-700">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-4 rounded-xl bg-gray-100 px-4 py-3 text-center text-xs text-gray-600">
            {description}
          </div>

          {/* Button */}
          <button
            onClick={onSelect}
            className={`mt-4 rounded-xl py-3 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:scale-[1.02] ${
              blue
                ? "bg-gradient-to-r from-[#1B3EA8] to-[#2F6EFF]"
                : "bg-gradient-to-r from-[#D08B00] to-[#F2B100]"
            }`}
          >
            GET STARTED
          </button>
        </div>
      </div>
    </div>
  );
}