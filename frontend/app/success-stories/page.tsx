export default function SuccessStoriesPage() {
  const stories = [
    { name: "Rahul S.", uni: "Stanford University", achievement: "Full Scholarship for MS in CS", year: "2024" },
    { name: "Priya K.", uni: "University of Oxford", achievement: "MBA Admission with 50% Grant", year: "2023" },
    { name: "Aditi M.", uni: "National University of Singapore", achievement: "Ph.D. in Data Science", year: "2024" },
  ];

  return (
    <main className="bg-black text-white px-8 md:px-20 py-24 min-h-screen">
      <div className="text-center mb-16 space-y-4">
        <span className="text-gold-500 uppercase tracking-widest font-bold">Inspiration</span>
        <h1 className="text-5xl md:text-7xl font-bold">Global Success <span className="text-gold-500 italic">Stories</span></h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Over 500+ students have successfully secured admissions in top universities worldwide.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {stories.map((story, i) => (
          <div key={i} className="glass-card flex flex-col items-center gap-6 group hover:border-gold-500 transition-all">
             <div className="w-24 h-24 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-3xl font-bold group-hover:bg-gold-500 group-hover:text-black transition-all">
                {story.name[0]}
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{story.name}</h3>
                <p className="text-gold-500 font-medium">{story.uni}</p>
                <p className="text-sm text-white/50">{story.achievement}</p>
                <div className="pt-4">
                  <span className="bg-gold-500/10 text-gold-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Class of {story.year}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </main>
  );
}
