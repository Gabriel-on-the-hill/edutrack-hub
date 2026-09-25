"""SAT skill map in the SAT engine's language (spec/ontology.json v0.7.1).

11 Reading & Writing skills and 19 Math testing points, grouped by the
official domains. Weights are College Board's approximate share of each
section per domain (Assessment Framework), used to rank fixes.
"""

DOMAINS = {
    # code: (section, name, share of section)
    "II":  ("RW", "Information and Ideas", 0.26),
    "CS":  ("RW", "Craft and Structure", 0.28),
    "EOI": ("RW", "Expression of Ideas", 0.20),
    "SEC": ("RW", "Standard English Conventions", 0.26),
    "ALG": ("MATH", "Algebra", 0.35),
    "ADV": ("MATH", "Advanced Math", 0.35),
    "PSD": ("MATH", "Problem-Solving and Data Analysis", 0.15),
    "GEO": ("MATH", "Geometry and Trigonometry", 0.15),
}

SKILLS = [
    ("II.CID", "II", "Central Ideas and Details"),
    ("II.COE_T", "II", "Command of Evidence (Textual)"),
    ("II.COE_Q", "II", "Command of Evidence (Quantitative)"),
    ("II.INF", "II", "Inferences"),
    ("CS.WIC", "CS", "Words in Context"),
    ("CS.TSP", "CS", "Text Structure and Purpose"),
    ("CS.CTC", "CS", "Cross-Text Connections"),
    ("EOI.TRA", "EOI", "Transitions"),
    ("EOI.SYN", "EOI", "Rhetorical Synthesis"),
    ("SEC.BND", "SEC", "Boundaries"),
    ("SEC.FSS", "SEC", "Form, Structure, and Sense"),
    ("ALG.1", "ALG", "Linear equations in one variable"),
    ("ALG.2", "ALG", "Linear equations in two variables"),
    ("ALG.3", "ALG", "Linear functions"),
    ("ALG.4", "ALG", "Systems of two linear equations"),
    ("ALG.5", "ALG", "Linear inequalities"),
    ("ADV.1", "ADV", "Equivalent expressions"),
    ("ADV.2", "ADV", "Nonlinear equations and systems"),
    ("ADV.3", "ADV", "Nonlinear functions"),
    ("PSD.1", "PSD", "Ratios, rates, proportions and units"),
    ("PSD.2", "PSD", "Percentages"),
    ("PSD.3", "PSD", "One-variable data"),
    ("PSD.4", "PSD", "Two-variable data and scatterplots"),
    ("PSD.5", "PSD", "Probability and conditional probability"),
    ("PSD.6", "PSD", "Sample statistics and margin of error"),
    ("PSD.7", "PSD", "Observational studies and experiments"),
    ("GEO.1", "GEO", "Area and volume"),
    ("GEO.2", "GEO", "Lines, angles and triangles"),
    ("GEO.3", "GEO", "Right triangles and trigonometry"),
    ("GEO.4", "GEO", "Circles"),
]

assert sum(1 for s in SKILLS if DOMAINS[s[1]][0] == "RW") == 11
assert sum(1 for s in SKILLS if DOMAINS[s[1]][0] == "MATH") == 19

STATUS = {
    "strong": ("Strong", "80%+ right"),
    "shaky": ("Shaky", "50–79% right"),
    "gap": ("Gap", "under 50% right"),
    "unseen": ("Not seen", "no questions in this test"),
}


def status_for(right, seen):
    if not seen:
        return "unseen"
    acc = right / seen
    if acc >= 0.8:
        return "strong"
    if acc >= 0.5:
        return "shaky"
    return "gap"
