import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Icons } from '@/components/ui/Icons';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for class booking intent
  const classId = router.query.class;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Account
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // 2. If Class ID present, Auto-Enroll
      if (classId) {
        try {
          const enrollRes = await fetch('/api/enrollments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ classId }),
          });

          // Handle Payment Required (Stripe)
          if (enrollRes.status === 402) {
            const checkoutRes = await fetch('/api/checkout/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ classId })
            });

            if (checkoutRes.ok) {
              const { url } = await checkoutRes.json();
              if (url) {
                window.location.href = url; // Redirect to Stripe
                return; // Prevent redirect to dashboard
              }
            }
          }

          if (!enrollRes.ok && enrollRes.status !== 402) {
            console.warn("Auto-enrollment failed, manual enrollment required");
            // We don't block the user, just redirect, maybe with a warning?
            // Ideally we show a success message on the dashboard.
          }
        } catch (enrollError) {
          console.error("Enrollment error:", enrollError);
        }
      }

      // 3. Redirect
      router.push('/dashboard/student');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Book a free consultation to start',
    'Your lessons and progress in one place',
    'Small groups of at most 4, or one-to-one',
    'Direct WhatsApp support',
  ];

  return (
    <>
      <Head>
        <title>Sign Up - EduTrack Hub</title>
        <meta name="description" content="Create your EduTrack Hub account and book a free consultation to get started. No credit card required." />
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10">
            <Image
              src="/logo.png"
              alt="EduTrack Hub"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <span className="font-bold text-2xl text-white tracking-tight">
              EduTrack<span className="text-teal-200">Hub</span>
            </span>
          </Link>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Start your journey to<br />
              <span className="text-amber-300">real results</span>
            </h1>
            <p className="text-teal-100 text-lg mb-8">
              Create your account to book live, interactive small-group classes and keep all your materials in one place.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                    <Icons.Check className="w-4 h-4 text-amber-900" />
                  </div>
                  <span className="text-white">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Founding cohort */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {['bg-amber-300', 'bg-teal-300', 'bg-white/30'].map((c, i) => (
                <div key={i} className={`w-10 h-10 rounded-full ${c} ring-2 ring-teal-600`} />
              ))}
            </div>
            <div>
              <p className="text-white font-medium">Be one of our first students</p>
              <p className="text-teal-200 text-sm">Founding cohort now open</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
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

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h2>
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Sign in
                </Link>
              </p>
              {classId && (
                <div className="mt-4 p-3 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium border border-teal-100">
                  You're booking a class! Create your account to finalize.
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Creating account...' : classId ? 'Create Account & Book Class' : 'Create Free Account'}
                {!loading && <Icons.ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 text-sm">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-teal-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-teal-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
