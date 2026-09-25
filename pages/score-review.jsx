import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { whatsappLink, SITE_URL } from '@/lib/site';

// Free Bluebook score review: the entry point for SAT/PSAT families.
// Test dates: keep in step with the launch plan (Section 1, key dates).
const TARGET_TESTS = [
  'SAT, 7 Nov 2026',
  'SAT, 5 Dec 2026',
  'SAT, 6 Mar 2027',
  'A later SAT',
  'PSAT 8/9',
  'PSAT/NMSQT or PSAT 10',
  'Not sure yet',
];

const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Gap year / other'];

const STEPS = [
  {
    title: 'Take the free official practice test',
    body: 'Download College Board\'s Bluebook app and sit a full-length practice test in one go, timed, like the real thing. It takes about 2 hours 15 minutes.',
  },
  {
    title: 'Send us the result',
    body: 'Fill in the form below with the scores, then send the score report (a screenshot or PDF from Bluebook or My Practice) on WhatsApp.',
  },
  {
    title: 'Get your gap map',
    body: 'Within two working days you get a one-page map of which skills are costing points, in what order to fix them, and a realistic target. Free, with no obligation.',
  },
];

const EMPTY = {
  studentName: '', role: 'parent', whatsapp: '', email: '', grade: '', targetTest: '',
  practiceTest: '', total: '', rw: '', math: '', notes: '', consent: false, website: '',
};

