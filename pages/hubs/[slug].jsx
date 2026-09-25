import { useRouter } from 'next/router';
import Head from 'next/head';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Icons } from '@/components/ui/Icons';
import Link from 'next/link';

const hubContent = {
    foundation: {
        title: "Foundation Hub",
        subtitle: "Elementary & Middle School",
        heroDescription: "Building the core logic, curiosity, and study habits that make future learning effortless.",
        color: "teal",
        sections: [
            {
                title: "Logic & Critical Thinking",
                description: "Moving beyond rote memorization to true understanding."
            },
            {
                title: "Study Habit Foundations",
                description: "Small habits formed early lead to massive results later."
            }
        ],
        cta: "Explore Foundation Resources",
        ctaLink: "/contact?subject=foundation",
        resources: [
            { title: "The Logic Starter Kit", description: "5 games to build critical thinking.", type: "PDF Guide" },
            { title: "Foundation Roadmap", description: "Mapping out middle school success.", type: "Roadmap" }
        ]
    },
    elite: {
        title: "Elite Hub",
        subtitle: "Professional Mastery",
        heroDescription: "Advanced problem solving and strategic mentorship for professionals looking to dominate their field.",
        color: "purple",
        sections: [
            {
                title: "Executive Mentorship",
                description: "1-on-1 strategy sessions for high-stakes problem solving."
            },
            {
                title: "Advanced Skillsets",
                description: "Bridge the gap between academic knowledge and workplace excellence."
            }
        ],
        cta: "Inquire for Private Mentorship",
        ctaLink: "/contact?subject=elite",
        resources: [
            { title: "Senior Leadership Audit", description: "Assessment tools for executives.", type: "Tool" },
            { title: "Strategic Thinking 101", description: "A framework for decision making.", type: "Manual" }
        ]
    },
    partner: {
        title: "Partner Hub",
        subtitle: "Parents & Educators",
        heroDescription: "Resources and coordination tools to support the students in your care.",
        color: "amber",
        sections: [
            {
                title: "Parenting for Success",
                description: "Guides on how to support your child without burnout."
            },
            {
                title: "Educator Collaboration",
                description: "Tools for teachers to track and enhance student progress."
            }
        ],
        cta: "Download Parent Guide",
        ctaLink: "/contact?subject=partner",
        resources: [
            { title: "The Supportive Parent PDF", description: "Communication tips for parents.", type: "Guide" },
            { title: "Progress Tracker", description: "A custom template for tracking growth.", type: "Template" }
        ]
    }
};

export default function HubPage() {
    const router = useRouter();
    const { slug } = router.query;

    // Handle "Success Hub" (SAT) by showing it as a hub or redirecting
    // For now, let's treat it as a hub that leads to classes
    const content = hubContent[slug] || (slug === 'success' ? {
        title: "Success Hub",
        subtitle: "High School & SAT",
        heroDescription: "Strategic mastery for IGCSE, SAT, and A-Levels. Turn exam anxiety into exam confidence.",
        color: "blue",
        sections: [
            {
                title: "Exam Strategy",
                description: "Not just what to solve, but how to solve it under pressure."
            },
            {
                title: "Mentorship Cohorts",
                description: "Small group sessions that fix foundational gaps."
            }
        ],
        cta: "View Mastery Cohorts",
        ctaLink: "/classes",
        resources: [
            { title: "SAT Strategy Guide", description: "Our exam-day playbook.", type: "PDF Guide" },
            { title: "IGCSE Math Formula Sheet", description: "All critical formulas in one page.", type: "Cheat Sheet" }
        ]
    } : null);

    if (!content && router.isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Hub Not Found</h1>
                    <Link href="/" className="text-teal-600 hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    if (!content) return null;

    return (
        <>
            <Head>
                <title>{content.title} | EduTrack Hub</title>
                <meta name="description" content={content.heroDescription} />
            </Head>

            <div className="bg-slate-50 min-h-screen flex flex-col">
                <Navigation />

                <main className="flex-grow pt-32 pb-20">
                    <div className="max-w-7xl mx-auto px-5 lg:px-8">
                        {/* Hero */}
                        <div className="max-w-3xl mb-16">
                            <span className={`inline-block px-4 py-1.5 rounded-full bg-${content.color}-50 text-${content.color}-700 text-sm font-bold tracking-wider uppercase mb-6`}>
                                {content.subtitle}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                                {content.title}
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                {content.heroDescription}
                            </p>
                        </div>

                        {/* Content Sections */}
                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            {content.sections.map((section, i) => (
                                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{section.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{section.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Resource Vault */}
                        <div className="mb-20">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">Resource Vault</h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                {content.resources.map((resource, i) => (
                                    <div key={i} className="group flex items-start gap-4 p-6 bg-white rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
                                        <div className={`w-12 h-12 rounded-xl bg-${content.color}-50 flex items-center justify-center flex-shrink-0`}>
                                            <Icons.BookOpen className={`w-6 h-6 text-${content.color}-600`} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1 block">{resource.type}</span>
                                            <h4 className="font-bold text-slate-900 mb-1">{resource.title}</h4>
                                            <p className="text-sm text-slate-600 mb-3">{resource.description}</p>
                                            <Link href={content.ctaLink} className={`text-sm font-bold text-${content.color}-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                                                Get Resource →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Final CTA */}
                        <div className={`bg-${content.color}-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden`}>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold mb-8 italic">Ready to crush your goals?</h2>
                                <Link
                                    href={content.ctaLink}
                                    className="inline-block bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-50 hover:scale-105 transition-all shadow-xl"
                                >
                                    {content.cta}
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
