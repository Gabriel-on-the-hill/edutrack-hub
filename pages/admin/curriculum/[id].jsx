import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { withAuth } from '../../../hooks/useAuth';
import { Icons } from '../../../components/ui/Icons';

function CurriculumDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCurriculum();
  }, [id]);

  const fetchCurriculum = async () => {
    try {
      const res = await fetch(`/api/curriculum/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurriculum(data.curriculum);
      }
    } catch (error) {
      console.error('Failed to fetch curriculum details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    </AdminLayout>
  );

  if (!curriculum) return (
    <AdminLayout>
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-slate-900">Curriculum not found</h2>
        <Link href="/admin/curriculum" className="text-teal-600 hover:underline mt-4 block">Back to List</Link>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <Head>
        <title>{curriculum.subject} - {curriculum.grade} | EduTrack Hub</title>
      </Head>

      <div className="mb-8">
        <Link href="/admin/curriculum" className="text-sm text-slate-500 hover:text-teal-600 mb-4 inline-block flex items-center gap-1">
          ← Back to Curricula
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{curriculum.subject}</h1>
            <p className="text-slate-600 mt-1">{curriculum.grade} • {curriculum.country}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Status</span>
             <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
               curriculum.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
             }`}>
               {curriculum.status}
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Competencies */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center"><Icons.Target className="w-4 h-4" /></span>
              Core Competencies
            </h2>
            <div className="space-y-4">
              {curriculum.competencies?.map((comp, idx) => (
                <div key={comp.id} className="p-4 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all group">
                  <div className="flex gap-4">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-teal-400 transition-colors mt-1">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-900 transition-colors">{comp.title}</h3>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{comp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Metadata & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Provenance</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-400">Source Authority</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{curriculum.sourceAuthority || 'Self-Generated'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Confidence Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${(curriculum.confidenceScore || 0) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {Math.round((curriculum.confidenceScore || 0) * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Last Verified</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {curriculum.lastVerified ? new Date(curriculum.lastVerified).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="font-bold mb-2">Classroom Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Generate lesson plans, practice questions, or student worksheets based on these competencies.
            </p>
            <button className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95">
              Build Lesson Plan
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(CurriculumDetail, { requireAdmin: true });
