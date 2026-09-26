import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import { FEATURES } from '../../lib/site';

// Icons
const Icons = {
  Menu: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ArrowRight: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  User: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  LogOut: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
};

export default function Navigation({ transparent = false }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showBackground = !transparent || isScrolled;
  const dashboardLink = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard/student';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showBackground
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo-mark.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="font-semibold text-xl tracking-tight text-slate-900">
              EduTrack<span className="text-teal-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {FEATURES.learningHubs && (
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors font-medium py-4">
                Learning Hubs
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Link href="/hubs/foundation" className="block px-6 py-3 hover:bg-slate-50">
                  <p className="font-bold text-slate-900">Foundation Hub</p>
                  <p className="text-xs text-slate-500">Elementary & Middle</p>
                </Link>
                <Link href="/hubs/success" className="block px-6 py-3 hover:bg-slate-50">
                  <p className="font-bold text-slate-900">Success Hub</p>
                  <p className="text-xs text-slate-500">High School & SAT</p>
                </Link>
                <Link href="/hubs/elite" className="block px-6 py-3 hover:bg-slate-50">
                  <p className="font-bold text-slate-900">Elite Hub</p>
                  <p className="text-xs text-slate-500">Professional Development</p>
                </Link>
                <Link href="/hubs/partner" className="block px-6 py-3 hover:bg-slate-50">
                  <p className="font-bold text-slate-900">Partner Hub</p>
                  <p className="text-xs text-slate-500">Parents & Educators</p>
                </Link>
              </div>
            </div>
            )}
            {user && FEATURES.resourceLibrary && (
              <Link href="/resources" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                Resources
              </Link>
            )}
            <Link href="/#programmes" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
              Programmes
            </Link>
            <Link href="/fees" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
              Fees
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
              Contact
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
              Blog
            </Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin/curriculum" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                Curricula
              </Link>
            )}
          </div>

          {/* CTA Buttons - Auth Aware */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 mr-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs ring-2 ring-teal-50">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:block">Hi, {user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-500 hover:text-red-500 transition-colors font-medium text-sm flex items-center gap-1"
                >
                  <Icons.LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                <Link
                  href={dashboardLink}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transition-all duration-300"
                >
                  Dashboard
                  <Icons.ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                  Sign In
                </Link>
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
                >
                  Free consultation
                  <Icons.ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <Icons.X className="w-6 h-6" />
            ) : (
              <Icons.Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[32rem] mt-4' : 'max-h-0'
            }`}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            {user && (
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            )}

{FEATURES.learningHubs && (
            <details className="group">
              <summary className="flex items-center justify-between text-slate-700 hover:text-teal-600 font-medium py-2 cursor-pointer list-none">
                Learning Hubs
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </summary>
              <div className="pl-4 mt-2 space-y-2 border-l-2 border-slate-100">
                <Link href="/hubs/foundation" className="block text-sm text-slate-600 py-1">Foundation (Elementary)</Link>
                <Link href="/hubs/success" className="block text-sm text-slate-600 py-1">Success (High School)</Link>
                <Link href="/hubs/elite" className="block text-sm text-slate-600 py-1">Elite (Professional)</Link>
                <Link href="/hubs/partner" className="block text-sm text-slate-600 py-1">Partner (Parents)</Link>
              </div>
            </details>
            )}
            {user && FEATURES.resourceLibrary && (
              <Link href="/resources" className="block text-slate-700 hover:text-teal-600 font-medium py-2">
                Resources
              </Link>
            )}
            <Link href="/#programmes" className="block text-slate-700 hover:text-teal-600 font-medium py-2">
              Programmes
            </Link>
            <Link href="/fees" className="block text-slate-700 hover:text-teal-600 font-medium py-2">
              Fees
            </Link>
            <Link href="/about" className="block text-slate-700 hover:text-teal-600 font-medium py-2">
              About
            </Link>
            <Link href="/contact" className="block text-slate-700 hover:text-teal-600 font-medium py-2">
              Contact
            </Link>
            <Link href="/blog" className="block text-slate-700 hover:text-teal-600 font-medium py-2">
              Blog
            </Link>
            <hr className="border-slate-100" />

            {user ? (
              <>
                <Link href={dashboardLink} className="block text-center bg-teal-600 text-white px-6 py-3 rounded-full font-semibold mt-4 shadow-lg shadow-teal-500/20">
                  {user.role === 'ADMIN' ? 'Admin Dashboard' : 'Student Dashboard'}
                </Link>
                <button onClick={logout} className="w-full text-center text-red-500 font-medium py-3 mt-2">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-slate-700 hover:text-teal-600 font-medium py-2">
                  Sign In
                </Link>
                <Link
                  href="/consultation"
                  className="block text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-full font-semibold mt-4"
                >
                  Free consultation
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
