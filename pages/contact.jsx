import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

import { whatsappLink, CONTACT_EMAIL, LESSON_HOURS } from '@/lib/site';

// The WhatsApp number is set once in lib/site.js (NEXT_PUBLIC_WHATSAPP_NUMBER).
// While it is empty, every WhatsApp button on this page is hidden.
const WHATSAPP_MESSAGE = "Hi! I'm interested in tutoring classes";
const WA_LINK = whatsappLink(WHATSAPP_MESSAGE);

// WhatsApp QR Code Component
const WhatsAppQRCode = ({ size = 200 }) => {
  const whatsappUrl = WA_LINK;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(whatsappUrl)}&bgcolor=ffffff&color=25D366&margin=10`;
  
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-green-500">
        <img 
          src={qrApiUrl} 
          alt="WhatsApp QR Code" 
          width={size} 
          height={size}
          className="rounded-lg"
        />
      </div>
      <p className="mt-3 text-sm text-slate-400 text-center">
        Scan with your phone camera
      </p>
    </div>
  );
};

const Icons = {
  WhatsApp: ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Mail: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Clock: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Send: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Check: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "How do the lessons work?",
      a: "Lessons are live on Google Meet at a fixed weekly time. You'll get the link before each lesson, and your child can ask questions and get feedback as they work."
    },
    {
      q: "What do you teach?",
      a: "SAT and PSAT preparation, exam preparation for IGCSE, AP and the 11+, and school subjects from Primary 3 to SS 3 (Grades 3 to 12 abroad)."
    },
    {
      q: "How much does it cost?",
      a: "Every fee is on our fees page. The consultation call and the assessment class are free, with no obligation."
    },
    {
      q: "How do we start?",
      a: "Book a free consultation call. Then your child has a free assessment class, and we choose the tutor and plan from what we find."
    },
  ];

  return (
    <>
      <Head>
        <title>Contact Us - EduTrack Hub</title>
        <meta name="description" content="Have questions about our tutoring services? Contact EduTrack Hub via WhatsApp, email, or our contact form." />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>

      {/* Floating WhatsApp */}
      {WA_LINK && <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <Icons.WhatsApp className="w-6 h-6" />
      </a>}

      <div className="min-h-screen bg-slate-50">
        <Navigation />

        {/* Hero */}
        <section className="pt-28 pb-16 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-teal-100">
                Have questions? We'd love to hear from you. Reach out through WhatsApp for the fastest response!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-6 relative z-10">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 -mt-20">
              {/* WhatsApp */}
              {WA_LINK && <a
                href={whatsappLink("Hi! I have a question about tutoring")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Icons.WhatsApp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                <p className="text-green-100 mb-4">The quickest way to reach us.</p>
                <span className="font-semibold">Click to chat →</span>
              </a>}

              {/* Email */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <Icons.Mail className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
                <p className="text-slate-600 mb-4">For detailed inquiries & documents.</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal-600 font-semibold hover:text-teal-700">
                  {CONTACT_EMAIL}
                </a>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <Icons.Clock className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Lesson hours</h3>
                <p className="text-slate-600 mb-4">When we hold live lessons.</p>
                <div className="text-slate-700">
                  {LESSON_HOURS.lines.map((l) => <p key={l} className="font-medium">{l}</p>)}
                  <p className="mt-2 text-sm text-slate-500">{LESSON_HOURS.zone}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Send us a message
                </h2>
                <p className="text-slate-600 mb-8">
                  Fill out the form below and we'll get back to you.
                </p>

                {status.message && (
                  <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    status.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {status.type === 'success' && <Icons.Check className="w-5 h-5" />}
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="SAT Programme">SAT Programme</option>
                        <option value="PSAT Prep">PSAT Prep</option>
                        <option value="Small Group Classes">Small Group Classes</option>
                        <option value="One-to-One Lessons">One-to-One Lessons</option>
                        <option value="Fees and payment">Fees and payment</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us what you need help with..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                    {!loading && <Icons.Send className="w-5 h-5" />}
                  </button>
                </form>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 mb-8">
                  Quick answers to common questions.
                </p>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:border-transparent transition-all duration-300">
                      <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                      <p className="text-slate-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA with QR Code */}
        {WA_LINK && <section className="py-16 bg-slate-900">
          <div className="max-w-5xl mx-auto px-5 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Prefer to chat directly?
                </h2>
                <p className="text-slate-400 mb-6">
                  WhatsApp is the quickest way to reach us. 
                  Click the button or scan the QR code with your phone.
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  <Icons.WhatsApp className="w-6 h-6" />
                  Chat on WhatsApp
                </a>
              </div>
              
              <div className="flex justify-center md:justify-end">
                <WhatsAppQRCode size={180} />
              </div>
            </div>
          </div>
        </section>}

        <Footer minimal />
      </div>
    </>
  );
}
