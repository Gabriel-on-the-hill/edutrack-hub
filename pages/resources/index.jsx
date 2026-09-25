// pages/resources/index.jsx
// Login-gated shared content library (SAT practice apps, tools, downloads).
// Visible to any signed-in user; guests are redirected to /login by withAuth.

import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { withAuth } from '@/hooks/useAuth';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { sharedResources } from '@/lib/resources';

function ResourceCard({ item }) {
  const isLive = item.href && !item.comingSoon;

  const inner = (
    <div
      className={`h-full flex flex-col p-7 rounded-3xl border transition-all duration-300 ${
        isLive
          ? 'bg-white border-slate-100 hover:shadow-xl hover:border-transparent cursor-pointer'
          : 'bg-slate-50 border-dashed border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md">
          {item.subject}
        </span>
        {!isLive && (
          <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">{item.description}</p>
      <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{item.type}</span>
        {isLive ? (
          <span className="text-sm font-bold text-teal-600">Open →</span>
        ) : (
          <span className="text-sm font-medium text-slate-400">Not yet available</span>
        )}
      </div>
    </div>
  );

  if (!isLive) return inner;

  // External links open in a new tab; internal paths use client-side nav.
  const isExternal = /^https?:\/\//.test(item.href);
  if (isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="group">
        {inner}
      </a>
    );
  }
  return (
    <Link href={item.href} className="group">
      {inner}
    </Link>
  );
}

function ResourcesLibrary() {
  const subjects = useMemo(() => {
    const set = new Set(sharedResources.map((r) => r.subject));
    return ['All', ...Array.from(set)];
  }, []);
  const [filter, setFilter] = useState('All');

  const visible = filter === 'All'
    ? sharedResources
    : sharedResources.filter((r) => r.subject === filter);

  return (
    <>
      <Head>
        <title>Resource Library — EduTrack Hub</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-slate-50 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="mb-10">
            <p className="text-teal-600 font-semibold mb-2">Members Only</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Resource Library</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Practice apps, tools and downloads for enrolled students. New resources are added regularly.
            </p>
          </div>

          {/* Filters */}
          {subjects.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    filter === s
                      ? 'bg-teal-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-500">No resources here yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((item, i) => (
                <ResourceCard key={i} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default withAuth(ResourcesLibrary);
