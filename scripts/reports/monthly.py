"""Parent monthly report: one page that answers a parent's three questions.

  1. Is my child on track for the target by test day?   (computed, with the sums shown)
  2. What actually changed this month?                   (evidence: counts and scores)
  3. What do I need to do?                               (one dated ask)

Usage:  python monthly.py report.json [out_dir]
Writes <name>.html, <name>.pdf and <name>.whatsapp.txt (a short message to send with the PDF).

The tutor writes only judgement: worked_on, next_month, at_home, tutor_note.
Everything else is numbers that can come straight from the Mastery app, Bluebook's
My Practice review and the class register. See sample_monthly.json.
"""
import datetime as dt
import html
import json
import sys
from pathlib import Path

from skills import DOMAINS, SKILLS, STATUS, status_for
from gapmap import CSS, to_pdf

NAMES = {c: n for c, d, n in SKILLS}
ORDER = ["gap", "shaky", "strong"]
REASONS = {
    "concept": "Didn't know the rule or method",
    "misread": "Misread the question or text",
    "time": "Ran out of time or rushed",
    "careless": "Careless slip (knew it)",
}

EXTRA_CSS = """
.page { gap: 3.3mm; padding-top: 10mm; }
.who b { font-size: 9.5pt; }
.verdict { border-radius: 3.5mm; padding: 3.2mm 4.5mm; display: grid; grid-template-columns: 1fr auto; gap: 4mm; align-items: center; }
.verdict.on { background: #0d9488; color: #fff; } .verdict.push { background: #fff7ed; border: 1.5px solid #f59e0b; } .verdict.risk { background: #fef2f2; border: 1.5px solid #ef4444; } .verdict.at { background: #0f766e; color: #fff; }
.verdict .tag { font-size: 7.5pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .85; }
.verdict h1 { font-size: 15pt; font-weight: 800; letter-spacing: -.02em; margin: .5mm 0 1mm; }
.verdict p { font-size: 8.8pt; line-height: 1.45; }
.mini { display: grid; grid-template-columns: repeat(3, auto); gap: 2mm; }
.mini div { background: rgba(255,255,255,.14); border-radius: 2.5mm; padding: 2mm 3mm; min-width: 23mm; }
.verdict.push .mini div, .verdict.risk .mini div { background: #fff; border: 1px solid #e2e8f0; }
.mini label { color: inherit; opacity: .8; } .mini b { font-size: 13pt; font-weight: 800; display: block; }
.mini .flag { color: #b91c1c; font-size: 7pt; font-weight: 700; display: block; }
.verdict.on .mini .flag, .verdict.at .mini .flag { color: #fde68a; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
.chart svg { width: 100%; height: auto; display: block; }
.cap { font-size: 7.5pt; color: #64748b; margin-top: 1mm; line-height: 1.35; }
.map .sec { display: grid; grid-template-columns: 40mm 1fr; gap: 2mm; align-items: center; margin-bottom: 1.3mm; }
.map .sec > span { font-size: 7.6pt; color: #475569; }
.squares { display: flex; gap: 1.3mm; }
.sq { width: 4.4mm; height: 4.4mm; border-radius: 1mm; position: relative; display: block; }
.sq.strong { background: #14b8a6; } .sq.shaky { background: #cbd5e1; } .sq.gap { background: #f87171; } .sq.unseen { background: #fff; border: 1px dashed #cbd5e1; }
.sq.moved { outline: 1.4px solid #0f172a; outline-offset: .6mm; }
.tally { display: flex; gap: 4mm; font-size: 8.3pt; margin-top: 1.5mm; }
.tally b { font-weight: 800; }
.tally .up { color: #0f766e; font-weight: 700; }
ul.plain { list-style: none; display: grid; gap: 1.4mm; }
ul.plain li { padding-left: 4mm; position: relative; line-height: 1.38; font-size: 8.6pt; }
ul.plain li::before { content: ''; position: absolute; left: 0; top: 1.8mm; width: 1.6mm; height: 1.6mm; border-radius: 50%; background: #0d9488; }
.moved td { font-size: 8.8pt; } .moved td:nth-child(2) { width: 38mm; text-align: right; white-space: nowrap; }
.moved .ev { display: block; font-size: 7.3pt; color: #64748b; }
.arrow { color: #94a3b8; margin: 0 1mm; }
.bars { display: grid; gap: 1.6mm; }
.bar { display: grid; grid-template-columns: 1fr 30mm 7mm; gap: 2mm; align-items: center; font-size: 8.5pt; }
.bar .track { height: 3.2mm; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.bar .fill { height: 100%; background: #475569; border-radius: 99px; } .bar.top .fill { background: #0d9488; }
.bar .n { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
.home { background: #fffbeb; border: 1px solid #fde68a; border-radius: 3mm; padding: 2.5mm 4mm; }
.home h2 { color: #92400e; } .home p { font-size: 9.2pt; line-height: 1.45; }
.note { border-left: 3px solid #0d9488; padding: .5mm 0 .5mm 4mm; line-height: 1.45; color: #334155; font-size: 8.9pt; }
.note .sig { display: block; margin-top: 1mm; font-weight: 700; color: #0f172a; }
"""


