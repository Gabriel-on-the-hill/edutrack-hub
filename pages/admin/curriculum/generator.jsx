import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { withAuth } from '../../../hooks/useAuth';

const REQUEST_TYPES = [
  { value: 'lesson_plan', label: 'Lesson Plan' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'summary', label: 'Summary' },
];

// Maps Generator request_type to Hub ResourceType enum
const RESOURCE_TYPE_MAP = {
  lesson_plan: 'LESSON_PLAN',
  quiz: 'QUIZ',
  summary: 'SUMMARY',
};

function GeneratorPage() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <AdminLayout>
      <Head>
        <title>AI Content Generator - EduTrack Hub</title>
      </Head>

      <div className="mb-8">
        <Link
          href="/admin/curriculum"
          className="text-sm text-slate-500 hover:text-teal-600 mb-4 inline-block"
        >
          &larr; Back to Curricula
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">AI Content Generator</h1>
        <p className="text-slate-600 mt-1">
          Generate teaching materials or discover new curriculum frameworks.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 max-w-md">
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'generate'
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Generate Content
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'discover'
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Discover Curriculum
        </button>
      </div>

      {activeTab === 'generate' ? <GenerateTab /> : <DiscoverTab />}
    </AdminLayout>
  );
}

// =============================================================================
// TAB 1: GENERATE CONTENT (Workflow B)
// =============================================================================

