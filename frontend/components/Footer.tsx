import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-bg border-t border-black/10 bg-white dark:border-[#d4af37]/20 dark:bg-black/95">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SA</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white underline underline-offset-4 decoration-blue-600/30">
                Study Abroad
              </span>
            </Link>
            <p className="max-w-xs text-sm text-gray-500 leading-relaxed dark:text-gray-400">
              Empowering students to achieve their international education goals with comprehensive support and personalized guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/programs" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">Find Programs</Link></li>
              <li><Link href="/universities" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">Top Universities</Link></li>
              <li><Link href="/scholarships" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">Scholarship Finder</Link></li>
              <li><Link href="/visa-assist" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">Visa Assistance</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-500 dark:text-gray-400 flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white">Email:</span>
                hello@studyabroad.com
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-400 flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white">Phone:</span>
                +1 (234) 567-890
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-white/5">
          <p className="text-center text-xs text-gray-400">
            &copy; {currentYear} Study Abroad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
