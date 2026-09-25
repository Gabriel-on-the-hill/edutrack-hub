import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

const Icons = {
    GraduationCap: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ),
    Heart: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    ),
    Lightbulb: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
    ),
    Users: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Globe: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    ArrowRight: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    ),
};

export default function About() {
    return (
        <>
            <Head>
                <title>About - EduTrack Hub</title>
                <meta name="description" content="Learn about EduTrack Hub and meet the tutor behind the platform. Our mission is to make quality education accessible to students worldwide." />
                <link rel="icon" href="/logo.png" type="image/png" />
            </Head>

            <div className="min-h-screen bg-white">
                <Navigation />

                {/* Hero */}
                <section className="pt-28 pb-16 bg-gradient-to-br from-slate-50 to-white">
                    <div className="max-w-7xl mx-auto px-5 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                                Education that <span className="text-teal-600">actually works</span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                We believe every student deserves to understand—not just memorize.
                                EduTrack Hub is where struggling becomes learning, and learning becomes mastery.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-5 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Image */}
                            <div className="relative max-w-sm mx-auto lg:mx-0">
                                <div className="aspect-[4/5] relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/gabriel-portrait.jpg"
                                        alt="Gabriel - Founder & Lead Tutor"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 1024px) 90vw, 384px"
                                        priority
                                    />
                                </div>
                                {/* Floating card */}
                                <div className="absolute bottom-3 right-3 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl shadow-xl p-4 sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                            <Icons.GraduationCap className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Lead Tutor</p>
                                            <p className="text-sm text-slate-500">EduTrack Hub</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-slate-900">
                                    A teacher who remembers what it's like to struggle
                                </h2>
                                <div className="space-y-4 text-slate-600 leading-relaxed">
                                    <p>
                                        I've been where your child is now—staring at a problem, feeling completely lost,
                                        wondering if everyone else just "gets it" naturally. (Spoiler: they don't.)
                                    </p>
                                    <p>
                                        With a background in engineering and years of specialized tutoring experience across
                                        IGCSE, A-Levels, SAT, and IB curricula, I've developed methods that work because
                                        they start with understanding <em>how</em> each student thinks.
                                    </p>
                                    <p>
                                        This isn't about shortcuts or tricks. It's about building real understanding
                                        that lasts beyond exam day. Every concept connects to something real. Every
                                        question is welcome. Every student matters.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-5 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Believe</h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                Our teaching philosophy is built on principles that put students first.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: Icons.Lightbulb,
                                    title: 'Understanding Over Memorization',
                                    description: 'We teach the "why" behind every concept so students can solve any problem, not just the ones they\'ve seen before.',
                                },
                                {
                                    icon: Icons.Users,
                                    title: 'Small Groups, Big Impact',
                                    description: 'With only 8 students max per class, everyone gets the attention they need to truly learn.',
                                },
                                {
                                    icon: Icons.Heart,
                                    title: 'Patience & Encouragement',
                                    description: 'We create a safe space where questions are welcomed and mistakes are learning opportunities.',
                                },
                                {
                                    icon: Icons.Globe,
                                    title: 'Learn From Anywhere',
                                    description: 'Classes are fully online, so you can join from anywhere in the world — all you need is an internet connection.',
                                },
                            ].map((value, i) => (
                                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6">
                                        <value.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                    <p className="text-slate-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-5 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { number: 'Max 8', label: 'Students per class' },
                                { number: '4', label: 'Learning hubs' },
                                { number: 'Live', label: 'Online classes' },
                                { number: '100%', label: 'Sessions recorded' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <p className="text-4xl lg:text-5xl font-bold text-teal-600">{stat.number}</p>
                                    <p className="text-slate-600 mt-2">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Ready to start your learning journey?
                        </h2>
                        <p className="text-xl text-slate-300 mb-10">
                            Learn live with a tutor who builds real understanding, not just exam tricks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/classes"
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Browse Classes
                                <Icons.ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
