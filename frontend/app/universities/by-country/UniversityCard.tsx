"use client";

import Image from "next/image";
import Link from "next/link";

export default function UniversityCard({ uni }: any) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 p-6 flex gap-6 hover:shadow-lg transition">

      {/* Rank Badge */}
      <div className="absolute right-4 top-4 flex items-center justify-center w-8 h-8 bg-yellow-400 text-black text-xs font-bold rounded-full shadow">
        {uni.ranking}
      </div>

      {/* Logo */}
      <div className="w-28 h-28 flex items-center justify-center">
        <Image
          src={uni.image}
          alt={uni.name}
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1">

        {/* Title */}
        <Link href={`/universities/${uni.slug}`}>
          <h2 className="text-xl font-bold text-gray-800 hover:text-yellow-500 cursor-pointer">
            {uni.name}
          </h2>
        </Link>

        {/* Location + Address */}
        <p className="text-gray-500 text-sm mb-4">
          📍 {uni.location}
          {uni.address && ` • ${uni.address}`}
        </p>

        {/* INFO GRID */}
        <div className="grid grid-cols-3 gap-y-3 text-sm mb-4">

          <div>
            <p className="text-gray-400">Average salary</p>
            <p className="font-semibold text-gray-800">
              {uni.salary || "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Tuition fees</p>
            <p className="font-semibold text-gray-800">
              {uni.tuition || "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Acceptance rate</p>
            <p className="font-semibold text-gray-800">
              {uni.acceptance || "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Average SAT Score</p>
            <p className="font-semibold text-gray-800">
              {uni.sat || "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Minimum TOEFL</p>
            <p className="font-semibold text-gray-800">
              {uni.toefl || "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">Average GPA</p>
            <p className="font-semibold text-gray-800">
              {uni.gpa || "—"}
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-3">

          <button className="px-5 py-2 rounded-lg font-semibold text-black 
            bg-gradient-to-r from-yellow-300 to-yellow-500 
            shadow-md hover:scale-[1.02] transition">
            RateMyChances
          </button>

          <button className="px-5 py-2 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 transition">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}