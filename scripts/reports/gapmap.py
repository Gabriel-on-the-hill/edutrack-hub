"""Render a one-page Bluebook gap map (HTML + PDF) from a JSON file.

Usage:  python gapmap.py review.json [out_dir]

JSON fields (see sample_review.json):
  student, prepared (date text), practice_test, test_date (e.g. "SAT, 5 Dec 2026"),
  scores {total, rw, math}, target {score, weekly_hours},
  skills {CODE: [right, seen]} using codes from skills.py,
  fix_notes {CODE: "what we'll do"}  (optional, for the top fixes),
  summary (2-3 sentences), sample (true = stamp as SAMPLE)
"""
import html
import json
import sys
from pathlib import Path

from skills import DOMAINS, SKILLS, STATUS, status_for

HERE = Path(__file__).parent
import base64
FONT_CSS = "".join(
    "@font-face{font-family:'Plus Jakarta Sans';font-weight:%s;"
    "src:url(data:font/woff2;base64,%s) format('woff2');}"
    % (w, base64.b64encode((HERE / "fonts" / f"PJS-{w}.woff2").read_bytes()).decode())
    for w in (400, 600, 700, 800)
)
CSS = FONT_CSS + (HERE / "report.css").read_text(encoding="utf-8")


def rank_fixes(skills):
    rows = []
    for code, dom, name in SKILLS:
        right, seen = skills.get(code, [0, 0])
        if not seen:
            continue
        missed = seen - right
        if missed <= 0:
            continue
        # points-at-stake proxy: questions missed, nudged by the domain's share of the section
        rows.append((missed * (1 + DOMAINS[dom][2]), code, dom, name, right, seen))
    rows.sort(reverse=True)
    return rows[:3]


def skill_table(section, skills):
    out = []
    for dcode, (sec, dname, share) in DOMAINS.items():
        if sec != section:
            continue
        out.append(f'<tr class="dom"><td colspan="3">{html.escape(dname)} <span>~{round(share*100)}% of section</span></td></tr>')
        for code, dom, name in SKILLS:
            if dom != dcode:
                continue
            right, seen = skills.get(code, [0, 0])
            st = status_for(right, seen)
            label = STATUS[st][0]
            frac = f"{right}/{seen}" if seen else "–"
            out.append(
                f'<tr><td>{html.escape(name)}</td><td class="num">{frac}</td>'
                f'<td><span class="chip {st}">{label}</span></td></tr>'
            )
    return "\n".join(out)


def render(data):
    e = lambda v: html.escape(str(v)) if v not in (None, "") else "–"
    skills = data.get("skills", {})
    fixes = rank_fixes(skills)
    notes = data.get("fix_notes", {})
    fix_html = "".join(
        f'<li><div class="fix-h"><b>{html.escape(name)}</b><span>{right}/{seen} right · {DOMAINS[dom][1]}</span></div>'
        f'<p>{html.escape(notes.get(code, ""))}</p></li>'
        for _, code, dom, name, right, seen in fixes
    ) or "<li><p>No clear gaps in this test. We'll focus on speed and the hardest question types.</p></li>"

    sc = data.get("scores", {})
    tg = data.get("target", {})
    legend = " ".join(f'<span class="chip {k}">{v[0]}</span> {v[1]}' for k, v in STATUS.items())
    stamp = '<div class="stamp">SAMPLE · fictional student</div>' if data.get("sample") else ""

    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Gap map · {e(data.get('student'))}</title>
<style>{CSS}</style></head><body><div class="page">
{stamp}
<header>
  <div class="brand">EduTrack<span>Hub</span></div>
  <div class="doc">Bluebook score review · gap map</div>
</header>
<section class="who">
  <div><label>Student</label><b>{e(data.get('student'))}</b></div>
  <div><label>Practice test</label><b>{e(data.get('practice_test'))}</b></div>
  <div><label>Aiming for</label><b>{e(data.get('test_date'))}</b></div>
  <div><label>Prepared</label><b>{e(data.get('prepared'))}</b></div>
</section>
<section class="scores">
  <div><label>Total</label><b>{e(sc.get('total'))}</b></div>
  <div><label>Reading &amp; Writing</label><b>{e(sc.get('rw'))}</b></div>
  <div><label>Math</label><b>{e(sc.get('math'))}</b></div>
  <div class="target"><label>Realistic target</label><b>{e(tg.get('score'))}</b><small>with {e(tg.get('weekly_hours'))} hrs/week</small></div>
</section>
<p class="summary">{e(data.get('summary'))}</p>
<section class="grid">
  <div><h2>Reading &amp; Writing <span>11 skills</span></h2><table>{skill_table('RW', skills)}</table>
    <div class="fixes"><h2>Fix these first</h2><ol>{fix_html}</ol></div></div>
  <div><h2>Math <span>19 skills</span></h2><table>{skill_table('MATH', skills)}</table></div>
</section>
<footer>
  <div class="legend">{legend}</div>
  <p><b>Next step:</b> a free trial class built around fix no. 1. Reply on WhatsApp to book a time.</p>
  <p class="fine">Based on one official practice test, so treat it as a starting point. SAT and Bluebook are trademarks of College Board, which is not involved with EduTrack Hub.</p>
</footer>
</div></body></html>"""


def to_pdf(html_path, pdf_path):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(html_path.resolve().as_uri(), wait_until="networkidle")
        pg.pdf(path=str(pdf_path), format="A4", print_background=True,
               margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        b.close()


if __name__ == "__main__":
    src = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else src.parent
    out.mkdir(parents=True, exist_ok=True)
    data = json.loads(src.read_text(encoding="utf-8"))
    h = out / (src.stem + ".html")
    h.write_text(render(data), encoding="utf-8")
    to_pdf(h, out / (src.stem + ".pdf"))
    print("wrote", h, out / (src.stem + ".pdf"))
