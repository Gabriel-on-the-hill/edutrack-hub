import Head from 'next/head';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { CONTACT_EMAIL } from '@/lib/site';

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Privacy Policy - EduTrack Hub</title>
                <meta name="description" content="EduTrack Hub Privacy Policy - How we collect, use, and protect your data." />
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
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                        <p className="text-slate-500 mb-12">Last updated: September 2026</p>

                        <div className="prose prose-slate max-w-none space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    When you use EduTrack Hub, we collect information you provide directly:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2">
                                    <li>Account information (name, email, password)</li>
                                    <li>Details you send in the consultation form: the student&apos;s name, your WhatsApp number and email, class or grade, subjects, and any test scores you share</li>
                                    <li>Payment records (card details are handled by our payment provider, never stored by us)</li>
                                    <li>Class enrollment and attendance data</li>
                                    <li>Communication preferences</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    We use your information to:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2">
                                    <li>Provide and improve our tutoring services</li>
                                    <li>Process payments and enrollments</li>
                                    <li>Send class reminders and educational updates</li>
                                    <li>Respond to your inquiries and support requests</li>
                                    <li>Analyze usage patterns to improve our platform</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Security</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    We implement industry-standard security measures to protect your data.
                                    Passwords are encrypted using bcrypt, sessions use secure HTTP-only cookies,
                                    and card payments are handled by our payment provider.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Sharing</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    We do not sell your personal information. We may share data with:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 mt-4">
                                    <li>Payment providers to complete transactions</li>
                                    <li>Email providers (Resend) to send notifications</li>
                                    <li>Analytics services to improve our platform</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Rights</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    You have the right to access, correct, or delete your personal data.
                                    Contact us at {CONTACT_EMAIL} to exercise these rights.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    We use essential cookies for authentication and session management.
                                    These are necessary for the platform to function properly.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contact Us</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    If you have questions about this privacy policy, please contact us at{' '}
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
