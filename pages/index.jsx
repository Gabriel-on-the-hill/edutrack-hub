import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { PROGRAMMES, REGIONS } from '@/lib/programmes';
import { SITE_URL, LAUNCH_OFFER, TUTOR, whatsappLink } from '@/lib/site';

// Homepage: one job. Show the outcome and the free first step (consultation →
// assessment class). No prices here: each programme page and /fees show them in
// the family's own currency, after the value.

const STEPS = [
  { title: 'Free consultation call', body: 'We talk about your child, the goal and the fees. No obligation.' },
  { title: 'Free assessment class', body: 'A real class in which we find the starting point: what your child knows and where the gaps are.' },
  { title: 'The right tutor and plan', body: 'Your child starts with the tutor and plan that fit them, from the very first paid lesson.' },
  { title: 'A report you can read', body: 'Every month: is your child on track, what changed, and the one thing we need from you.' },
];

const FAQ = [
  { q: 'How much does it cost?', a: 'Every fee is on our fees page, for families in Nigeria and in the UK, US and Canada. The consultation call and the assessment class are free.' },
  { q: 'Why an assessment class before lessons?', a: 'So we never guess. We find your child\'s starting point first, then choose the tutor and plan that fit. Lesson one is already the right lesson.' },
  { q: 'Are lessons online?', a: 'Yes. All lessons are live on Google Meet with a real tutor. Nothing is pre-recorded.' },
  { q: 'How big are the groups?', a: 'Small group classes have at most 4 students. Everything else is one-to-one.' },
  { q: 'We live in the UK, US or Canada. Can you teach us?', a: 'Yes. Families abroad have one-to-one lessons, billed monthly in US dollars, at a weekly time that works across time zones.' },
  { q: 'What will I actually see as a parent?', a: 'A monthly report that says plainly whether your child is on track, which skills moved, and what we need from you, backed by numbers, not adjectives.' },
];