def d(s):
    return dt.date.fromisoformat(s)


def fmt_day(x):
    return f"{x.day} {x.strftime('%b')}"


def pace(data):
    """Work out the on-track verdict from real numbers only."""
    prac = data.get("practice", [])
    target = data["target"]["score"]
    test_day = d(data["test_date"])
    today = d(data["report_date"])
    weeks_left = max((test_day - today).days / 7, 0.1)
    if not prac:
        return None
    first, last = prac[0], prac[-1]
    now = last["total"]
    weeks_done = max((d(last["date"]) - d(first["date"])).days / 7, 0)
    gained = now - first["total"]
    rate = gained / weeks_done if weeks_done >= 1 else None
    need = max(target - now, 0)
    need_rate = need / weeks_left
    if now >= target:
        kind, head = "at", f"At target: {now} against a target of {target}"
    elif rate is None:
        kind, head = "push", f"Too early to call: {need} points to go"
    elif rate >= need_rate:
        kind, head = "on", f"On track for {target} by {fmt_day(test_day)}"
    elif rate >= 0.6 * need_rate:
        kind, head = "push", f"Close, but needs a push to reach {target}"
    else:
        kind, head = "risk", f"At risk of missing {target} at the current pace"
    parts = [f"Started at {first['total']} on {fmt_day(d(first['date']))}, now {now}"]
    if rate is not None:
        parts[0] += f": {'up' if gained >= 0 else 'down'} {abs(gained)} in {round(weeks_done)} weeks ({rate:+.0f} a week)"
    if need:
        parts.append(f"To reach {target} in the {round(weeks_left)} weeks left needs about {need_rate:+.0f} a week")
    return {"kind": kind, "head": head, "text": ". ".join(parts) + ".", "now": now,
            "weeks_left": round(weeks_left), "days_left": (test_day - today).days}


