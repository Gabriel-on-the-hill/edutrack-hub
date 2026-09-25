import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { withAuth } from '../../../hooks/useAuth';
import { Icons } from '../../../components/ui/Icons';
import { FEATURES } from '../../../lib/site';

function CurriculaIndex() {
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurricula();
  }, []);

  const fetchCurricula = async () => {
    try {
      const res = await fetch('/api/curriculum');
      if (res.ok) {
        const data = await res.json();
        setCurricula(data.curricula || []);
      }
    } catch (error) {
      console.error('Failed to fetch curricula:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Curriculum Management - EduTrack Hub</title>
      </Head>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Curricula</h1>
          <p className="text-slate-600 mt-1">Manage educational frameworks and competency sets.</p>
        </div>
        {FEATURES.curriculumGenerator && (<Link
          href="/admin/curriculum/generator"
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-teal-500/25 hover:bg-teal-700 transition-all"
        >
          <Icons.Sparkles className="w-4 h-4" />
          AI Generator
        </Link>)}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject & Grade</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {curricula.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No curricula found. Start by generating one.
                    </td>
                  </tr>
                ) : (
                  curricula.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{c.subject}</div>
                        <div className="text-xs text-slate-500">{c.grade}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {c.country} ({c.countryCode})
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div 
                              className="bg-teal-500 h-1.5 rounded-full" 
                              style={{ width: `${(c.confidenceScore || 0) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-slate-500">
                            {Math.round((c.confidenceScore || 0) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/curriculum/${c.id}`}
                          className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default withAuth(CurriculaIndex, { requireAdmin: true });
