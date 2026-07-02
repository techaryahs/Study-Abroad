"use client";

interface CategoryFiltersProps {
  categories: readonly string[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function CategoryFilters({
  categories,
  activeCategory,
  onChange,
}: CategoryFiltersProps) {
  return (
    <div className="filter-scroll flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-xl border px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-300 ${
              isActive
                ? "border-[#C5A059] bg-[#C5A059] text-white shadow-[0_12px_30px_rgba(197,160,89,0.24)]"
                : "border-[rgba(197,160,89,0.22)] bg-white text-[#6B5E51] hover:border-[#C5A059] hover:text-[#C5A059]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
