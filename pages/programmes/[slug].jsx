import Head from 'next/head';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/marketing/WhatsAppButton';
import RegionSwitch, { useRegion } from '@/components/marketing/RegionSwitch';
import { PROGRAMMES, EVERY_PLAN, getProgramme } from '@/lib/programmes';
import { SITE_URL, LAUNCH_OFFER, whatsappLink } from '@/lib/site';

// Order on purpose: who it's for → what happens each week → what the parent sees
// → the price → the free first step. The price comes after the value, never first.

export default function ProgrammePage({ slug }) {
  const p = getProgramme(slug);
  const [region, setRegion] = useRegion(p.regions);
  const price = p.prices[region];
  const offerOn = LAUNCH_OFFER.active && LAUNCH_OFFER.headline;
  const wa = whatsappLink(`Hi! I have a question about the ${p.name}.`);
  const others = PROGRAMMES.filter((x) => x.slug !== p.slug);

  return (
    <>
      <Head>
        <title>{`${p.name} | EduTrack Hub`}</title>
        <meta name="description" content={`${p.short} Start with a free consultation and a free assessment class.`} />
        <link rel="canonical" href={`${SITE_URL}/programmes/${p.slug}`} />
      </Head>
      <div className="min-h-screen bg-slate-50">
        <Navigation />

        <section className="pt-32 pb-10">
          <div className="max-w-4xl mx-auto px-5 lg:px-8">
            <Link href="/#programmes" className="!text-sm text-teal-700 font-semibold hover:underline">← All programmes</Link>
            <p className="mt-6 text-sm font-semibold text-teal-700 uppercase tracking-wide">{p.tag}</p>
            <h1 className="mt-2 !text-4xl md:!text-5xl font-bold text-slate-900 leading-tight">{p.name}</h1>
            <p className="mt-4 !text-lg text-slate-600 leading-relaxed max-w-2xl">{p.short}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {p.facts.map((f) => (
                <li key={f} className="rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-sm text-slate-700">{f}</li>
              ))}
            </ul>
            <div className="mt-6"><RegionSwitch region={region} onChange={setRegion} allowed={p.regions} /></div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-5 lg:px-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8">
              <h2 className="!text-xl font-bold text-slate-900">Who it&apos;s for</h2>
              <p className="mt-2 !text-base text-slate-600 leading-relaxed">{p.who}</p>
              <h2 className="mt-8 !text-xl font-bold text-slate-900">What happens each week</h2>
              <ul className="mt-3 space-y-2">
                {p.weekly.map((w) => (
                  <li key={w} className="flex gap-3 !text-base text-slate-600 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-teal-600" />{w}
                  </li>
                ))}
              </ul>
              <h2 className="mt-8 !text-xl font-bold text-slate-900">What you see as a parent</h2>
              <p className="mt-2 !text-base text-slate-600 leading-relaxed">{p.parentSees}</p>
              <p className="mt-3 !text-sm">
                <a href="/samples/sample-parent-report.pdf" target="_blank" rel="noopener" className="text-teal-700 font-semibold hover:underline">See a sample monthly report (PDF)</a>
              </p>
              {p.note && <p className="mt-6 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 !text-sm text-amber-900">{p.note}</p>}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8">
              <h2 className="!text-xl font-bold text-slate-900">Fees</h2>
              {price ? (
                <>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                    <span className="text-3xl font-bold text-slate-900">{price.amount}</span>
                    <span className="text-slate-500">{price.unit}</span>
                  </p>
                  <p className="mt-2 !text-base text-slate-600 leading-relaxed">{price.detail}</p>
                </>
              ) : (
                <p className="mt-2 !text-base text-slate-600">We&apos;ll share the fees on the free consultation call.</p>
              )}
              {offerOn && (
                <p className="mt-4 rounded-xl bg-teal-50 border border-teal-100 px-4 py-3 !text-sm text-teal-900">
                  <span className="font-semibold">{LAUNCH_OFFER.label}:</span> {LAUNCH_OFFER.details} {LAUNCH_OFFER.endsLabel}
                </p>
              )}
              <ul className="mt-6 grid sm:grid-cols-2 gap-2">
                {EVERY_PLAN.map((e) => (
                  <li key={e} className="flex gap-2 !text-sm text-slate-600"><span className="text-teal-600">✓</span>{e}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={`/consultation?programme=${p.slug}&region=${region}`}
                  className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-7 py-3.5 rounded-full font-semibold shadow-lg shadow-amber-500/20 transition-colors">
                  Book a free consultation
                </Link>
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold hover:underline">Ask a question on WhatsApp</a>}
              </div>
            </div>

            <div className="pt-4">
              <h2 className="!text-lg font-bold text-slate-900">Other programmes</h2>
              <ul className="mt-3 grid sm:grid-cols-3 gap-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/programmes/${o.slug}`} className="block rounded-2xl bg-white border border-slate-100 p-4 hover:border-teal-200">
                      <span className="block font-semibold text-slate-900">{o.name}</span>
                      <span className="block mt-1 !text-sm text-slate-500">{o.tag}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <Footer />
        <WhatsAppButton message={`Hi! I'm interested in the ${p.name} at EduTrack Hub.`} />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: PROGRAMMES.map((p) => ({ params: { slug: p.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
