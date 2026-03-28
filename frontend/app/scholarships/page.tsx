export default function ScholarshipsPage() {
  const scholarships = [
    { title: "Fulbright Scholarship", coverage: "Full Tuition + Living Expenses", region: "USA" },
    { title: "Commonwealth Scholarship", coverage: "Full Tuition + Travel + Stipend", region: "UK" },
    { title: "DAAD Scholarship", coverage: "Tuition Exemption + Stipend", region: "Germany" },
    { title: "Erasmus Mundus", coverage: "Full Coverage for Masters", region: "Europe" },
  ];

  return (
    <main className="bg-black text-white px-8 md:px-20 py-24 min-h-screen">
      <div className="text-center mb-24 space-y-4">
        <span className="text-gold-500 uppercase tracking-widest font-bold">Financial Assistance</span>
        <h1 className="text-5xl md:text-7xl font-bold">Top Global <span className="text-gold-500 italic">Scholarships</span></h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          We help students find and apply for scholarships that cover up to 100% of their education costs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {scholarships.map((scholarship, i) => (
          <div key={i} className="glass-card hover:border-gold-500 transition-all p-12 flex flex-col justify-between group">
             <div className="space-y-4">
                <span className="text-xs text-gold-500 font-bold uppercase tracking-widest">{scholarship.region}</span>
                <h3 className="text-3xl font-bold">{scholarship.title}</h3>
                <p className="text-white/60 text-base">{scholarship.coverage}</p>
             </div>
             <div className="pt-10">
                <button className="btn-outline-gold w-full text-center py-4">Explore More</button>
             </div>
          </div>
        ))}
      </div>
    </main>
  );
}