import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

const Icons = {
    ChevronDown: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
    ArrowRight: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    ),
};

// Keep these answers in line with lib/programmes.js and the homepage FAQ.
const faqs = [
    {
        category: 'Getting started',
        questions: [
            {
                q: 'How do we start?',
                a: 'Book a free consultation call. We talk about your child, the goal and the fees. Then your child has a free assessment class, where we find their starting point. After that we choose the tutor and the plan, so the first paid lesson is already the right one.',
            },
            {
                q: 'Is the consultation really free?',
                a: 'Yes. The consultation call and the assessment class are both free, with no obligation and no card needed.',
            },
            {
                q: 'Which ages do you teach?',
                a: 'Primary 3 to SS 3 in Nigeria, and Grades 3 to 12 (Years 4 to 13) for families in the UK, US and Canada.',
            },
            {
                q: 'What equipment do we need?',
                a: 'A laptop or tablet with a stable internet connection, a webcam and a microphone. Lessons run on Google Meet, which works in the browser.',
            },
        ],
    },
    {
        category: 'Lessons',
        questions: [
            {
                q: 'What do you teach?',
                a: 'SAT and PSAT preparation, exam preparation for IGCSE, AP and the 11+, and school subjects from Primary 3 to SS 3 (Grades 3 to 12 abroad).',
            },
            {
                q: 'Group or one-to-one?',
                a: 'In Nigeria, Small Group Classes have at most 4 students, and one-to-one lessons are also available. SAT, PSAT and all lessons for families abroad are one-to-one.',
            },
            {
                q: 'When are lessons?',
                a: 'At a fixed weekly time agreed with you. Families abroad agree it in their own time zone.',
            },
            {
                q: 'What will I see as a parent?',
                a: 'A one-page report every month: whether your child is on track, which skills moved, and one clear thing we need from you. Families in Nigeria also get a monthly check-in with the tutor.',
            },
        ],
    },
    {
        category: 'Fees and payment',
        questions: [
            {
                q: 'How much does it cost?',
                a: 'Every fee is on the fees page, for families in Nigeria (in naira) and in the UK, US and Canada (in US dollars).',
            },
            {
                q: 'How do we pay?',
                a: 'Fees are billed monthly. Once you have chosen a plan after the assessment class, we send you the payment details.',
            },
        ],
    },
    {
        category: 'Technical help',
        questions: [
            {
                q: 'The meeting link isn\'t working. What should I do?',
                a: 'Try refreshing the page or opening the link in another browser (Chrome works best). If it still doesn\'t work, message us straight away and we\'ll help you join.',
            },
            {
                q: 'Can my child join from a phone?',
                a: 'It works, but a laptop or tablet is much better, especially when we work through problems together.',
            },
        ],
    },
];

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left"
            >
                <span className="font-medium text-slate-900 pr-4">{question}</span>
                <Icons.ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'
                    }`}
            >
                <p className="text-slate-600 leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}

export default function FAQ() {
    return (
        <>
            <Head>
                <title>FAQ - EduTrack Hub</title>
                <meta name="description" content="Straight answers about EduTrack Hub: how to start, who we teach, group sizes, fees and payment." />
                <link rel="icon" href="/logo.png" type="image/png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            <style jsx global>{`
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>

            <div className="min-h-screen bg-slate-50">
                <Navigation />

                {/* Hero */}
                <section className="pt-28 pb-12 bg-white">
                    <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Straight answers
                        </h1>
                        <p className="text-xl text-slate-600">
                            Got questions? We've got answers. If you can't find what you're looking for,{' '}
                            <Link href="/contact" className="text-teal-600 hover:underline">
                                contact us
                            </Link>
                            .
                        </p>
                    </div>
                </section>

                {/* FAQ Content */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-5 lg:px-8">
                        {faqs.map((category, i) => (
                            <div key={i} className="mb-12 last:mb-0">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    {category.category}
                                </h2>
                                <div className="bg-white rounded-2xl border border-slate-200 px-6">
                                    {category.questions.map((faq, j) => (
                                        <FAQItem key={j} question={faq.q} answer={faq.a} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Still Have Questions CTA */}
                <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
                    <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Still have questions?
                        </h2>
                        <p className="text-teal-100 text-lg mb-8">
                            Ask them on the free consultation call, or send us a message.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/consultation"
                                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-colors"
                            >
                                Book a free consultation
                                <Icons.ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors"
                            >
                                Contact us
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