function GenerateTab() {
  const [curricula, setCurricula] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState('');
  const [selectedCompetencies, setSelectedCompetencies] = useState([]);
  const [requestType, setRequestType] = useState('lesson_plan');
  const [loading, setLoading] = useState(false);
  const [loadingCurricula, setLoadingCurricula] = useState(true);
  const [loadingCompetencies, setLoadingCompetencies] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch curricula on mount
  useEffect(() => {
    fetchCurricula();
  }, []);

  // Fetch competencies when curriculum changes
  useEffect(() => {
    if (selectedCurriculum) {
      fetchCompetencies(selectedCurriculum);
      setSelectedCompetencies([]);
    } else {
      setCompetencies([]);
    }
  }, [selectedCurriculum]);

  const fetchCurricula = async () => {
    try {
      const res = await fetch('/api/generator/curricula');
      if (res.ok) {
        const data = await res.json();
        setCurricula(data.curricula || []);
      }
    } catch (err) {
      console.error('Failed to fetch curricula:', err);
    } finally {
      setLoadingCurricula(false);
    }
  };

  const fetchCompetencies = async (curriculumId) => {
    setLoadingCompetencies(true);
    try {
      const res = await fetch(`/api/generator/competencies?curriculumId=${curriculumId}`);
      if (res.ok) {
        const data = await res.json();
        setCompetencies(data.competencies || []);
      }
    } catch (err) {
      console.error('Failed to fetch competencies:', err);
    } finally {
      setLoadingCompetencies(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedCurriculum) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const body = {
        curriculum_id: selectedCurriculum,
        request_type: requestType,
      };
      if (selectedCompetencies.length > 0) {
        body.competency_ids = selectedCompetencies;
      }

      const res = await fetch('/api/generator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || 'Generation failed');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to connect to generator service');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsResource = async () => {
    if (!result) return;
    setSaving(true);

    const curriculum = curricula.find((c) => String(c.id) === String(selectedCurriculum));

    try {
      const res = await fetch('/api/generator/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${REQUEST_TYPES.find((t) => t.value === requestType)?.label} - ${
            curriculum?.subject || 'Curriculum'
          }`,
          description: `AI-generated ${requestType.replace('_', ' ')} for ${
            curriculum?.subject || ''
          } ${curriculum?.grade || ''}`.trim(),
          content: result.content,
          type: RESOURCE_TYPE_MAP[requestType],
          subject: curriculum?.subject || 'General',
        }),
      });

      if (res.ok) {
        setSaved(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save resource');
      }
    } catch (err) {
      setError('Failed to save resource');
    } finally {
      setSaving(false);
    }
  };

  const toggleCompetency = (id) => {
    setSelectedCompetencies((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Configuration</h2>

        {/* Curriculum Selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Curriculum
          </label>
          {loadingCurricula ? (
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            <select
              value={selectedCurriculum}
              onChange={(e) => setSelectedCurriculum(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select a curriculum...</option>
              {curricula.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.subject} - {c.grade} ({c.country})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Request Type */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Output Type
          </label>
          <div className="flex gap-2">
            {REQUEST_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setRequestType(type.value)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  requestType === type.value
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Competencies (optional) */}
        {selectedCurriculum && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Competencies{' '}
              <span className="font-normal text-slate-400">(optional — blank = all)</span>
            </label>
            {loadingCompetencies ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : competencies.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No competencies found</p>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50">
                {competencies.map((comp) => (
                  <label
                    key={comp.id}
                    className="flex items-start gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompetencies.includes(comp.id)}
                      onChange={() => toggleCompetency(comp.id)}
                      className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        {comp.title}
                      </span>
                      {comp.text && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {comp.text}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedCurriculum || loading}
          className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </span>
          ) : (
            'Generate'
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Right: Result */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Result</h2>
          {result && (
            <button
              onClick={handleSaveAsResource}
              disabled={saving || saved}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                saved
                  ? 'bg-green-100 text-green-700'
                  : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
              } disabled:opacity-60`}
            >
              {saved ? 'Saved' : saving ? 'Saving...' : 'Save as Resource'}
            </button>
          )}
        </div>

        {!result && !loading && (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            Generated content will appear here
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin h-8 w-8 border-3 border-teal-500 border-t-transparent rounded-full" />
            <p className="text-sm text-slate-500">
              Running generation pipeline with governance checks...
            </p>
          </div>
        )}

        {result && (
          <div className="prose prose-sm prose-slate max-w-none overflow-y-auto max-h-[600px]">
            <div className="text-xs text-slate-400 mb-3 flex gap-3">
              <span>Type: {result.request_type}</span>
              <span>ID: {result.curriculum_id}</span>
            </div>
            <div
              className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700"
              style={{ fontFamily: 'inherit' }}
            >
              {result.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// TAB 2: DISCOVER CURRICULUM (Workflow A)
// =============================================================================

function DiscoverTab() {
  const [prompt, setPrompt] = useState('');
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState(null);

  // Poll for job status
  useEffect(() => {
    if (!jobId || !polling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/generator/status?jobId=${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJobStatus(data);
          if (data.status === 'completed' || data.status === 'failed') {
            setPolling(false);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, polling]);

  const handleDiscover = async () => {
    if (!prompt.trim()) return;

    setError(null);
    setJobStatus(null);

    try {
      const res = await fetch('/api/generator/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_prompt: prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || 'Failed to start pipeline');
        return;
      }

      setJobId(data.job_id);
      setJobStatus({ status: 'running' });
      setPolling(true);
    } catch (err) {
      setError('Failed to connect to generator service');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Discover a New Curriculum
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Enter a natural-language description. The AI pipeline will search the web,
          validate sources, extract competencies, and store the curriculum.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Grade 9 Biology curriculum for Nigeria"
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />

        <button
          onClick={handleDiscover}
          disabled={!prompt.trim() || polling}
          className="mt-3 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {polling ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Pipeline Running...
            </span>
          ) : (
            'Start Discovery Pipeline'
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Job Status */}
      {jobStatus && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-slate-900">Pipeline Status</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                jobStatus.status
              )}`}
            >
              {jobStatus.status}
            </span>
          </div>

          {jobStatus.status === 'running' && (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full" />
              <span>
                Processing... This may take a few minutes as the agents search, validate,
                and extract curriculum data.
              </span>
            </div>
          )}

          {jobStatus.status === 'failed' && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">{jobStatus.error}</p>
              {jobStatus.requires_human_alert && (
                <p className="text-xs text-amber-600 font-medium">
                  This request requires manual review by an administrator.
                </p>
              )}
            </div>
          )}

          {jobStatus.status === 'completed' && jobStatus.result && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="Country" value={`${jobStatus.result.country} (${jobStatus.result.country_code})`} />
                <InfoCard label="Grade" value={jobStatus.result.grade} />
                <InfoCard label="Subject" value={jobStatus.result.subject} />
                <InfoCard
                  label="Competencies Found"
                  value={jobStatus.result.competency_count}
                />
                {jobStatus.result.coverage && (
                  <InfoCard
                    label="Coverage"
                    value={`${Math.round(jobStatus.result.coverage * 100)}%`}
                  />
                )}
              </div>

              {jobStatus.result.curriculum_id && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2">
                    Curriculum ID: {jobStatus.result.curriculum_id}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    Curriculum stored successfully. You can now generate content from it
                    using the Generate Content tab.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-slate-700 mt-0.5">{value || '—'}</p>
    </div>
  );
}

export default withAuth(GeneratorPage, { requireAdmin: true });
