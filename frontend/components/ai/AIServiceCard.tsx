"use client";

import Link from "next/link";

interface AIServiceCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  buttonText: string;
}

export default function AIServiceCard({
  title,
  description,
  icon,
  href,
  buttonText,
}: AIServiceCardProps) {
  return (
    <div className="group rounded-3xl border border-[#D6C29A] bg-white shadow-md hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-between">
      <div>
        <div className="text-5xl mb-5">{icon}</div>

        <h3 className="text-2xl font-bold text-[#16364F]">
          {title}
        </h3>

        <p className="text-gray-600 mt-3 leading-7">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#16364F] px-5 py-3 text-white font-semibold hover:bg-[#B3985E] transition"
      >
        {buttonText}
      </Link>
    </div>
  );
}