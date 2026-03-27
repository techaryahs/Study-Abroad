export default function ContactPage() {
  return (
    <main className="bg-black text-white px-8 md:px-20 py-24 min-h-screen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {/* LEFT CONTACT INFO */}
        <div className="space-y-12 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <span className="text-gold-500 uppercase tracking-widest font-bold">Get In Touch</span>
            <h1 className="text-5xl md:text-7xl font-bold">Let's Craft Your <br /> <span className="text-gold-500 italic">Global Future</span>.</h1>
            <p className="text-white/60 text-lg max-w-md">
              Have questions about your study abroad journey? Our experts are here to guide you every step of the way.
            </p>
          </div>

          <div className="space-y-8 pt-8">
            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gold-500 uppercase font-black">Call Us</p>
                <p className="text-xl font-bold">+91 89876 54321</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gold-500 uppercase font-black">Email Us</p>
                <p className="text-xl font-bold">admissions@drakash.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gold-500 uppercase font-black">Location</p>
                <p className="text-xl font-bold">Excellence Tower, Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTACT FORM */}
        <div className="glass-card p-10 space-y-8 animate-in fade-in slide-in-from-right duration-700">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gold-500">First Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold-500 outline-none transition-all" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gold-500">Last Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold-500 outline-none transition-all" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gold-500">Email Address</label>
            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold-500 outline-none transition-all" placeholder="john@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gold-500">Your Inquiry</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 h-32 focus:border-gold-500 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
          </div>

          <button className="btn-gold w-full text-center py-4">
            Send Message
          </button>
        </div>
      </div>
    </main>
  );
}
