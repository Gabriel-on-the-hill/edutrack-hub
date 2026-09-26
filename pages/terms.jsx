import Head from 'next/head';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { CONTACT_EMAIL } from '@/lib/site';

export default function Terms() {
    return (
        <>
            <Head>
                <title>Terms of Service - EduTrack Hub</title>
                <meta name="description" content="EduTrack Hub Terms of Service - Rules and guidelines for using our platform." />
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

                <main className="pt-28 pb-20">
                    <div className="max-w-3xl mx-auto px-5 lg:px-8">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                        <p className="text-slate-500 mb-12">Last updated: September 2026</p>

                        <div className="prose prose-slate max-w-none space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    By accessing or using EduTrack Hub, you agree to be bound by these Terms of Service.
                                    If you disagree with any part of these terms, you may not access our services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    EduTrack Hub provides live online tutoring, in small groups and one-to-one:
                                    SAT and PSAT preparation, exam preparation for IGCSE, AP and the 11+, and school
                                    subjects from Primary 3 to SS 3 (Grades 3 to 12 for families abroad).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
                                <ul className="list-disc list-inside text-slate-600 space-y-2">
                                    <li>You must provide accurate and complete information when creating an account</li>
                                    <li>You are responsible for maintaining the security of your account</li>
                                    <li>Students under 13 must be enrolled by a parent or guardian</li>
                                    <li>Parents/guardians must consent for users under 18</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Class Enrollment & Attendance</h2>
                                <ul className="list-disc list-inside text-slate-600 space-y-2">
                                    <li>Classes are confirmed upon successful payment (for paid classes)</li>
                                    <li>You will receive a Google Meet link before each class</li>
                                    <li>Sharing class links or recordings is prohibited</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Payment Terms</h2>
                                <ul className="list-disc list-inside text-slate-600 space-y-2">
                                    <li>Fees are listed on our fees page: in Nigerian Naira (NGN) for families in Nigeria and in US dollars (USD) for families in the UK, US and Canada</li>
                                    <li>Fees are billed monthly</li>
                                    <li>Payment is required before lessons begin</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Code of Conduct</h2>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    During classes, students must:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2">
                                    <li>Be respectful to tutors and fellow students</li>
                                    <li>Not disrupt class sessions</li>
                                    <li>Not share inappropriate content</li>
                                    <li>Follow tutor instructions</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    All content, materials, and recordings provided through EduTrack Hub are
                                    the intellectual property of EduTrack Hub and may not be reproduced,
                                    distributed, or used for commercial purposes without written permission.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    EduTrack Hub is not liable for any indirect, incidental, or consequential
                                    damages arising from your use of the service. Our total liability shall
                                    not exceed the amount you paid for the services in question.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Changes to Terms</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    We reserve the right to modify these terms at any time. We will notify
                                    users of significant changes via email or platform notification.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    For questions about these terms, contact us at{' '}
                                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 hover:underline">
                                        {CONTACT_EMAIL}
                                    </a>
                                </p>
                            </section>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-200">
                            <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </main>

                <Footer minimal />
            </div>
        </>
    );
}
