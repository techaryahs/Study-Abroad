const services = [
  { 
    title: "Admission Guidance", 
    description: "Personalized advice from experts to help you apply for the best universities based on your profile and career goals.",
    icon: "🎓"
  },
  { 
    title: "University Shortlisting", 
    description: "Our data-driven process shortlists universities that maximize your chances of acceptance and offer the best programs.",
    icon: "🏦"
  },
  { 
    title: "SOP & LOR Support", 
    description: "Assistance in writing compelling Statement of Purpose and Letters of Recommendation to impact the admissions committee.",
    icon: "🖋️"
  },
  { 
    title: "Scholarship Assistance", 
    description: "Guidance in identifying and applying for scholarships, grants, and bursaries to reduce the financial burden of education.",
    icon: "🏆"
  },
  { 
    title: "Visa Guidance", 
    description: "Complete support for the visa application process, document checklist, and interview preparation for successful outcomes.",
    icon: "✈️"
  },
  { 
    title: "Profile Building", 
    description: "Strategies to enhance your profile with research papers, internships, and certifications before applying for Ivy League universities.",
    icon: "💼"
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-black text-white px-8 md:px-20 py-24 min-h-screen">
      <div className="text-center mb-24 space-y-4">
        <span className="text-gold-500 uppercase tracking-widest font-bold">What We Offer</span>
        <h1 className="text-5xl md:text-7xl font-bold">Our Core <span className="text-gold-500 italic">Services</span></h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          We provide end-to-end support for your international education journey, as your partner for success.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {services.map((service, i) => (
          <div key={i} className="glass-card hover:border-gold-500 transition-all p-16 flex flex-col justify-between group">
             <div className="space-y-8">
                <div className="text-6xl group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="text-3xl font-bold">{service.title}</h3>
                <p className="text-white/60 text-base leading-relaxed">{service.description}</p>
             </div>
             <div className="pt-12">
                <button className="btn-outline-gold w-full text-center py-4 group-hover:bg-gold-500 group-hover:text-black transition-all">Learn More</button>
             </div>
          </div>
        ))}
      </div>
    </main>
  );
}