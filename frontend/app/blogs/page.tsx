export default function BlogsPage() {
  const blogs = [
    { title: "Top 10 Scholarships in USA", date: "June 20, 2024", excerpt: "Maximize your chances of getting a full ride for your higher education in the USA." },
    { title: "Ivy League Admission Secrets", date: "May 15, 2024", excerpt: "How to craft a unique profile that stands out to top-tier university admissions." },
    { title: "Working in Germany Post-Study", date: "April 10, 2024", excerpt: "Learn about the work visa rules and job market opportunities for international students in Germany." },
  ];

  return (
    <main className="bg-black text-white px-8 md:px-20 py-24 min-h-screen">
      <div className="text-center mb-24 space-y-4">
        <span className="text-gold-500 uppercase tracking-widest font-bold">Insights</span>
        <h1 className="text-5xl md:text-7xl font-bold">Our Global <span className="text-gold-500 italic">Insights</span></h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Read the latest updates and expert tips on how to prepare for your international education journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {blogs.map((blog, i) => (
          <div key={i} className="glass-card hover:border-gold-500 transition-all p-12 flex flex-col justify-between group">
             <div className="space-y-6">
                <span className="text-xs text-gold-500 font-bold uppercase tracking-widest">{blog.date}</span>
                <h3 className="text-3xl font-bold leading-tight group-hover:text-gold-500 transition-colors">{blog.title}</h3>
                <p className="text-white/60 text-base leading-relaxed">{blog.excerpt}</p>
             </div>
             <div className="pt-12">
                <button className="text-gold-500 font-bold uppercase tracking-widest text-sm underline underline-offset-8">Read Full Article</button>
             </div>
          </div>
        ))}
      </div>
    </main>
  );
}