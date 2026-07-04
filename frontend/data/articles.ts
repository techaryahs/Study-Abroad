export const articleCategories = [
  "All",
  "Study Abroad",
  "Universities",
  "Scholarships",
  "Visa",
  "SOP & LOR",
  "Careers",
  "Student Life",
  "IELTS",
  "Accommodation",
] as const;

export type ArticleCategory = Exclude<(typeof articleCategories)[number], "All">;
export type ArticleStatus = "Draft" | "Published";

export interface Article {
  slug: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  content: string[];
  highlights: string[];
  tags?: string[];
  featured?: boolean;
  status?: ArticleStatus;
}

export interface PopularTopic {
  name: string;
  href: string;
  image: string;
  description: string;
  stat: string;
}

export const featuredArticle: Article = {
  slug: "study-abroad-roadmap-2026",
  category: "Study Abroad",
  title: "The Complete Study Abroad Roadmap for 2026 Admissions",
  excerpt:
    "A practical month-by-month guide to shortlisting countries, preparing tests, building applications, securing scholarships, and planning visas with confidence.",
  coverImage: "/blog-ivy.png",
  author: "EduLeaderGlobal Editorial Team",
  publishedAt: "June 28, 2026",
  readingTime: "9 min read",
  highlights: [
    "Build a 12-month admissions calendar before deadlines arrive.",
    "Match universities by academics, budget, visas, and long-term outcomes.",
    "Prepare documents early so SOPs, LORs, and funding proof stay coherent.",
  ],
  content: [
    "A strong study abroad plan begins with sequencing. Students often start with university names, but the better first step is to define country fit, budget, degree goals, and career outcomes. Once those are clear, shortlisting becomes sharper and application effort is spent where it can actually convert.",
    "For 2026 admissions, applicants should build a calendar around intake deadlines, test dates, document preparation, and scholarship windows. Keep a separate tracker for transcripts, recommendation letters, essays, financial documents, and visa steps so nothing is handled in panic mode.",
    "The best applications feel consistent. Your academic choices, SOP narrative, resume, recommendation letters, and interview answers should all point toward the same academic and career direction. That alignment is what helps admissions committees understand your story quickly.",
  ],
};

