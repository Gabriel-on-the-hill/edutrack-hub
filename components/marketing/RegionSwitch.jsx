import { useEffect, useState } from 'react';
import { REGIONS } from '@/lib/programmes';

// Remembers the family's region for this visit, so prices show in one currency only.
const KEY = 'eth_region';

export function useRegion(allowed = ['ng', 'intl']) {
  const [region, setRegion] = useState(allowed[0]);
  useEffect(() => {
    let saved = null;
    try { saved = window.sessionStorage.getItem(KEY); } catch { /* storage unavailable */ }
    const fromUrl = new URLSearchParams(window.location.search).get('region');
    const pick = [fromUrl, saved].find((r) => r && allowed.includes(r));
    if (pick) setRegion(pick);
  }, [allowed.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (r) => {
    setRegion(r);
    try { window.sessionStorage.setItem(KEY, r); } catch { /* storage unavailable */ }
  };
  return [region, choose];
}

export default function RegionSwitch({ region, onChange, allowed = ['ng', 'intl'] }) {
  if (allowed.length < 2) {
    return <p className="!text-sm font-semibold text-slate-500">For families in {REGIONS[allowed[0]].label}</p>;
  }
  return (
    <div role="tablist" aria-label="Where you live" className="inline-flex rounded-full bg-slate-100 p-1">
      {allowed.map((r) => (
        <button
          key={r}
          type="button"
          role="tab"
          aria-selected={region === r}
          onClick={() => onChange(r)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${region === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {REGIONS[r].label} <span className="text-slate-400">({REGIONS[r].currency})</span>
        </button>
      ))}
    </div>
  );
}
