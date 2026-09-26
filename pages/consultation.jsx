import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { whatsappLink, SITE_URL } from '@/lib/site';
import { PROGRAMMES, REGIONS, SAT_SLUGS } from '@/lib/programmes';

// Every new family starts here: free consultation call → free assessment class
// (the student's baseline) → the right tutor and plan from the first lesson.

// Test dates: keep in step with the launch plan (Section 1, key dates).
const TARGET_TESTS = [
  'SAT, 5 Dec 2026',
  'SAT, 6 Mar 2027',
  'A later SAT',
  'PSAT 10',
  'PSAT 8/9',
  'Not sure yet',
];

const STEPS = [
  {
    title: 'Free consultation call',
    body: 'A short call about your child, their goals and the fees. Ask us anything; there\'s no obligation.',
  },
  {
    title: 'Free assessment class',
    body: 'A real class in which we find your child\'s starting point: what they already know, where the gaps are and how they learn best.',
  },
  {
    title: 'The right tutor and plan from day one',
    body: 'Because we already know the starting point, the first paid lesson begins with the right tutor and a plan built for your child.',
  },
];

const EMPTY = {
  role: 'parent', region: 'ng', programme: '', studentName: '', whatsapp: '', email: '',
  grade: '', subjects: '', targetTest: '', hasResult: 'no', practiceTest: '',
  total: '', rw: '', math: '', notes: '', consent: false, website: '',
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

function Choice({ name, value, current, onChange, children }) {
  const on = current === value;
  return (
    <label className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium ${on ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600'}`}>
      <input type="radio" name={name} value={value} checked={on} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

const inputClass = (err) =>
  `w-full rounded-xl border ${err ? 'border-red-400' : 'border-slate-200'} bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20`;

export default function Consultation() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [serverError, setServerError] = useState('');

  // Pre-select from links such as /consultation?programme=sat-programme&region=intl
  useEffect(() => {
    if (!router.isReady) return;
    const { programme, region } = router.query;
    setForm((f) => {
      const next = { ...f };
      if (region === 'ng' || region === 'intl') next.region = region;
      const p = PROGRAMMES.find((x) => x.slug === programme);
      if (p) {
        next.programme = p.slug;
        if (!p.regions.includes(next.region)) next.region = p.regions[0];
      }
      return next;
    });
  }, [router.isReady, router.query]);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: v };
      // A programme that isn't offered in the chosen region is cleared.
      if (k === 'region') {
        const p = PROGRAMMES.find((x) => x.slug === f.programme);
        if (p && !p.regions.includes(v)) next.programme = '';
      }
      return next;
    });
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const isSat = SAT_SLUGS.includes(form.programme);
  const hasResult = isSat && form.hasResult === 'yes';
  const options = PROGRAMMES.filter((p) => p.regions.includes(form.region));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setServerError('');
    const body = { ...form };
    if (!isSat) Object.assign(body, { targetTest: '', hasResult: undefined });
    if (!hasResult) Object.assign(body, { practiceTest: '', total: '', rw: '', math: '' });
    if (isSat) body.subjects = '';
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
    `Hi! I just booked a free consultation for ${form.studentName || 'my child'}. Here is the score report:`
  );
  const waQuestion = whatsappLink('Hi! I have a question before booking a consultation.');

  return (
    <>
      <Head>
        <title>Book a free consultation | EduTrack Hub</title>
        <meta name="description" content="Start with a free consultation call and a free assessment class. We find your child's starting point, so the tutor and the plan are right from the first lesson." />
        <link rel="canonical" href={`${SITE_URL}/consultation`} />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <Navigation />

        {status === 'done' ? (
          <section className="pt-32 pb-24">
            <div className="max-w-2xl mx-auto px-5">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
                <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Request received</p>
                <h1 className="mt-2 !text-3xl font-bold text-slate-900">Thank you. We&apos;ll be in touch.</h1>
                <p className="mt-4 !text-base text-slate-600 leading-relaxed">
                  We&apos;ll message you on WhatsApp to set a time for the consultation call. After that comes the free
                  assessment class, so the tutor and the plan are right from the first lesson.
                </p>
                {hasResult && (
                  <>
                    <p className="mt-4 !text-base text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-900">One more thing:</span>{' '}please send us the score report
                      (a screenshot or the PDF from My Practice) so we can read the skill breakdown before we talk.
                    </p>
                    {waReport && (
                      <a href={waReport} target="_blank" rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-7 py-3.5 rounded-full font-semibold shadow-lg shadow-amber-500/20 transition-colors">
                        Send the report on WhatsApp
                      </a>
                    )}
                  </>
                )}
                {isSat && !hasResult && (
                  <p className="mt-4 !text-base text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-900">Optional:</span>{' '}if your child takes a free full-length
                    practice test in College Board&apos;s Bluebook app before the assessment, we can go further with the result.
                  </p>
                )}
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/fees" className="text-teal-700 font-semibold hover:underline">See the fees</Link>
                  <Link href="/" className="text-teal-700 font-semibold hover:underline">Back to the home page</Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="pt-32 pb-12">
              <div className="max-w-6xl mx-auto px-5 lg:px-8">
                <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">How every student starts</p>
                <h1 className="mt-3 !text-4xl md:!text-5xl font-bold text-slate-900 max-w-3xl leading-tight">
                  A free consultation, then a free assessment class.
                </h1>
                <p className="mt-5 !text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Before any paid lesson, we find out where your child really is. That way the right tutor and the right
                  plan are in place from the very first lesson.
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
              </div>
            </section>

            <section id="form" className="pb-24">
              <div className="max-w-6xl mx-auto px-5 lg:px-8 grid lg:grid-cols-5 gap-10">
                <form onSubmit={submit} noValidate className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="!text-2xl font-bold text-slate-900">Book a free consultation</h2>
                    <p className="mt-1 !text-sm text-slate-500">Takes about two minutes.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <fieldset>
                      <legend className="block text-sm font-semibold text-slate-800 mb-2">I am the</legend>
                      <div className="flex gap-3">
                        <Choice name="role" value="parent" current={form.role} onChange={set('role')}>Parent</Choice>
                        <Choice name="role" value="student" current={form.role} onChange={set('role')}>Student</Choice>
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="block text-sm font-semibold text-slate-800 mb-2">We live in</legend>
                      <div className="flex flex-wrap gap-3">
                        {Object.values(REGIONS).map((r) => (
                          <Choice key={r.key} name="region" value={r.key} current={form.region} onChange={set('region')}>{r.label}</Choice>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  <Field label="What are you interested in?" htmlFor="programme" error={errors.programme}>
                    <select id="programme" className={inputClass(errors.programme)} value={form.programme} onChange={set('programme')}>
                      <option value="">Not sure yet</option>
                      {options.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                    </select>
                  </Field>

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
                    <Field label="Class or grade" htmlFor="grade" hint="e.g. Primary 5, JSS 2, SS 2, Year 9, Grade 11" error={errors.grade}>
                      <input id="grade" className={inputClass(errors.grade)} value={form.grade} onChange={set('grade')} />
                    </Field>
                  </div>

                  {!isSat && (
                    <Field label="Which subjects?" htmlFor="subjects" hint="e.g. Maths and English" error={errors.subjects}>
                      <input id="subjects" className={inputClass(errors.subjects)} value={form.subjects} onChange={set('subjects')} />
                    </Field>
                  )}

                  {isSat && (
                    <div className="space-y-5 rounded-2xl bg-slate-50 p-5">
                      <Field label="Which test are you aiming for?" htmlFor="targetTest" error={errors.targetTest}>
                        <select id="targetTest" className={inputClass(errors.targetTest)} value={form.targetTest} onChange={set('targetTest')}>
                          <option value="">Choose…</option>
                          {TARGET_TESTS.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </Field>
                      <fieldset>
                        <legend className="block text-sm font-semibold text-slate-800 mb-2">Has the student taken a Bluebook practice test, or a real SAT or PSAT?</legend>
                        <div className="flex flex-wrap gap-3">
                          <Choice name="hasResult" value="yes" current={form.hasResult} onChange={set('hasResult')}>Yes</Choice>
                          <Choice name="hasResult" value="no" current={form.hasResult} onChange={set('hasResult')}>Not yet</Choice>
                        </div>
                        <p className="mt-2 !text-sm text-slate-500">
                          {hasResult ? 'Great: the assessment starts from that result.' : 'No problem: we assess the student in the free assessment class.'}
                        </p>
                      </fieldset>
                      {hasResult && (
                        <>
                          <Field label="Which test?" htmlFor="practiceTest" hint="e.g. SAT Practice Test 4, or the August SAT" error={errors.practiceTest}>
                            <input id="practiceTest" className={inputClass(errors.practiceTest)} value={form.practiceTest} onChange={set('practiceTest')} />
                          </Field>
                          <fieldset>
                            <legend className="block text-sm font-semibold text-slate-800 mb-2">Scores (if you have them to hand)</legend>
                            <div className="grid grid-cols-3 gap-3">
                              {[['total', 'Total', '400–1600'], ['rw', 'R&W', '200–800'], ['math', 'Math', '200–800']].map(([k, label, range]) => (
                                <Field key={k} label={<span className="text-xs font-medium text-slate-600">{label} <span className="text-slate-400">{range}</span></span>} htmlFor={k} error={errors[k]}>
                                  <input id={k} type="number" inputMode="numeric" step="10" className={inputClass(errors[k])} value={form[k]} onChange={set(k)} />
                                </Field>
                              ))}
                            </div>
                          </fieldset>
                        </>
                      )}
                    </div>
                  )}

                  <Field label="Anything we should know? (optional)" htmlFor="notes" hint="What feels hardest, recent results, a good time to call." error={errors.notes}>
                    <textarea id="notes" rows={3} className={inputClass(errors.notes)} value={form.notes} onChange={set('notes')} />
                  </Field>

                  <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  <label className="flex items-start gap-3 !text-sm !font-normal !text-slate-600 !mb-0">
                    <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    <span>
                      EduTrack Hub may contact me on WhatsApp about this request. We use your details only for this, as set out in our{' '}
                      <Link href="/privacy" className="text-teal-700 underline">privacy policy</Link>.
                    </span>
                  </label>
                  {errors.consent && <p className="-mt-4 !text-xs font-medium text-red-600">{errors.consent}</p>}

                  {status === 'error' && serverError && (
                    <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 !text-sm text-red-700">{serverError}</p>
                  )}

                  <button type="submit" disabled={status === 'sending'}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-amber-500/20 transition-colors">
                    {status === 'sending' ? 'Sending…' : 'Book my free consultation'}
                  </button>
                </form>

                <aside className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 md:p-8">
                    <h2 className="!text-lg font-bold text-white">What the assessment gives you</h2>
                    <ul className="mt-4 space-y-3 !text-sm leading-relaxed">
                      <li><span className="text-white font-semibold">A clear starting point</span>: what your child already knows and where the gaps are.</li>
                      <li><span className="text-white font-semibold">The right tutor</span>, chosen before the first paid lesson.</li>
                      <li><span className="text-white font-semibold">For SAT and PSAT</span>: a one-page gap map of all 30 tested skills and a realistic target score.</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-3">
                    <h2 className="!text-lg font-bold text-slate-900">Straight answers</h2>
                    <p className="!text-sm text-slate-600"><span className="font-semibold text-slate-900">Is it really free?</span> Yes. The consultation call and the assessment class are both free, with no card and no obligation.</p>
                    <p className="!text-sm text-slate-600"><span className="font-semibold text-slate-900">How much are lessons?</span> Every fee is on our <Link href="/fees" className="text-teal-700 underline">fees page</Link>, so you know before we talk.</p>
                    <p className="!text-sm text-slate-600"><span className="font-semibold text-slate-900">Where are lessons held?</span> Live online, on Google Meet.</p>
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