export const articles: Article[] = [
  {
    slug: "top-universities-canada-2026",
    category: "Universities",
    title: "Top Universities in Canada for 2026",
    excerpt:
      "Explore leading Canadian universities, program strengths, admissions factors, and what international students should compare before applying.",
    coverImage: "/universityy.png",
    author: "Riya Mehta",
    publishedAt: "June 24, 2026",
    readingTime: "7 min read",
    highlights: [
      "Compare research output, co-op access, and graduate employability.",
      "Check program deadlines because Canadian intakes vary widely.",
      "Budget for tuition, living costs, health insurance, and winter essentials.",
    ],
    content: [
      "Canada remains one of the most balanced study destinations for students who want academic quality, work exposure, and post-study options. The strongest universities are not always the same for every program, so compare department reputation rather than relying only on overall rankings.",
      "Students targeting Canada for 2026 should evaluate co-op availability, city-level living costs, research opportunities, and admission prerequisites. Competitive programs may ask for strong grades, English proficiency, portfolios, or prerequisite courses.",
      "A smart shortlist should include ambitious, target, and safer options across provinces. This helps protect your timeline if one university delays decisions or if a program fills earlier than expected.",
    ],
  },
  {
    slug: "complete-uk-student-visa-guide",
    category: "Visa",
    title: "Complete UK Student Visa Guide",
    excerpt:
      "A clear guide to CAS, financial evidence, timelines, credibility checks, and the common visa mistakes students should avoid.",
    coverImage: "/visa-hero.png",
    author: "Arjun Nair",
    publishedAt: "June 22, 2026",
    readingTime: "8 min read",
    highlights: [
      "Understand your CAS details before submitting the application.",
      "Keep financial documents consistent and easy to verify.",
      "Prepare for credibility questions around course choice and career plans.",
    ],
    content: [
      "The UK student visa process is structured, but small errors can create delays. Your Confirmation of Acceptance for Studies should match your course, institution, and personal details exactly before you begin the application.",
      "Financial evidence is one of the most important parts of the process. Students should confirm required amounts, holding periods, sponsor relationships, and currency conversions before submitting documents.",
      "A good visa file should make your academic intention obvious. Be ready to explain why the course fits your background, why the university is suitable, and how the degree supports your future plans.",
    ],
  },
  {
    slug: "sop-writing-tips",
    category: "SOP & LOR",
    title: "SOP Writing Tips for Competitive Applications",
    excerpt:
      "Learn how to write a focused statement of purpose that connects your academic past, program fit, goals, and evidence of readiness.",
    coverImage: "/sop-hero.png",
    author: "Neha Kapoor",
    publishedAt: "June 19, 2026",
    readingTime: "6 min read",
    highlights: [
      "Avoid generic motivation and prove program fit with specifics.",
      "Show progression from academic work to future goals.",
      "Use examples instead of adjectives to demonstrate strengths.",
    ],
    content: [
      "A strong SOP is not a biography. It is a focused academic argument explaining why you are ready for a specific program and how that program connects to your next step.",
      "Admissions readers look for evidence. Instead of saying you are passionate, mention projects, courses, research, internships, or problems that shaped your interest. Specificity makes the statement credible.",
      "The best SOPs balance ambition with realism. Your goals should be clear enough to feel intentional and flexible enough to show that you understand how graduate study can refine your direction.",
    ],
  },
  {
    slug: "scholarships-indian-students-should-know",
    category: "Scholarships",
    title: "Scholarships Every Indian Student Should Know",
    excerpt:
      "A practical overview of merit awards, need-based aid, assistantships, and country-specific funding options for Indian applicants.",
    coverImage: "/scholarship-hero-v2.png",
    author: "Ananya Rao",
    publishedAt: "June 17, 2026",
    readingTime: "7 min read",
    highlights: [
      "Track university-level awards along with external scholarships.",
      "Start scholarship essays before admissions decisions arrive.",
      "Assistantships can reduce costs while building academic experience.",
    ],
    content: [
      "Scholarship planning should start alongside university shortlisting. Many awards have separate deadlines, additional essays, or early priority consideration, so waiting until admits arrive can reduce your options.",
      "Indian students should compare merit scholarships, need-based aid, departmental awards, graduate assistantships, and country-specific schemes. Each has different eligibility and documentation expectations.",
      "A persuasive scholarship application connects achievement with purpose. Show not only what you have done, but why funding you will create academic, professional, or community impact.",
    ],
  },
  {
    slug: "cost-of-living-australia",
    category: "Student Life",
    title: "Cost of Living in Australia for International Students",
    excerpt:
      "Understand rent, groceries, transport, insurance, casual work, and city-level differences before building your Australia budget.",
    coverImage: "/student-grad-sop.png",
    author: "Karan Malhotra",
    publishedAt: "June 15, 2026",
    readingTime: "6 min read",
    highlights: [
      "Rent is usually the biggest monthly expense in major cities.",
      "Health cover and transport should be included from day one.",
      "Part-time work can help, but should not be the only funding plan.",
    ],
    content: [
      "Australia offers a strong student experience, but city choice can change your budget significantly. Sydney and Melbourne are usually more expensive than many regional study destinations.",
      "Students should estimate rent, food, transport, phone plans, health cover, course materials, and emergency funds. A conservative budget is safer than depending on immediate part-time work.",
      "Shared housing, student concessions, early accommodation booking, and campus resources can reduce costs. The key is to plan before arrival rather than learning the budget after the first month.",
    ],
  },
  {
    slug: "germany-public-universities-explained",
    category: "Universities",
    title: "Germany Public Universities Explained",
    excerpt:
      "A student-friendly guide to tuition, language requirements, blocked accounts, application portals, and public university expectations.",
    coverImage: "/blog-germany.png",
    author: "Meera Iyer",
    publishedAt: "June 12, 2026",
    readingTime: "8 min read",
    highlights: [
      "Public universities can be low-cost, but admission standards are precise.",
      "Check whether the program is English-taught, German-taught, or hybrid.",
      "Document evaluation and application portals may add extra time.",
    ],
    content: [
      "Germany's public universities are attractive because many programs have low or no tuition fees. However, low tuition does not mean easy admission. Programs often expect exact academic prerequisites and complete documentation.",
      "Students should verify language requirements, credit compatibility, APS or document review needs, and whether applications go through uni-assist or the university portal.",
      "A strong Germany application is organized and technical. Matching your prior coursework to program requirements is just as important as writing a good motivation letter.",
    ],
  },
  {
    slug: "usa-f1-visa-interview-tips",
    category: "Visa",
    title: "USA F1 Visa Interview Tips",
    excerpt:
      "Prepare confident answers for university choice, funding, academic intent, career plans, and ties to your home country.",
    coverImage: "/blog-usa.png",
    author: "Dev Shah",
    publishedAt: "June 10, 2026",
    readingTime: "5 min read",
    highlights: [
      "Keep answers short, honest, and specific to your profile.",
      "Know your university, course, funding, and post-study plan clearly.",
      "Do not memorize scripts that sound unrelated to your real background.",
    ],
    content: [
      "The F1 visa interview is not a speech. It is a short conversation where the officer checks whether your study plans, finances, and intent are credible.",
      "Prepare crisp answers about why you chose the university, why the course fits your background, who is funding you, and what you plan to do after graduation.",
      "The strongest answers sound natural because they are based on facts. Know your documents, but focus on explaining your own decisions clearly.",
    ],
  },
  {
    slug: "ielts-preparation-roadmap",
    category: "IELTS",
    title: "IELTS Preparation Roadmap",
    excerpt:
      "A structured plan for listening, reading, writing, and speaking practice with weekly milestones and exam-day habits.",
    coverImage: "/toefl-hero.png",
    author: "Sara Thomas",
    publishedAt: "June 8, 2026",
    readingTime: "6 min read",
    highlights: [
      "Diagnose your current band before starting random practice.",
      "Review writing and speaking errors instead of only taking mock tests.",
      "Practice timing under exam conditions in the final weeks.",
    ],
    content: [
      "IELTS preparation works best when students first diagnose their weak sections. A student who needs writing improvement should not spend most of the week solving reading passages only because they feel easier.",
      "Build a weekly routine with listening drills, reading timing, writing feedback, and speaking recordings. Tracking repeated mistakes is more valuable than taking endless mocks without review.",
      "In the final phase, simulate test conditions. Work on stamina, time management, and answer transfer accuracy so your score reflects your actual ability.",
    ],
  },
  {
    slug: "best-courses-after-graduation",
    category: "Careers",
    title: "Best Courses After Graduation for Global Careers",
    excerpt:
      "Compare master's pathways in data, business, engineering, public policy, design, and healthcare based on outcomes and fit.",
    coverImage: "/unipredict-hero.jpg",
    author: "Ishaan Verma",
    publishedAt: "June 5, 2026",
    readingTime: "7 min read",
    highlights: [
      "Choose a course by outcome, not only trend value.",
      "Check prerequisites before assuming a career switch is easy.",
      "Look at internship access, location, alumni roles, and visa options.",
    ],
    content: [
      "The best course after graduation depends on your current background and future role. Data science, business analytics, finance, engineering management, design, and public policy can all be excellent choices for different students.",
      "Before choosing a program, check prerequisites, curriculum depth, employment reports, internship access, and location advantage. A trendy course without fit can create application and job-search difficulties.",
      "A strong choice connects your past experience to a believable next step. Admissions committees and employers both respond better to coherent transitions.",
    ],
  },
  {
    slug: "choosing-the-right-country",
    category: "Study Abroad",
    title: "Choosing the Right Country for Your Study Abroad Goals",
    excerpt:
      "Use academics, budget, immigration pathways, employment outcomes, and lifestyle fit to decide where you should apply.",
    coverImage: "/timeline-image.jpg",
    author: "Priya Menon",
    publishedAt: "June 3, 2026",
    readingTime: "6 min read",
    highlights: [
      "Country choice should come before university shortlisting.",
      "Compare post-study work rules and industry access by field.",
      "Lifestyle and support systems matter for long-term success.",
    ],
    content: [
      "Country selection is one of the most important study abroad decisions. A university may be strong, but if the country's cost, visa pathway, or job market does not fit your goals, the overall plan becomes fragile.",
      "Compare tuition, living costs, post-study work options, immigration pathways, course duration, language, climate, and career ecosystem. No country is universally best; the right one depends on your priorities.",
      "Students should shortlist countries before universities. That creates a clearer application strategy and prevents scattered decisions.",
    ],
  },
  {
    slug: "common-admission-mistakes",
    category: "Study Abroad",
    title: "Common Admission Mistakes Students Should Avoid",
    excerpt:
      "Avoid late planning, generic essays, weak university fit, missed deadlines, incomplete documents, and unrealistic shortlists.",
    coverImage: "/admission-hero.png",
    author: "Nikhil Bansal",
    publishedAt: "May 31, 2026",
    readingTime: "5 min read",
    highlights: [
      "Generic essays are easy to spot and hard to defend.",
      "A balanced shortlist protects you from unpredictable outcomes.",
      "Document quality matters as much as submission timing.",
    ],
    content: [
      "Many admission mistakes come from rushing. Students often start essays late, underestimate document collection, or apply to universities without checking program fit carefully.",
      "A strong application should be specific to the program. Reusing generic essays across universities weakens your chances because it does not show why that course is right for you.",
      "Build a balanced shortlist and submit complete, polished documents well before deadlines. Small process improvements can create a major difference in outcomes.",
    ],
  },
  {
    slug: "student-accommodation-guide",
    category: "Accommodation",
    title: "Student Accommodation Guide",
    excerpt:
      "A practical checklist for choosing on-campus housing, shared apartments, private studios, leases, deposits, and safe locations.",
    coverImage: "/shortlisting-hero-v2.png",
    author: "Aditi Sharma",
    publishedAt: "May 28, 2026",
    readingTime: "6 min read",
    highlights: [
      "Start housing research as soon as you accept the offer.",
      "Read lease rules for deposits, notice periods, and utilities.",
      "Check commute time and neighborhood safety before booking.",
    ],
    content: [
      "Accommodation can shape your first semester abroad. Students should compare on-campus halls, university-managed housing, shared apartments, private studios, and homestays based on cost, safety, commute, and contract terms.",
      "Always check what is included in rent. Utilities, internet, heating, laundry, and deposits can change the real monthly cost.",
      "Do not choose housing only by distance on a map. Look at transport routes, grocery access, neighborhood safety, and whether the lease terms fit your academic calendar.",
    ],
  },
];

