import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">

      {/* TOP SECTION */}
      <div className="px-8 md:px-20 py-16 grid md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center font-bold text-black text-xl">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white leading-tight">
                Dr. Alam
              </span>
              <span className="text-[8px] text-gold-500 uppercase tracking-widest">
                Global Admissions
              </span>
            </div>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed">
            Your trusted principal-led partner for studying abroad. We guide students
            to Ivy League and top global universities with personalized, AI-driven support.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-bold mb-6 text-gold-500 uppercase tracking-wider text-sm">
            Quick Links
          </h3>
          <ul className="space-y-4 text-white/60 text-sm">
            <li><Link href="/" className="hover:text-gold-500 transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-gold-500 transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-gold-500 transition-colors">Our Services</Link></li>
            <li><Link href="/success-stories" className="hover:text-gold-500 transition-colors">Success Stories</Link></li>
            <li><Link href="/blogs" className="hover:text-gold-500 transition-colors">Insights & Blogs</Link></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="font-bold mb-6 text-gold-500 uppercase tracking-wider text-sm">
            Core Services
          </h3>
          <ul className="space-y-4 text-white/60 text-sm">
            <li className="hover:text-gold-500 cursor-default transition-colors">Admission Guidance</li>
            <li className="hover:text-gold-500 cursor-default transition-colors">University Shortlisting</li>
            <li className="hover:text-gold-500 cursor-default transition-colors">Scholarship Assistance</li>
            <li className="hover:text-gold-500 cursor-default transition-colors">Visa Guidance</li>
            <li className="hover:text-gold-500 cursor-default transition-colors">Profile Building</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-bold mb-6 text-gold-500 uppercase tracking-wider text-sm">
            Get In Touch
          </h3>
          <div className="space-y-4 text-white/60 text-sm">
            <p className="flex items-start gap-3">
              <span className="text-gold-500">📍</span>
              Excellence Tower, Mumbai, India
            </p>
            <p className="flex items-center gap-3">
              <span className="text-gold-500">📞</span>
              +91 89876 54321
            </p>
            <p className="flex items-center gap-3">
              <span className="text-gold-500">✉</span>
              admissions@dralam.com
            </p>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/5 text-center py-8 text-white/30 text-[10px] uppercase tracking-widest font-medium">
        © {new Date().getFullYear()} Dr. Alam Global Admissions. Crafted for Excellence.
      </div>

    </footer>
  );
}