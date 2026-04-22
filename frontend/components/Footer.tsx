import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-bg border-t border-[#B3985E]/20 bg-[#2D1F1D] dark:border-[#B3985E]/20 dark:bg-[#2D1F1D]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SA</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white underline underline-offset-4 decoration-blue-600/30">
                International EduLeader Council
              </span>
            </Link>
            <p className="max-w-xs text-[10px] font-bold uppercase tracking-wider text-white/50 leading-relaxed">
              Empowering students to achieve their international education goals with comprehensive support and personalized guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B3985E]">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/programs" className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors">Find Programs</Link></li>
              <li><Link href="/universities" className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors">Top Universities</Link></li>
              <li><Link href="/scholarships" className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors">Scholarship Finder</Link></li>
              <li><Link href="/visa-assist" className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors">Visa Assistance</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B3985E]">Support</h3>
            <ul className="mt-4 space-y-2">

              <li><Link href="/contact" className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B3985E]">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-[10px] font-bold uppercase tracking-wider text-white flex flex-col">
                <span className="text-[#B3985E]">Email:</span>
                [EMAIL_ADDRESS]
              </li>
              <li className="text-[10px] font-bold uppercase tracking-wider text-white flex flex-col">
                <span className="text-[#B3985E]">Phone:</span>
                +91 8657869659
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-white/5">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white">
            <span className="text-[#B3985E]">© {currentYear}</span> International EduLeader Council. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