def chart(data):
    prac = data.get("practice", [])
    target = data["target"]["score"]
    if not prac:
        return '<p class="cap">No practice tests yet.</p>'
    W, H, pl, pr, pt, pb, inset = 360, 150, 34, 44, 16, 24, 12
    vals = [p["total"] for p in prac]
    lo = max(400, (min(vals) // 100) * 100 - 50)
    hi = min(1600, max(max(vals), target) // 100 * 100 + 100)
    n = len(prac)
    x = lambda i: pl + inset + (W - pl - pr - 2 * inset) * (i / (n - 1) if n > 1 else 0.5)
    y = lambda v: pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo))
    grid = "".join(
        f'<line x1="{pl}" x2="{W-pr}" y1="{y(v):.1f}" y2="{y(v):.1f}" stroke="#eef2f6"/>'
        f'<text x="{pl-6}" y="{y(v)+3:.1f}" font-size="8" fill="#94a3b8" text-anchor="end">{v}</text>'
        for v in range((lo // 100 + 1) * 100 if lo % 100 else lo, hi + 1, 100)
    )
    tgt = (f'<line x1="{pl}" x2="{W-pr}" y1="{y(target):.1f}" y2="{y(target):.1f}" stroke="#f59e0b" stroke-width="1.4" stroke-dasharray="4 3"/>'
           f'<text x="{W-pr+4}" y="{y(target)+3:.1f}" font-size="8.5" font-weight="700" fill="#b45309">Target</text>'
           f'<text x="{W-pr+4}" y="{y(target)+13:.1f}" font-size="8.5" fill="#b45309">{target}</text>')
    path = " ".join(f"{'M' if i == 0 else 'L'}{x(i):.1f},{y(v):.1f}" for i, v in enumerate(vals))
    dots = "".join(
        f'<circle cx="{x(i):.1f}" cy="{y(v):.1f}" r="3.3" fill="#0d9488" stroke="#fff" stroke-width="1.5"/>'
        f'<text x="{x(i):.1f}" y="{y(v)-7:.1f}" font-size="8.5" font-weight="700" fill="#0f172a" text-anchor="middle">{v}</text>'
        f'<text x="{x(i):.1f}" y="{H-7}" font-size="7.5" fill="#64748b" text-anchor="middle">{fmt_day(d(prac[i]["date"]))}</text>'
        for i, v in enumerate(vals)
    )
    return (f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="Practice test totals against target">{grid}{tgt}'
            f'<path d="{path}" fill="none" stroke="#0d9488" stroke-width="2.2"/>{dots}</svg>')


def statuses(counts):
    return {c: status_for(*counts.get(c, [0, 0])) for c, _, _ in SKILLS}


def skill_map(before, now):
    moved = {c for c in now if before.get(c) != now[c] and "unseen" not in (now[c], before.get(c))}
    rows = []
    for dcode, (section, dname, _) in DOMAINS.items():
        sq = "".join(
            f'<i class="sq {now[c]}{" moved" if c in moved else ""}" title="{html.escape(name)}"></i>'
            for c, dom, name in SKILLS if dom == dcode
        )
        rows.append(f'<div class="sec"><span>{html.escape(dname)}</span><div class="squares">{sq}</div></div>')
    count = lambda st, s: sum(1 for v in st.values() if v == s)
    tally = "".join(
        f'<span><span class="chip {s}">{STATUS[s][0]}</span> {count(before, s)} → <b>{count(now, s)}</b></span>'
        for s in ("strong", "shaky", "gap")
    )
    return "".join(rows) + f'<div class="tally">{tally}</div>', moved


def render(data):
    e = lambda v: html.escape(str(v)) if v not in (None, "") else "–"
    before = statuses(data.get("skills_before", {}))
    now = statuses(data.get("skills_now", {}))
    counts_now = data.get("skills_now", {})
    counts_before = data.get("skills_before", {})
    p = pace(data) or {"kind": "push", "head": "No practice test yet", "text": "", "days_left": "–"}
    att, hw = data.get("attendance", {}), data.get("homework", {})
    att_pct = att.get("attended", 0) / att["scheduled"] if att.get("scheduled") else None
    hw_pct = hw.get("done", 0) / hw["set"] if hw.get("set") else None
    flag = lambda pct: '<span class="flag">below 80%</span>' if pct is not None and pct < 0.8 else ""

    smap, moved = skill_map(before, now)
    # Order changes: gains first (bigger jumps first), then any slips
    def rank(c):
        return ORDER.index(now[c]) - (ORDER.index(before[c]) if before[c] in ORDER else 0)
    moved_rows = "".join(
        f'<tr><td>{html.escape(NAMES[c])}<span class="ev">{counts_before.get(c, [0,0])[0]}/{counts_before.get(c, [0,0])[1]} right → '
        f'{counts_now.get(c, [0,0])[0]}/{counts_now.get(c, [0,0])[1]} right</span></td>'
        f'<td><span class="chip {before[c]}">{STATUS[before[c]][0]}</span><span class="arrow">→</span>'
        f'<span class="chip {now[c]}">{STATUS[now[c]][0]}</span></td></tr>'
        for c in sorted(moved, key=rank, reverse=True)[:4]
    ) or '<tr><td>No skill changed band this month.</td></tr>'

    lost = data.get("points_lost", {})
    total_lost = sum(lost.values()) or 1
    top = max(lost, key=lost.get) if lost else None
    bars = "".join(
        f'<div class="bar{" top" if k == top else ""}"><span>{REASONS[k]}</span>'
        f'<span class="track"><span class="fill" style="width:{100*v/total_lost:.0f}%;display:block"></span></span><span class="n">{v}</span></div>'
        for k, v in sorted(lost.items(), key=lambda kv: -kv[1])
    )
    li = lambda xs: "".join(f"<li>{html.escape(x)}</li>" for x in xs)
    stamp = '<div class="stamp">SAMPLE · fictional student</div>' if data.get("sample") else ""
    last = (data.get("practice") or [{}])[-1]
    rep = d(data["report_date"])

    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Monthly report · {e(data.get('student'))} · {e(data.get('month'))}</title>
<style>{CSS}{EXTRA_CSS}</style></head><body><div class="page">
{stamp}
<header><div class="brand">EduTrack<span>Hub</span></div><div class="doc">Monthly report · {e(data.get('month'))}</div></header>
<section class="who">
  <div><label>Student</label><b>{e(data.get('student'))}</b></div>
  <div><label>Programme</label><b>{e(data.get('programme'))}</b></div>
  <div><label>Test day</label><b>{e(data.get('test_name'))}, {fmt_day(d(data['test_date']))}</b></div>
  <div><label>Tutor</label><b>{e(data.get('tutor'))}</b></div>
</section>
<section class="verdict {p['kind']}">
  <div><div class="tag">Is {e(data.get('first_name', 'your child'))} on track?</div><h1>{e(p['head'])}</h1><p>{e(p['text'])}</p></div>
  <div class="mini">
    <div><label>Classes</label><b>{e(att.get('attended'))}/{e(att.get('scheduled'))}</b>{flag(att_pct)}</div>
    <div><label>Homework</label><b>{e(hw.get('done'))}/{e(hw.get('set'))}</b>{flag(hw_pct)}</div>
    <div><label>Days to test</label><b>{e(p['days_left'])}</b></div>
  </div>
</section>
<section class="two">
  <div class="chart"><h2>Practice test scores</h2>{chart(data)}
    <p class="cap">Full official practice tests in Bluebook, taken timed. Latest: R&amp;W {e(last.get('rw'))} · Math {e(last.get('math'))}.</p></div>
  <div class="map"><h2>The skill map <span>all 30 tested skills</span></h2>{smap}
    <p class="cap">Each square is one skill; outlined squares changed band this month. It is the same map as the first score review, so you can watch it fill in.</p></div>
</section>
<section class="two">
  <div><h2>What changed</h2><table class="moved">{moved_rows}</table></div>
  <div><h2>Where points went on the last test</h2><div class="bars">{bars}</div>
    <p class="cap">{sum(lost.values())} questions missed on {fmt_day(d(last['date'])) if last.get('date') else '–'}, sorted by cause. The biggest cause decides next month's plan.</p></div>
</section>
<section class="two">
  <div><h2>What we did this month</h2><ul class="plain">{li(data.get('worked_on', []))}</ul></div>
  <div><h2>Next month</h2><ul class="plain">{li(data.get('next_month', []))}</ul></div>
</section>
<section class="home"><h2>Your part this month</h2><p>{e(data.get('at_home'))}</p></section>
<section><p class="note">{e(data.get('tutor_note'))}<span class="sig">{e(data.get('tutor'))}, {fmt_day(rep)} {rep.year}</span></p></section>
<footer>
  <p><b>Questions?</b> Reply on WhatsApp. The full skill-by-skill breakdown is available any time.</p>
  <p class="fine">Scores are from official College Board practice tests in Bluebook. "On track" compares the points gained per week so far with the points per week still needed. SAT and Bluebook are trademarks of College Board, which is not involved with EduTrack Hub.</p>
</footer>
</div></body></html>"""


def whatsapp_text(data):
    p = pace(data)
    name = data.get("first_name", "")
    lines = [f"Hi! {name}'s {data.get('month')} report is attached."]
    if p:
        lines.append(f"• {p['head']}. {p['text']}")
    lines.append(f"• Your part: {data.get('at_home')}")
    lines.append("Any questions, just reply here.")
    return "\n".join(lines)


if __name__ == "__main__":
    src = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else src.parent
    out.mkdir(parents=True, exist_ok=True)
    data = json.loads(src.read_text(encoding="utf-8"))
    h = out / (src.stem + ".html")
    h.write_text(render(data), encoding="utf-8")
    to_pdf(h, out / (src.stem + ".pdf"))
    (out / (src.stem + ".whatsapp.txt")).write_text(whatsapp_text(data), encoding="utf-8")
    print("wrote", h, out / (src.stem + ".pdf"))
