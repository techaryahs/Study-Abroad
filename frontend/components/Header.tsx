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
          <Link
            href="/auth/register"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
}