export default function Home() {
  const offerOn = LAUNCH_OFFER.active && LAUNCH_OFFER.headline;
  const wa = whatsappLink();

  return (
    <>
      <Head>
        <title>EduTrack Hub | Live online tutoring, planned from a real assessment</title>
        <meta name="description" content="Live online tutoring for SAT, PSAT and school subjects, for families in Nigeria and in the UK, US and Canada. Start with a free consultation and a free assessment class." />
        <link rel="canonical" href={`${SITE_URL}/`} />
      </Head>
      <div className="min-h-screen bg-slate-50">
        <Navigation />

        {/* Hero */}
        <section className="pt-28 md:pt-32 pb-16 bg-white">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            {offerOn && (
              <Link href="/fees" className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-teal-50 border border-teal-100 px-5 py-3 text-teal-900 hover:border-teal-200">
                <span className="text-xs font-bold uppercase tracking-wide text-teal-700">{LAUNCH_OFFER.label}</span>
                <span className="font-semibold">{LAUNCH_OFFER.headline}</span>
                {LAUNCH_OFFER.endsLabel && <span className="text-sm text-teal-700">{LAUNCH_OFFER.endsLabel}</span>}
              </Link>
            )}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Education beyond the classroom</p>
                <h1 className="mt-4 !text-4xl md:!text-5xl lg:!text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight">
                  Know where your child stands. Then close the gap.
                </h1>
                <p className="mt-6 !text-lg text-slate-600 leading-relaxed max-w-xl">
                  Live online tutoring for SAT, PSAT and school subjects, for families in Nigeria and in the UK, US and Canada.
                  Every student starts with a free consultation and a free assessment class, so the tutor and the plan are
                  right from the first lesson.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/consultation"
                    className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-amber-500/20 transition-colors">
                    Book a free consultation
                  </Link>
                  <Link href="/fees" className="text-teal-700 font-semibold hover:underline">See the fees</Link>
                </div>
                <p className="mt-4 !text-sm text-slate-500">Free consultation · free assessment class · no card needed</p>
              </div>
              <figure className="relative mx-auto w-full max-w-md">
                <div className="rounded-3xl bg-slate-100 p-4 md:p-6">
                  <Image src="/samples/sample-gap-map.webp" alt="Sample one-page SAT gap map showing strong, shaky and gap skills and the top three fixes"
                    width={1200} height={1697} priority className="rounded-xl shadow-xl shadow-slate-900/10 w-full h-auto" />
                </div>
                <figcaption className="mt-3 !text-sm text-slate-500 text-center">
                  What an SAT family receives after the assessment (sample, fictional student).
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <h2 className="!text-3xl md:!text-4xl font-bold text-slate-900">How it works</h2>
            <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="bg-white rounded-2xl border border-slate-100 p-6">
                  <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold">{i + 1}</span>
                  <h3 className="mt-4 !text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 !text-sm text-slate-600 leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Programmes */}
        <section id="programmes" className="py-20 bg-white scroll-mt-24">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <h2 className="!text-3xl md:!text-4xl font-bold text-slate-900">Programmes</h2>
            <p className="mt-3 !text-lg text-slate-600 max-w-2xl">Not sure which fits? That&apos;s what the free consultation is for.</p>
            <ul className="mt-10 grid md:grid-cols-2 gap-6">
              {PROGRAMMES.map((p) => (
                <li key={p.slug}>
                  <Link href={`/programmes/${p.slug}`}
                    className={`group flex h-full flex-col rounded-3xl border p-6 md:p-8 transition-colors ${p.featured ? 'border-teal-200 bg-teal-50/60 hover:border-teal-300' : 'border-slate-100 bg-slate-50 hover:border-teal-200'}`}>
                    <span className="text-xs font-bold uppercase tracking-wide text-teal-700">{p.tag}</span>
                    <span className="mt-2 text-2xl font-bold text-slate-900">{p.name}</span>
                    <span className="mt-2 !text-base text-slate-600 leading-relaxed">{p.short}</span>
                    <span className="mt-4 flex flex-wrap gap-2">
                      {p.regions.map((r) => (
                        <span key={r} className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">{REGIONS[r].label}</span>
                      ))}
                    </span>
                    <span className="mt-auto pt-6 font-semibold text-teal-700 group-hover:underline">See details and fees →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What parents see */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 mx-auto w-full max-w-md">
              <a href="/samples/sample-parent-report.pdf" target="_blank" rel="noopener" className="block rounded-3xl bg-white border border-slate-100 p-4 md:p-6">
                <Image src="/samples/sample-parent-report.webp" alt="Sample one-page monthly report: an on-track verdict, a practice score chart, a skill map and one task for the parent"
                  width={1200} height={1697} className="rounded-xl shadow-xl shadow-slate-900/10 w-full h-auto" />
              </a>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="!text-3xl md:!text-4xl font-bold text-slate-900">A report that answers your real questions</h2>
              <p className="mt-4 !text-lg text-slate-600 leading-relaxed">Once a month, one page:</p>
              <ul className="mt-4 space-y-3">
                {[
                  ['Is my child on track?', 'Worked out from real results against the target, with the numbers shown.'],
                  ['What actually changed?', 'The skills that moved, with evidence, and where marks were lost.'],
                  ['What do you need from me?', 'One clear, dated thing to do at home.'],
                ].map(([t, b]) => (
                  <li key={t} className="rounded-2xl bg-white border border-slate-100 p-4">
                    <span className="block font-semibold text-slate-900">{t}</span>
                    <span className="block mt-1 !text-sm text-slate-600">{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 !text-sm text-slate-500">
                Sample for a fictional student. <a href="/samples/sample-parent-report.pdf" target="_blank" rel="noopener" className="text-teal-700 font-semibold hover:underline">Open the PDF</a>
              </p>
            </div>
          </div>
        </section>

        {/* Who teaches */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-5 lg:px-8 grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2">
              <Image src={TUTOR.photo} alt={`${TUTOR.name}, ${TUTOR.role}`} width={1024} height={937}
                className="rounded-3xl w-full h-auto object-cover" />
            </div>
            <div className="md:col-span-3">
              <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Who teaches</p>
              <h2 className="mt-2 !text-3xl md:!text-4xl font-bold text-slate-900">{TUTOR.name}</h2>
              <p className="mt-1 !text-lg text-slate-500">{TUTOR.role}</p>
              {TUTOR.bio && <p className="mt-5 !text-lg text-slate-600 leading-relaxed">{TUTOR.bio}</p>}
              <p className="mt-5 !text-base text-slate-600 leading-relaxed">
                Every tutor is chosen for your child after the assessment class, and works from the same plan and the same monthly report.
              </p>
            </div>
          </div>
        </section>

        {/* Straight answers */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-5 lg:px-8">
            <h2 className="!text-3xl md:!text-4xl font-bold text-slate-900">Straight answers</h2>
            <div className="mt-8 divide-y divide-slate-200 rounded-3xl bg-white border border-slate-100">
              {FAQ.map((f) => (
                <details key={f.q} className="group p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                    {f.q}
                    <span className="text-teal-600 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 !text-base text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final call to action */}
        <section className="pb-24">
          <div className="max-w-5xl mx-auto px-5 lg:px-8">
            <div className="rounded-3xl bg-slate-900 px-6 py-12 md:px-12 text-center">
              <h2 className="!text-3xl md:!text-4xl font-bold text-white">Start with a free consultation.</h2>
              <p className="mt-4 !text-lg text-slate-300 max-w-xl mx-auto">A short call, then a free assessment class. You&apos;ll know where your child stands before you pay for anything.</p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <Link href="/consultation"
                  className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors">
                  Book a free consultation
                </Link>
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-teal-300 font-semibold hover:underline">Or message us on WhatsApp</a>}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
