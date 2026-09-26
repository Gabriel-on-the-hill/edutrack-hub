import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const Icons = {
  Home: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  ArrowLeft: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Search: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - EduTrack Hub</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* Header */}
        <header className="p-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="EduTrack Hub"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="font-semibold text-xl text-slate-900">
              EduTrack<span className="text-teal-600">Hub</span>
            </span>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            {/* 404 Number */}
            <div className="relative mb-8">
              <span className="text-[180px] md:text-[220px] font-bold text-slate-100 leading-none select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-teal-500/30">
                  <Icons.Search className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Oops! Page not found
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Looks like this page went on a study break and didn't come back.
              Let's get you back on track!
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transition-all duration-300"
              >
                <Icons.Home className="w-5 h-5" />
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
              >
                <Icons.ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-4">Or try one of these:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/#programmes" className="text-teal-600 hover:text-teal-700 font-medium">
                  See programmes
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/contact" className="text-teal-600 hover:text-teal-700 font-medium">
                  Contact Us
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/consultation" className="text-teal-600 hover:text-teal-700 font-medium">
                  Book a free consultation
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EduTrack Hub. All rights reserved.
        </footer>
      </div>
    </>
  );
}