export const popularTopics: PopularTopic[] = [
  {
    name: "USA",
    href: "/universities/by-country/usa",
    image: "/blog-usa.png",
    description: "F1 visas, STEM courses, Ivy League planning, and internships.",
    stat: "F1 + STEM",
  },
  {
    name: "Canada",
    href: "/universities/by-country/canada",
    image: "/universityy.png",
    description: "Top universities, PGWP planning, scholarships, and co-op routes.",
    stat: "PGWP Pathways",
  },
  {
    name: "UK",
    href: "/universities/by-country/united-kingdom",
    image: "/uk-talent.jpg",
    description: "CAS, student visas, one-year master's options, and Russell Group.",
    stat: "Graduate Route",
  },
  {
    name: "Australia",
    href: "/universities/by-country/australia",
    image: "/student-grad-sop.png",
    description: "Group of Eight, city budgets, student work, and post-study options.",
    stat: "Go8 Focus",
  },
  {
    name: "Germany",
    href: "/universities/by-country/germany",
    image: "/blog-germany.png",
    description: "Public universities, blocked accounts, APS, and technical programs.",
    stat: "Public Unis",
  },
  {
    name: "Ireland",
    href: "/universities/by-country/ireland",
    image: "/timeline-image.jpg",
    description: "Tech careers, Dublin universities, internships, and student life.",
    stat: "Tech Hub",
  },
];

export function getArticleBySlug(slug: string) {
  if (featuredArticle.slug === slug) return featuredArticle;
  return articles.find((article) => article.slug === slug);
}
