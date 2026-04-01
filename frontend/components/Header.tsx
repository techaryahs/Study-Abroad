import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/80 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SA</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Study Abroad</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/programs" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Programs</Link>
          <Link href="/universities" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Universities</Link>
          <Link href="/scholarships" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Scholarships</Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">About Us</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-4 py-2"
          >
            Log in
          </Link>
          
          {/* Sign Up Dropdown */}
          <div className="relative group">
            <button
              className="rounded-full bg-[#EAB308] px-6 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-[#FACC15] transition-all flex items-center gap-2 group-hover:ring-4 group-hover:ring-yellow-500/20"
            >
              Sign Up
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl bg-[#1f2937] shadow-2xl ring-1 ring-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 z-50 overflow-hidden border border-white/5">
              <div className="px-4 pt-4 pb-2 border-b border-white/5">
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EAB308]/60">Select Role</p>
              </div>
              <div className="py-1">
                <Link
                  href="/auth/RegisterStudent"
                  className="flex items-center gap-4 px-4 py-3.5 group/item hover:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400 group-hover/item:bg-yellow-400 group-hover/item:text-black transition-all">🎓</div>
                  <div className="font-bold text-sm text-white group-hover/item:text-yellow-400 transition-colors">Student</div>
                </Link>
                <Link
                  href="/auth/RegisterConsultant"
                  className="flex items-center gap-4 px-4 py-3.5 group/item hover:bg-white/5 transition-colors border-t border-white/5"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400 group-hover/item:bg-yellow-400 group-hover/item:text-black transition-all">💼</div>
                  <div className="font-bold text-sm text-white group-hover/item:text-yellow-400 transition-colors">Consultant</div>
                </Link>
                <Link
                  href="/auth/RegisterParent"
                  className="flex items-center gap-4 px-4 py-3.5 group/item hover:bg-white/5 transition-colors border-t border-white/5"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400 group-hover/item:bg-yellow-400 group-hover/item:text-black transition-all">👪</div>
                  <div className="font-bold text-sm text-white group-hover/item:text-yellow-400 transition-colors">Parent</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
