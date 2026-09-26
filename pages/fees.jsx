import Head from 'next/head';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/marketing/WhatsAppButton';
import RegionSwitch, { useRegion } from '@/components/marketing/RegionSwitch';
import { PROGRAMMES, EVERY_PLAN, REGIONS } from '@/lib/programmes';
import { SITE_URL, LAUNCH_OFFER } from '@/lib/site';

export default function Fees() {
  const [region, setRegion] = useRegion(['ng', 'intl']);
  const rows = PROGRAMMES.filter((p) => p.regions.includes(region));
  const offerOn = LAUNCH_OFFER.active && LAUNCH_OFFER.headline;

  return (
    <>
      <Head>
        <title>Fees | EduTrack Hub</title>
        <meta name="description" content="EduTrack Hub fees for families in Nigeria and in the UK, US and Canada. Every student starts with a free consultation and a free assessment class." />
        <link rel="canonical" href={`${SITE_URL}/fees`} />
      </Head>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <section className="pt-32 pb-8">
          <div className="max-w-4xl mx-auto px-5 lg:px-8">
            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Fees</p>
            <h1 className="mt-2 !text-4xl md:!text-5xl font-bold text-slate-900 leading-tight">Clear fees, before we talk.</h1>
            <p className="mt-4 !text-lg text-slate-600 leading-relaxed max-w-2xl">
              Every student starts with a free consultation call and a free assessment class. Lessons are billed monthly.
            </p>
            <div className="mt-6"><RegionSwitch region={region} onChange={setRegion} /></div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-5 lg:px-8 space-y-4">
            {offerOn && (
              <p className="rounded-2xl bg-teal-50 border border-teal-100 px-5 py-4 !text-base text-teal-900">
                <span className="font-semibold">{LAUNCH_OFFER.headline}</span> {LAUNCH_OFFER.details} {LAUNCH_OFFER.endsLabel}
              </p>
            )}
            {rows.map((p) => {
              const price = p.prices[region];
              return (
                <article key={p.slug} className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 grid md:grid-cols-5 gap-4 md:gap-8">
                  <div className="md:col-span-3">
                    <h2 className="!text-xl font-bold text-slate-900">{p.name}</h2>
                    <p className="mt-1 !text-base text-slate-600">{p.short}</p>
                    <Link href={`/programmes/${p.slug}?region=${region}`} className="mt-3 inline-block !text-sm text-teal-700 font-semibold hover:underline">What happens each week →</Link>
                  </div>
                  <div className="md:col-span-2">
                    {price ? (
                      <>
                        <p className="flex flex-wrap items-baseline gap-x-2"><span className="text-2xl font-bold text-slate-900">{price.amount}</span><span className="!text-sm text-slate-500">{price.unit}</span></p>
                        <p className="mt-2 !text-sm text-slate-600 leading-relaxed">{price.detail}</p>
                      </>
                    ) : (
                      <p className="!text-sm text-slate-600">Shared on the free consultation call.</p>
                    )}
                  </div>
                </article>
              );
            })}
            <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 md:p-8">
              <h2 className="!text-lg font-bold text-white">Every plan includes</h2>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                {EVERY_PLAN.map((e) => <li key={e} className="!text-sm">✓ {e}</li>)}
              </ul>
              <Link href={`/consultation?region=${region}`}
                className="mt-6 inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-7 py-3.5 rounded-full font-semibold transition-colors">
                Book a free consultation
              </Link>
            </div>
            <p className="!text-xs text-slate-500">Prices for {REGIONS[region].label} families. Fees are per month unless stated.</p>
          </div>
        </section>
        <Footer />
        <WhatsAppButton message="Hi! I'm looking at the EduTrack Hub fees and have a question." />
      </div>
    </>
  );
}
