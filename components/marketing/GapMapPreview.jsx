// A readable, live-HTML preview of the sample SAT gap map for the homepage hero.
// Numbers come from scripts/reports/sample_review.json (fictional student), so
// the preview and the downloadable PDF always tell the same story.

const SCORES = [
  { label: 'Total', value: '1180' },
  { label: 'Reading & Writing', value: '610' },
  { label: 'Math', value: '570' },
];

const SKILLS = [
  { name: 'Words in Context', score: '6/7', status: 'strong' },
  { name: 'Central Ideas and Details', score: '4/5', status: 'strong' },
  { name: 'Linear functions', score: '3/4', status: 'shaky' },
  { name: 'Boundaries', score: '2/7', status: 'gap' },
  { name: 'Nonlinear functions', score: '2/5', status: 'gap' },
];

const FIXES = [
  { name: 'Boundaries', note: 'Four sentence-joining rules, 15 practice items a day for two weeks.' },
  { name: 'Nonlinear functions', note: 'Two lessons on exponential forms and what each number means.' },
  { name: 'Nonlinear equations', note: 'Factoring, the quadratic formula, and when to let Desmos solve it.' },
];

const CHIP = {
  strong: 'bg-teal-50 text-teal-700',
  shaky: 'bg-slate-100 text-slate-600',
  gap: 'bg-rose-50 text-rose-700',
};
const LABEL = { strong: 'Strong', shaky: 'Shaky', gap: 'Gap' };

export default function GapMapPreview() {
  return (
    <figure className="relative mx-auto w-full max-w-md">
      <div className="relative">
      {/* Second sheet behind, for a sense of a real document */}
      <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-3xl bg-teal-100/70" />

      <div className="relative rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/10 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">SAT gap map</p>
            <p className="mt-1 text-sm text-slate-500">Grade 11 · Practice Test 4 · aiming for 5 Dec</p>
          </div>
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">Sample</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {SCORES.map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-50 px-2.5 py-2">
              <p className="text-[10px] leading-tight font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-lg md:text-xl font-bold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-teal-600 px-3 py-2.5 text-white">
          <p className="text-xs font-medium text-teal-50">Realistic target by 5 December</p>
          <p className="shrink-0 whitespace-nowrap text-lg font-bold tabular-nums">1300–1340</p>
        </div>

        <ul className="mt-4 divide-y divide-slate-100">
          {SKILLS.map((k) => (
            <li key={k.name} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="text-slate-700">{k.name}</span>
              <span className="flex items-center gap-2">
                <span className="tabular-nums text-slate-400">{k.score}</span>
                <span className={`w-14 text-center rounded-full px-2 py-0.5 text-xs font-semibold ${CHIP[k.status]}`}>{LABEL[k.status]}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">Fix these first</p>
          <ol className="mt-2 space-y-2">
            {FIXES.map((f, i) => (
              <li key={f.name} className="flex gap-3 text-sm">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">{i + 1}</span>
                <span className="text-slate-600"><span className="font-semibold text-slate-900">{f.name}.</span> {f.note}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      </div>

      <figcaption className="relative mt-5 !text-sm text-slate-500 text-center">
        What an SAT family receives after the assessment (fictional student).{' '}
        <a href="/samples/sample-gap-map.pdf" target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline whitespace-nowrap">See the full sample</a>
      </figcaption>
    </figure>
  );
}
