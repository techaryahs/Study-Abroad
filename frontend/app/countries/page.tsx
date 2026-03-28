import Flag from "react-world-flags";

export default function CountriesPage() {
  const countries = [
    { name: "USA", code: "US", description: "World-class Ivy League universities and high ROI." },
    { name: "UK", code: "GB", description: "Centuries of academic tradition and research excellence." },
    { name: "Germany", code: "DE", description: "Zero tuition fees in public universities and precision engineering." },
    { name: "Australia", code: "AU", description: "Vibrant living and top-tier group of eight universities." },
    { name: "Ireland", code: "IE", description: "Europe's tech hub with excellent post-study work visa." },
    { name: "Dubai", code: "AE", description: "Emerging global hub for business and hospitality." },
    { name: "Canada", code: "CA", description: "Student-friendly policies and high-quality lifestyle." },
    { name: "France", code: "FR", description: "Top-tier business schools and rich cultural heritage." },
    { name: "New Zealand", code: "NZ", description: "Safe environment and world-class research facilities." },
    { name: "Singapore", code: "SG", description: "Asian education hub with global industry connections." },
    { name: "Poland", code: "PL", description: "Affordable quality education in the heart of Europe." },
    { name: "Spain", code: "ES", description: "Rich cultural experience with world-renowned universities." },
    { name: "Netherlands", code: "NL", description: "Innovative education system and strong international focus." },
    { name: "Italy", code: "IT", description: "Historical excellence in art, design, and architecture." }
  ];

  return (
    <main className="bg-black text-white px-8 md:px-20 py-24 min-h-screen">
      <div className="text-center mb-24 space-y-4">
        <span className="text-gold-500 uppercase tracking-widest font-bold">Global Destinations</span>
        <h1 className="text-5xl md:text-7xl font-bold">Top Countries for <span className="text-gold-500 italic">Overseas Education</span></h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Explore the best study destinations across the globe and find the perfect match for your career goals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {countries.map((country, i) => (
          <div key={i} className="glass-card flex flex-col items-center gap-6 group hover:bg-gold-500 hover:text-black transition-all p-12 overflow-hidden border border-white/10 rounded-2xl cursor-pointer">
            <div className="w-24 h-16 relative overflow-hidden rounded-lg shadow-2xl border border-white/10 group-hover:border-black/20">
              <Flag code={country.code} className="w-full h-full object-cover" />
            </div>
            <div className="text-4xl md:text-3xl lg:text-4xl font-black uppercase tracking-wider">{country.name}</div>
            <p className="text-sm text-center leading-relaxed font-medium">
              {country.description}
            </p>
            <div className="pt-8">
              <span className="text-xs uppercase font-black underline underline-offset-8">Explore Opportunities</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