function Field({ label, hint, error, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-800 mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 !text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 !text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

const inputClass = (err) =>
  `w-full rounded-xl border ${err ? 'border-red-400' : 'border-slate-200'} bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20`;

export default function ScoreReview() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/score-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('done');
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const details = data.details || {};
      setErrors(Object.fromEntries(Object.entries(details).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
      setServerError(data.error || 'Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setServerError('Could not send. Check your connection and try again.');
      setStatus('error');
    }
  };

  const waReport = whatsappLink(
    `Hi! I just requested a free score review for ${form.studentName || 'my child'}. Here is the Bluebook score report:`
  );
  const waQuestion = whatsappLink('Hi! I have a question about the free Bluebook score review.');

  return (
    <>
      <Head>
        <title>Free SAT Score Review from your Bluebook practice test | EduTrack Hub</title>
        <meta name="description" content="Take College Board's free Bluebook practice test, send us the score report, and get a one-page gap map showing which SAT skills to fix first. Free, no obligation." />
        <link rel="canonical" href={`${SITE_URL}/score-review`} />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`* { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }`}</style>

      <div className="min-h-screen bg-slate-50">
        <Navigation />

        {status === 'done' ? (
          <section className="pt-32 pb-24">
            <div className="max-w-2xl mx-auto px-5">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
                <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Request received</p>
                <h1 className="mt-2 !text-3xl font-bold text-slate-900">Thank you. One last step.</h1>
                <p className="mt-4 !text-base text-slate-600 leading-relaxed">
                  Send us the score report so we can read the skill breakdown, not just the totals.
                  A screenshot of the results screen or the PDF from My Practice is fine.
                </p>
                {waReport ? (
                  <a href={waReport} target="_blank" rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-7 py-3.5 rounded-full font-semibold shadow-lg shadow-amber-500/20 transition-colors">
                    Send the report on WhatsApp
                  </a>
                ) : (
                  <p className="mt-6 !text-base text-slate-700 font-medium">We&apos;ll message you on WhatsApp shortly to collect the report.</p>
                )}
                <ol className="mt-8 space-y-3 text-base text-slate-600">
                  <li><span className="font-semibold text-slate-900">Within two working days:</span> your one-page gap map.</li>
                  <li><span className="font-semibold text-slate-900">Then, if you want it:</span> a free trial class built around the top gap.</li>
                </ol>
                <Link href="/" className="mt-8 inline-block text-teal-700 font-semibold hover:underline">Back to the home page</Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Intro */}
            <section className="pt-32 pb-12">
              <div className="max-w-6xl mx-auto px-5 lg:px-8">
                <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Free for SAT &amp; PSAT students</p>
                <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 max-w-3xl leading-tight">
                  Find out exactly where the points are going.
                </h1>
                <p className="mt-5 text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Take the official practice test for free, send us the result, and we&apos;ll send back a one-page
                  gap map: the skills costing the most points, the order to fix them in, and a realistic target
                  for test day.
                </p>

                <ol className="mt-12 grid md:grid-cols-3 gap-6">
                  {STEPS.map((s, i) => (
                    <li key={s.title} className="bg-white rounded-2xl border border-slate-100 p-6">
                      <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold">{i + 1}</span>
                      <h2 className="mt-4 !text-lg font-bold text-slate-900">{s.title}</h2>
                      <p className="mt-2 !text-sm text-slate-600 leading-relaxed">{s.body}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 !text-sm text-slate-500">
                  Get Bluebook from{' '}
                  <a href="https://bluebook.collegeboard.org/students/download-bluebook" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-medium hover:underline">College Board&apos;s download page</a>.
                  Haven&apos;t taken a test yet? Send the form anyway and we&apos;ll help you set it up.
                </p>
              </div>
            </section>

            {/* Form */}
            <section id="form" className="pb-24">
              <div className="max-w-6xl mx-auto px-5 lg:px-8 grid lg:grid-cols-5 gap-10">
                <form onSubmit={submit} noValidate className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="!text-2xl font-bold text-slate-900">Request your free review</h2>
                    <p className="mt-1 !text-sm text-slate-500">Takes about two minutes. Scores are optional if you&apos;d rather just send the report.</p>
                  </div>

                  <fieldset>
                    <legend className="block text-sm font-semibold text-slate-800 mb-2">I am the</legend>
                    <div className="flex gap-3">
                      {['parent', 'student'].map((r) => (
                        <label key={r} className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium capitalize ${form.role === r ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600'}`}>
                          <input type="radio" name="role" value={r} checked={form.role === r} onChange={set('role')} className="sr-only" />
                          {r}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Student's name" htmlFor="studentName" error={errors.studentName}>
                      <input id="studentName" className={inputClass(errors.studentName)} value={form.studentName} onChange={set('studentName')} autoComplete="name" required />
                    </Field>
                    <Field label="WhatsApp number" htmlFor="whatsapp" hint="With country code, e.g. +234 803 000 0000" error={errors.whatsapp}>
                      <input id="whatsapp" type="tel" inputMode="tel" className={inputClass(errors.whatsapp)} value={form.whatsapp} onChange={set('whatsapp')} autoComplete="tel" required />
                    </Field>
                    <Field label="Email (optional)" htmlFor="email" error={errors.email}>
                      <input id="email" type="email" className={inputClass(errors.email)} value={form.email} onChange={set('email')} autoComplete="email" />
                    </Field>
                    <Field label="Grade" htmlFor="grade" error={errors.grade}>
                      <select id="grade" className={inputClass(errors.grade)} value={form.grade} onChange={set('grade')}>
                        <option value="">Choose…</option>
                        {GRADES.map((g) => <option key={g}>{g}</option>)}
                      </select>
                    </Field>
                    <Field label="Which test are you aiming for?" htmlFor="targetTest" error={errors.targetTest}>
                      <select id="targetTest" className={inputClass(errors.targetTest)} value={form.targetTest} onChange={set('targetTest')}>
                        <option value="">Choose…</option>
                        {TARGET_TESTS.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Practice test taken" htmlFor="practiceTest" hint="e.g. SAT Practice Test 4" error={errors.practiceTest}>
                      <input id="practiceTest" className={inputClass(errors.practiceTest)} value={form.practiceTest} onChange={set('practiceTest')} />
                    </Field>
                  </div>

                  <fieldset>
                    <legend className="block text-sm font-semibold text-slate-800 mb-2">Scores from Bluebook (if you have them)</legend>
                    <div className="grid grid-cols-3 gap-3">
                      {[['total', 'Total', '400–1600'], ['rw', 'R&W', '200–800'], ['math', 'Math', '200–800']].map(([k, label, range]) => (
                        <Field key={k} label={<span className="text-xs font-medium text-slate-600">{label} <span className="text-slate-400">{range}</span></span>} htmlFor={k} error={errors[k]}>
                          <input id={k} type="number" inputMode="numeric" step="10" className={inputClass(errors[k])} value={form[k]} onChange={set(k)} />
                        </Field>
                      ))}
                    </div>
                  </fieldset>

                  <Field label="Anything we should know? (optional)" htmlFor="notes" hint="What feels hardest, past scores, the score you need." error={errors.notes}>
                    <textarea id="notes" rows={3} className={inputClass(errors.notes)} value={form.notes} onChange={set('notes')} />
                  </Field>

                  {/* Honeypot, hidden from people */}
                  <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  <label className="flex items-start gap-3 !text-sm !font-normal !text-slate-600 !mb-0">
                    <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    <span>
                      EduTrack Hub may contact me on WhatsApp about this review. We use your details only for this, as set out in our{' '}
                      <Link href="/privacy" className="text-teal-700 underline">privacy policy</Link>.
                    </span>
                  </label>
                  {errors.consent && <p className="-mt-4 !text-xs font-medium text-red-600">{errors.consent}</p>}

                  {status === 'error' && serverError && (
                    <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 !text-sm text-red-700">{serverError}</p>
                  )}

                  <button type="submit" disabled={status === 'sending'}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-amber-500/20 transition-colors">
                    {status === 'sending' ? 'Sending…' : 'Request my free review'}
                  </button>
                </form>

                {/* Side panel */}
                <aside className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 md:p-8">
                    <h2 className="!text-lg font-bold text-white">What the gap map shows</h2>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                      <li><span className="text-white font-semibold">All 30 tested skills</span>: 11 in Reading &amp; Writing and 19 in Math, each marked strong, shaky or a gap.</li>
                      <li><span className="text-white font-semibold">The top three fixes</span>, ranked by how many points they&apos;re likely worth and how quickly they move.</li>
                      <li><span className="text-white font-semibold">A realistic target</span> for your test date, and the weekly hours it needs.</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 text-sm text-slate-600 space-y-3">
                    <h2 className="!text-lg font-bold text-slate-900">Straight answers</h2>
                    <p className="!text-sm"><span className="font-semibold text-slate-900">Is it really free?</span> Yes. There&apos;s no card and no obligation. If you&apos;d like help afterwards, we&apos;ll offer a trial class.</p>
                    <p className="!text-sm"><span className="font-semibold text-slate-900">Why the official test?</span> It&apos;s written by the people who write the SAT, and it&apos;s adaptive like the real one, so the score means something.</p>
                    <p className="!text-sm"><span className="font-semibold text-slate-900">PSAT student?</span> Bluebook has free PSAT practice tests too. Same process.</p>
                    {waQuestion && (
                      <a href={waQuestion} target="_blank" rel="noopener noreferrer" className="inline-block pt-2 text-teal-700 font-semibold hover:underline">Question first? Ask on WhatsApp</a>
                    )}
                  </div>
                </aside>
              </div>
            </section>
          </>
        )}

        <Footer />
      </div>
    </>
  );
}
