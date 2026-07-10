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
          blue ? "bg-[#10324a]/20" : "bg-[#d2a14a]/25"
        }`}
      />

      <div
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
          }
        }}
        className={`relative flex h-[780px] flex-col overflow-hidden rounded-[28px] border-2 bg-white shadow-2xl transition-all duration-300 group-hover:-translate-y-2 ${
          blue ? "border-[#10324a]" : "border-[#d2a14a]"
        } cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#d2a14a]/40`}
      >
        {/* Top Border */}
        <div
          className={`h-2 w-full ${
            blue
              ? "bg-gradient-to-r from-[#10324a] via-[#164863] to-[#10324a]"
              : "bg-gradient-to-r from-[#d2a14a] via-[#e6b85c] to-[#d2a14a]"
          }`}
        />

        {/* Badge */}
        {badge && (
          <div
            className={`absolute right-0 top-7 rounded-l-full px-5 py-2 text-[11px] font-bold tracking-wider text-white ${
              blue ? "bg-[#10324a]" : "bg-[#d2a14a]"
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
                ? "bg-gradient-to-br from-[#10324a] to-[#2ca59d]"
                : "bg-gradient-to-br from-[#c78d2f] to-[#d2a14a]"
            }`}
          >
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-7 pt-3 pb-5">
          {/* Title */}
          <h2 className="text-center text-[34px] font-extrabold leading-none text-[#D4A54A]">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="mt-1 text-center text-[15px] text-[#4b5b6a]">
            {subtitle}
          </p>

          {/* Price */}
          <h3
            className={`mt-3 text-center text-[54px] font-black leading-none ${
                blue ? "text-[#10324a]" : "text-[#d2a14a]"
            }`}
            >
            ₹{price.toLocaleString("en-IN")}
          </h3>
          {/* Divider */}
          <div className="my-4 h-px bg-[#10324a]/10" />

          {/* Features */}
          <div className="flex-1 space-y-3">
            {features.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    blue ? "bg-[#10324a]" : "bg-[#d2a14a]"
                  }`}
                >
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>

                <span className="text-[15px] leading-7 text-[#10324a]/80">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-4 rounded-xl bg-[#f8f4ea] px-4 py-3 text-center text-xs text-[#4b5b6a]">
            {description}
          </div>

          {/* Button */}
          <button
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
            className={`mt-4 rounded-xl py-3 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:scale-[1.02] ${
              blue
                ? "bg-gradient-to-r from-[#10324a] to-[#164863]"
                : "bg-gradient-to-r from-[#c78d2f] to-[#d2a14a]"
            }`}
          >
            GET STARTED
          </button>
        </div>
      </div>
    </div>
  );
}