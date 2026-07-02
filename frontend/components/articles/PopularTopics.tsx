"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PopularTopic } from "@/data/articles";

interface PopularTopicsProps {
  topics: PopularTopic[];
}

export default function PopularTopics({ topics }: PopularTopicsProps) {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#C5A059]">
            Explore By Destination
          </span>
          <h2 className="fd mt-2 text-4xl font-bold text-[#2D2926] sm:text-5xl">
            Popular Topics
          </h2>
        </div>
        <p className="max-w-xl text-sm font-medium leading-relaxed text-[#6B5E51]">
          Country-specific articles for admissions, visas, scholarships, and
          student life planning.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.name}
            href={topic.href}
            className="group overflow-hidden rounded-[24px] border border-[rgba(197,160,89,0.16)] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.025)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(197,160,89,0.42)] hover:shadow-[0_18px_44px_rgba(197,160,89,0.09)]"
          >
            <div className="relative h-40 overflow-hidden bg-[#F8F5F0]">
              <Image
                src={topic.image}
                alt={topic.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/55 via-[#2D2926]/5 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
                {topic.stat}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="fd text-3xl font-bold text-[#2D2926]">
                  {topic.name}
                </h3>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D2926] text-white transition-all duration-300 group-hover:bg-[#C5A059]">
                  <ArrowRight size={16} />
                </span>
              </div>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#6B5E51]">
                {topic.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
