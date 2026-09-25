// pages/admin/dashboard.jsx
// Admin Dashboard with real stats and audit trail

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '../../hooks/useAuth';
import AdminLayout from '../../components/admin/AdminLayout';
import AnalyticsCharts from '../../components/admin/AnalyticsCharts';
import { Icons } from '../../components/ui/Icons';

// Simple currency conversion (Estimate)
const EXCHANGE_RATE = 0.0011; // 1 NGN = 0.0011 USD (approx)

function AdminDashboard() {
  const { user } = useAuth();
  const [currency, setCurrency] = useState('NGN'); // 'NGN' | 'USD'
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalEnrollments: 0,
    upcomingClasses: 0,
    completedClasses: 0,
    totalRevenue: 0,
    chartData: [],
    enrollmentStats: {},
  });
  const [recentClasses, setRecentClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch classes
      const classesRes = await fetch('/api/classes');
      if (classesRes.ok) {
        const data = await classesRes.json();
        const classes = data.classes || [];
        const now = new Date();
        const upcoming = classes.filter((c) => new Date(c.scheduledTime) > now);
        const completed = classes.filter((c) => c.status === 'COMPLETED');

        setRecentClasses(classes.slice(0, 5));

        // Calculate total enrolled
        const totalEnrollments = classes.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

        setStats((prev) => ({
          ...prev,
          totalClasses: classes.length,
          upcomingClasses: upcoming.length,
          completedClasses: completed.length,
          totalEnrollments,
        }));
      }

      // Fetch user stats
      const usersRes = await fetch('/api/admin/stats');
      if (usersRes.ok) {
        const data = await usersRes.json();
        setStats((prev) => ({
          ...prev,
          totalStudents: data.totalStudents || 0,
          totalRevenue: data.totalRevenue || 0,
          chartData: data.chartData || [],
          enrollmentStats: data.enrollmentStats || {},
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';

    let value = price / 100; // Convert kobo to main unit
    let curr = 'NGN';

    if (currency === 'USD') {
      value = value * EXCHANGE_RATE;
      curr = 'USD';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
          <p className="font-bold text-slate-700 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Revenue'
                ? formatPrice(entry.value * 100)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard - EduTrack Hub</title>
      </Head>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>

        {/* Currency Toggle */}
        <div className="bg-white p-1 rounded-lg border border-slate-200 inline-flex">
          <button
            onClick={() => setCurrency('NGN')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currency === 'NGN'
              ? 'bg-teal-50 text-teal-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            NGN (₦)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currency === 'USD'
              ? 'bg-teal-50 text-teal-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Icons.BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Classes</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalClasses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                  <Icons.Calendar className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Upcoming</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.upcomingClasses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Icons.DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatPrice(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Icons.GraduationCap className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Students</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <AnalyticsCharts
            data={stats.chartData}
            currency={currency}
            exchangeRate={EXCHANGE_RATE}
          />

          {/* Quick Actions + Recent Classes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 h-fit">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/admin/classes"
                  className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-teal-50 group rounded-xl transition-all duration-200 border border-slate-100 hover:border-teal-100"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icons.Plus className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block group-hover:text-teal-700">New Class</span>
                    <span className="text-sm text-slate-500">Schedule a session</span>
                  </div>
                </Link>

                <Link
                  href="/admin/students"
                  className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-teal-50 group rounded-xl transition-all duration-200 border border-slate-100 hover:border-teal-100"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icons.Search className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block group-hover:text-teal-700">Find Student</span>
                    <span className="text-sm text-slate-500">Search database</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Classes */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Recent Classes</h2>
                <Link href="/admin/classes" className="text-teal-600 hover:text-teal-700 text-sm font-semibold hover:underline">
                  View All Classes →
                </Link>
              </div>

              {recentClasses.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-500 mb-4">No classes created yet</p>
                  <Link href="/admin/classes" className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Create Your First Class
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-l-lg">Class</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentClasses.map((cls) => (
                        <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-semibold text-slate-900">{cls.title}</p>
                              <p className="text-xs text-slate-500">{cls.subject}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatDate(cls.scheduledTime)}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            {cls.enrolledCount || 0} / {cls.maxStudents}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${cls.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                              cls.status === 'LIVE' ? 'bg-green-100 text-green-700 animate-pulse' :
                                cls.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
                                  'bg-red-100 text-red-700'
                              }`}>
                              {cls.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

// Protect this page - requires ADMIN role
export default withAuth(AdminDashboard, { requireAdmin: true });
