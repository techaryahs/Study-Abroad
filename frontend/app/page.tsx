import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-24 pb-20 mt-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-24 sm:px-12 sm:py-32 lg:px-16">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Your Journey to <span className="text-blue-200">World-Class</span> Education Starts Here
          </h1>
          <p className="mt-8 text-lg leading-8 text-blue-100 max-w-2xl mx-auto">
            Explore thousands of programs in top universities across the globe. We provide expert guidance, visa services, and scholarship assistance to make your dream a reality.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/programs" 
              className="rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-md hover:bg-gray-100 transition-all scale-100 hover:scale-105"
            >
              Explore Programs
            </Link>
            <Link 
              href="/consultation" 
              className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-3xl opacity-50" />
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Universities', value: '250+' },
            { label: 'Countries', value: '15+' },
            { label: 'Scholarships', value: '$5M+' },
            { label: 'Happy Students', value: '10k+' }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-3xl font-extrabold text-blue-600">{stat.value}</span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Featured Programs</h2>
            <p className="text-gray-500 dark:text-gray-400">Discover popular courses across major destinations</p>
          </div>
          <Link href="/programs" className="text-sm font-semibold text-blue-600 hover:text-blue-500 flex items-center group">
            View all <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Computer Science', country: 'United States', color: 'bg-emerald-50 text-emerald-700' },
            { title: 'Business Management', country: 'United Kingdom', color: 'bg-blue-50 text-blue-700' },
            { title: 'Data Science & AI', country: 'Canada', color: 'bg-indigo-50 text-indigo-700' }
          ].map((course, idx) => (
            <div key={idx} className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-8 hover:border-blue-600/30 dark:hover:border-blue-400/30 transition-all cursor-pointer shadow-sm hover:shadow-xl">
              <div className={`mb-4 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${course.color}`}>
                {course.country}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Take the next step in your career with world-reknowned programs designed for tomorrow's leaders.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}