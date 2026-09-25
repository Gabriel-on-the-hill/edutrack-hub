// pages/dashboard/student.jsx
// Student Dashboard with real progress tracking

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, withAuth } from '../../hooks/useAuth';
import Image from 'next/image';
import { FEATURES, whatsappLink } from '../../lib/site';

// Minimal line-icon set (stroke = currentColor) — keeps the UI clean and consistent.
const svg = (paths) => ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const Icon = {
  Overview: svg(<><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>),
  Calendar: svg(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>),
  Progress: svg(<><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></>),
  Folder: svg(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />),
  Book: svg(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>),
  Search: svg(<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>),
  Check: svg(<polyline points="20 6 9 17 4 12" />),
  Clock: svg(<><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>),
  Streak: svg(<path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C9 10 12 9 12 2z" />),
};

function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    totalAttended: 0,
    totalCompleted: 0,
    attendanceRate: 0,
    totalHours: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    // Handle Payment Success
    if (router.query.payment_success) {
      // Clean URL
      const { payment_success, class_id, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
      // Logic to show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    // Handle Auto Enroll Intent
    const autoClassId = router.query.enroll_class || router.query.classId;
    if (autoClassId) {
      handleAutoEnroll(autoClassId);
    }
  }, [router.isReady, router.query]);

  const handleAutoEnroll = async (classId) => {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ classId }),
      });

      if (res.status === 402) {
        // Online card payment is switched off (FEATURES.onlinePayments in lib/site.js):
        // tell the student how to pay instead of sending them to Stripe.
        if (!FEATURES.onlinePayments) {
          const info = await res.json().catch(() => ({}));
          setPaymentNotice({ title: info.className || info.title || 'this class' });
          return;
        }
        // Payment Required -> Redirect to Stripe
        const checkoutRes = await fetch('/api/checkout/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ classId })
        });

        if (checkoutRes.ok) {
          const { url } = await checkoutRes.json();
          if (url) window.location.href = url;
        }
        return;
      }

      if (res.ok) {
        // Success (Free class)
        fetchDashboardData();
        // Clear query
        const { enroll_class, classId: cid, ...rest } = router.query;
        router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch enrollments
      const enrollRes = await fetch('/api/enrollments', { credentials: 'include' });
      if (enrollRes.ok) {
        const data = await enrollRes.json();
        setEnrollments(data.enrollments || []);
      }

      // Fetch upcoming classes
      const classesRes = await fetch('/api/classes?upcoming=true');
      if (classesRes.ok) {
        const data = await classesRes.json();
        setUpcomingClasses(data.classes || []);
      }

      // Fetch progress
      const progressRes = await fetch('/api/progress', { credentials: 'include' });
      if (progressRes.ok) {
        const data = await progressRes.json();
        setProgress(data.progress || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (classItem) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ classId: classItem.id, action: 'join' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.meetUrl) {
          window.open(data.meetUrl, '_blank');
        }
        // Refresh data
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to join class:', error);
    }
  };

  const formatDate = (dateString, type = 'full') => {
    const date = new Date(dateString);
    if (type === 'time') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isClassJoinable = (classItem) => {
    const now = new Date();
    const classTime = new Date(classItem.scheduledTime);
    const timeDiff = (classTime - now) / (1000 * 60); // minutes
    return timeDiff <= 15 && timeDiff >= -classItem.duration;
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      ATTENDED: 'bg-green-100 text-green-700',
      COMPLETED: 'bg-purple-100 text-purple-700',
      MISSED: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-slate-100 text-slate-700',
    };
    return badges[status] || 'bg-slate-100 text-slate-700';
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 50) return 'bg-blue-500';
    if (rate >= 20) return 'bg-yellow-500';
    return 'bg-slate-300';
  };

  return (
    <>
      <Head>
        <title>Student Dashboard - EduTrack Hub</title>
      </Head>

      <div className="flex min-h-screen bg-slate-50 font-sans relative">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="EduTrack Hub" width={28} height={28} />
            <span className="font-bold text-slate-800">Student Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="text-2xl">{sidebarOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`w-64 bg-white shadow-xl z-40 flex flex-col fixed inset-y-0 lg:static transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="EduTrack Hub" width={32} height={32} />
              <span className="font-bold text-lg text-slate-800">EduTrack Hub</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu</div>

            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'overview'
                ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon.Overview className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'classes'
                ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon.Calendar className="w-5 h-5" />
              My Classes
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'progress'
                ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon.Progress className="w-5 h-5" />
              Progress
            </button>
            <button
              onClick={() => { setActiveTab('materials'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'materials'
                ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon.Folder className="w-5 h-5" />
              My Materials
            </button>

            <div className="my-6 border-t border-slate-100"></div>

            <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Explore</div>

            <Link
              href="/resources"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all duration-200"
            >
              <Icon.Book className="w-5 h-5" />
              Resource Library
            </Link>
            <Link
              href="/classes"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all duration-200"
            >
              <Icon.Search className="w-5 h-5" />
              Browse Classes
            </Link>
          </nav>

          <div className="p-4 border-t bg-slate-50">
            <div className="px-4 py-2 mb-3">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full tracking-wide">
                STUDENT
              </span>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border border-slate-200 rounded-xl font-medium shadow-sm transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full pt-20 lg:pt-10">
          {paymentNotice && (
            <div className="mb-8 p-6 bg-white border border-teal-200 rounded-2xl shadow-sm flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">One more step to join {paymentNotice.title}</h3>
                <p className="text-slate-600 mt-1">
                  This is a paid class. Message us and we'll send you the payment link and confirm your place.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {whatsappLink() && (
                    <a href={whatsappLink(`Hi! I'd like to pay for ${paymentNotice.title}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-full font-semibold">
                      Message us on WhatsApp
                    </a>
                  )}
                  <Link href="/contact" className="inline-flex items-center border border-slate-200 hover:border-teal-300 text-slate-700 px-5 py-2.5 rounded-full font-semibold">
                    Contact page
                  </Link>
                </div>
              </div>
              <button onClick={() => setPaymentNotice(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Dismiss">✕</button>
            </div>
          )}
          {showSuccess && (
            <div
              className="mb-8 p-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl text-white shadow-xl shadow-teal-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><Icon.Check className="w-6 h-6 text-white" /></div>
                <div>
                  <h3 className="font-bold text-lg">Payment Successful!</h3>
                  <p className="text-teal-50">You've successfully enrolled in the class. Welcome aboard!</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">✕</button>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                  Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-slate-600 mt-1">Track your learning progress and upcoming classes</p>
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Icon.Book className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">Classes Enrolled</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalEnrolled}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                          <Icon.Check className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">Attendance Rate</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.attendanceRate}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                          <Icon.Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">Learning Hours</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.totalHours}h</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                          <Icon.Streak className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">Current Streak</p>
                          <p className="text-2xl font-bold text-slate-900">{stats.currentStreak}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Classes */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Your Upcoming Classes</h2>
                    {enrollments.filter(e => e.status === 'CONFIRMED' || e.status === 'PENDING').length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">You haven't enrolled in any upcoming classes yet.</p>
                        <Link href="/classes" className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                          Browse Classes
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {enrollments
                          .filter(e => e.status === 'CONFIRMED' || e.status === 'PENDING')
                          .slice(0, 5)
                          .map((enrollment) => (
                            <div
                              key={enrollment.id}
                              className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100 gap-4"
                            >
                              <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg">{enrollment.class.title}</h3>
                                <div className="flex items-center gap-3 text-slate-600 mt-1">
                                  <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-xs font-semibold">{enrollment.class.subject}</span>
                                  <span className="text-sm">{formatDate(enrollment.class.scheduledTime)}</span>
                                  <span className="text-sm">{formatDate(enrollment.class.scheduledTime, 'time')}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(enrollment.status)}`}>
                                  {enrollment.status}
                                </span>
                                {isClassJoinable(enrollment.class) && enrollment.class.meetUrl && (
                                  <button
                                    onClick={() => handleJoinClass(enrollment.class)}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all animate-pulse"
                                  >
                                    Join Class Now
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Classes Tab */}
              {activeTab === 'classes' && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-900">All My Classes</h2>
                    <Link href="/classes" className="text-teal-600 hover:text-teal-700 text-sm font-semibold hover:underline">
                      Browse New Classes →
                    </Link>
                  </div>

                  {enrollments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-slate-500 mb-4">No classes yet.</p>
                      <Link href="/classes" className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                        Browse Classes
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-l-lg">Class</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Resources</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-r-lg">Recording</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {enrollments.map((enrollment) => (
                            <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-4">
                                <div>
                                  <p className="font-semibold text-slate-900">{enrollment.class.title}</p>
                                  <p className="text-xs text-slate-500">{enrollment.class.subject}</p>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-600">
                                {formatDate(enrollment.class.scheduledTime)}
                              </td>
                              <td className="px-4 py-4">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadge(enrollment.status)}`}>
                                  {enrollment.status}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                {enrollment.class.notesUrl ? (
                                  <a
                                    href={enrollment.class.notesUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                                  >
                                    Resources
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-xs italic">None</span>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                {enrollment.class.recordingUrl ? (
                                  <a
                                    href={enrollment.class.recordingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                                  >
                                    Watch
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-xs italic">Pending</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Tab */}
              {activeTab === 'progress' && (
                <div className="space-y-6">
                  {/* Overall Progress */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Overall Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-4xl font-bold text-blue-600 mb-1">{stats.totalCompleted}</p>
                        <p className="text-sm font-semibold text-blue-700">Classes Completed</p>
                      </div>
                      <div className="text-center p-6 bg-teal-50 rounded-2xl border border-teal-100">
                        <p className="text-4xl font-bold text-teal-600 mb-1">{stats.totalHours}h</p>
                        <p className="text-sm font-semibold text-teal-700">Total Learning Time</p>
                      </div>
                      <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
                        <p className="text-4xl font-bold text-purple-600 mb-1">{stats.subjectsStudied}</p>
                        <p className="text-sm font-semibold text-purple-700">Subjects Studied</p>
                      </div>
                    </div>
                  </div>

                  {/* Subject Progress */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Progress by Subject</h2>
                    {progress && progress.length > 0 ? (
                      <div className="space-y-4">
                        {progress.map((p) => {
                          const completionRate = p.classesEnrolled > 0 ? (p.classesCompleted / p.classesEnrolled) * 100 : 0;
                          return (
                            <div key={p.id} className="p-5 border border-slate-200 rounded-xl hover:border-teal-200 transition-colors">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900 text-lg">{p.subject}</h3>
                                <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full tracking-wide uppercase">
                                  {p.currentLevel}
                                </span>
                              </div>
                              <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                                <div>
                                  <p className="text-slate-500 mb-1">Enrolled</p>
                                  <p className="font-bold text-slate-900">{p.classesEnrolled}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 mb-1">Attended</p>
                                  <p className="font-bold text-slate-900">{p.classesAttended}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 mb-1">Completed</p>
                                  <p className="font-bold text-slate-900">{p.classesCompleted}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 mb-1">Time</p>
                                  <p className="font-bold text-slate-900">{Math.round(p.totalMinutes / 60 * 10) / 10}h</p>
                                </div>
                              </div>
                              {/* Progress bar */}
                              <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="font-semibold text-slate-600">Completion Rate</span>
                                  <span className="font-bold text-slate-900">{Math.round(completionRate)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(completionRate)}`}
                                    style={{
                                      width: `${completionRate}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon.Progress className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="text-slate-500 mb-4">No progress data yet.</p>
                        <p className="text-sm text-slate-400">Start attending classes to see your stats build up!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Materials Tab */}
              {activeTab === 'materials' && (
                <div className="space-y-6">
                  {/* Shared library callout */}
                  <Link
                    href="/resources"
                    className="block bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold">Resource Library</h2>
                        <p className="text-teal-50 text-sm mt-1">
                          Practice apps, tools and downloads shared with all enrolled students.
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold">Open &rarr;</span>
                    </div>
                  </Link>

                  {/* Class materials */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Class Materials</h2>
                    {(() => {
                      const withMaterials = enrollments.filter(
                        (e) => e.class && (e.class.notesUrl || e.class.recordingUrl)
                      );
                      if (withMaterials.length === 0) {
                        return (
                          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-500 mb-1">No class materials yet.</p>
                            <p className="text-sm text-slate-400">
                              Notes and recordings appear here after each class.
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div className="grid gap-4">
                          {withMaterials.map((enrollment) => (
                            <div
                              key={enrollment.id}
                              className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100 gap-4"
                            >
                              <div>
                                <h3 className="font-semibold text-slate-900">{enrollment.class.title}</h3>
                                <p className="text-sm text-slate-500">{enrollment.class.subject}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                {enrollment.class.notesUrl && (
                                  <a
                                    href={enrollment.class.notesUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:border-teal-300 hover:text-teal-700 transition-colors"
                                  >
                                    Notes
                                  </a>
                                )}
                                {enrollment.class.recordingUrl && (
                                  <a
                                    href={enrollment.class.recordingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
                                  >
                                    Recording
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

// Protect this page - requires authentication
export default withAuth(StudentDashboard);
