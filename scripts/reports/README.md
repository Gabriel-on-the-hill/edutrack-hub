# Score review and parent report templates

Two one-page PDFs in the SAT engine's skill language (11 Reading & Writing skills,
19 Math testing points, from `spec/ontology.json` v0.7.1):

- `gapmap.py` renders the **gap map** returned after a free Bluebook score review (plan task B3/E4).
- `monthly.py` renders the **parent monthly report** (plan task D3).

## Use

```
pip install playwright
python gapmap.py reviews/<student>.json out/
python monthly.py reviews/<student>-2026-10.json out/
```

Copy `sample_review.json` or `sample_monthly.json`, fill it in, and run. Skill counts
come from the question-by-question review in My Practice (right / seen per skill).
Status bands: Strong 80%+, Shaky 50–79%, Gap under 50%. The top three fixes are ranked
automatically by questions missed, weighted by the domain's share of the section;
write a `fix_notes` line for each of the three.

## Privacy

Real student files go in `reviews/` and PDFs in `out/`. Both folders are git-ignored:
never commit a real student's data (this repository is public).
The two `sample_*.json` files use a fictional student.

Fonts: Plus Jakarta Sans (SIL Open Font License), embedded so the PDF looks the same everywhere.
