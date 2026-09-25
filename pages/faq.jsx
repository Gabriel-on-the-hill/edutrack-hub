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

const faqs = [
    {
        category: 'Getting Started',
        questions: [
            {
                q: 'How do I sign up for my first class?',
                a: 'Simply create a free account, browse our classes, and click "Enroll Now" on any class that interests you. Your first class is free—no payment required!',
            },
            {
                q: 'What equipment do I need?',
                a: 'You\'ll need a computer or tablet with a stable internet connection, a webcam, and a microphone. We use Google Meet for all our classes, which works directly in your browser.',
            },
            {
                q: 'Are there any age requirements?',
                a: 'Our classes are designed for students aged 13-19 (secondary school and pre-university). Students under 18 should have parent/guardian consent.',
            },
        ],
    },
    {
        category: 'Classes & Scheduling',
        questions: [
            {
                q: 'How big are the classes?',
                a: 'We keep our classes small—typically 4-8 students maximum. This ensures everyone gets individual attention and can ask questions.',
            },
            {
                q: 'What happens if I miss a class?',
                a: 'All classes are recorded! You\'ll receive access to the recording within 24 hours. We encourage live attendance for the interactive experience, but recordings are there if you can\'t make it.',
            },
            {
                q: 'What curricula do you cover?',
                a: 'We specialize in IGCSE, A-Levels, SAT, IB, and AP programs. Our focus is primarily on Mathematics and Sciences, but we\'re expanding our subject offerings.',
            },
            {
                q: 'What time zone are classes scheduled in?',
                a: 'Class times are displayed in your local time zone automatically. We offer classes at various times to accommodate students globally.',
            },
        ],
    },
    {
        category: 'Payment & Pricing',
        questions: [
            {
                q: 'Is the first class really free?',
                a: 'Yes! Your first class is completely free with no obligation. We want you to experience our teaching style before committing.',
            },
            {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards through our secure payment processor, Stripe. Payment is made through our website.',
            },
        ],
    },
    {
        category: 'Technical Support',
        questions: [
            {
                q: 'The meeting link isn\'t working. What should I do?',
                a: 'First, try refreshing the page or using a different browser (Chrome works best). If issues persist, contact us immediately and we\'ll help you join.',
            },
            {
                q: 'Can I use my phone to join classes?',
                a: 'While possible, we recommend using a laptop or desktop computer for the best experience, especially when working through problems together.',
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
                <meta name="description" content="Frequently asked questions about EduTrack Hub online tutoring. Learn about classes, scheduling, payments, and more." />
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
                            Frequently Asked Questions
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
                            We're here to help. Reach out and we'll get back to you within 24 hours.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-white text-teal-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            Contact Us
                            <Icons.ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
