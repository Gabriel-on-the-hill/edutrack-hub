// Programmes and fees, from "EduTrack Hub Pricing" (Sep 2026).
// Change prices here only: programme pages, the fees page and the consultation
// form all read this file. A price set to null is simply not shown.

export const REGIONS = {
  ng: { key: 'ng', label: 'Nigeria', currency: '₦' },
  intl: { key: 'intl', label: 'UK · US · Canada', currency: '$' },
};

// What every family gets, whatever they choose.
export const EVERY_PLAN = [
  'Free consultation call',
  'Free assessment class to find the starting point',
  'The right tutor from the first lesson',
  'Monthly progress report',
];

export const PROGRAMMES = [
  {
    slug: 'sat-programme',
    name: 'SAT Programme',
    short: 'One-to-one SAT preparation, for the 5 December test or any later date.',
    who: 'Students preparing for the SAT, whether the test is weeks away or next year.',
    tag: 'SAT',
    featured: true,
    regions: ['ng', 'intl'],
    facts: ['Start any time', 'One-to-one', 'Reading & Writing, Math, or both'],
    weekly: [
      'One live one-to-one lesson a week per section.',
      'Homework in the SAT Mastery practice app, set from the student’s gap map.',
      'Official practice tests at checkpoints, with the results in your monthly report.',
    ],
    parentSees: 'A gap map at the start and a monthly report with scores, the skills that moved and what’s next.',
    prices: {
      ng: { amount: '₦90,000', unit: 'per section per month', detail: 'One-to-one, one 60-minute lesson a week.' },
      intl: { amount: '$360', unit: 'per section for 12 weeks', detail: 'Both sections $720. Or pay monthly: $120 per section. Diagnostic at the start. Going intensive? Add a second weekly lesson per section.' },
    },
    note: 'Sitting the SAT on 5 December 2026? Register with College Board by 20 November, and start as soon as you can.',
  },
  {
    slug: 'psat-prep',
    name: 'PSAT Prep',
    short: 'One-to-one preparation for the PSAT 10 and PSAT 8/9.',
    who: 'Students in Grades 8–10 preparing for a school PSAT sitting, or getting an early start on the SAT.',
    tag: 'PSAT',
    regions: ['intl'],
    facts: ['12 weeks', 'One-to-one', 'Reading & Writing, Math, or both'],
    weekly: [
      'One live one-to-one lesson a week per section.',
      'Practice in our PSAT practice app, set from the student’s own results.',
      'The same skills as the SAT, so the work carries straight into SAT preparation.',
    ],
    parentSees: 'A starting gap map and a monthly progress report.',
    prices: {
      intl: { amount: '$360', unit: 'per section for 12 weeks', detail: 'Both sections $720. Or pay monthly: $120 per section.' },
    },
  },
  {
    slug: 'small-group-classes',
    name: 'Small Group Classes',
    short: 'Our main programme for Primary 3 to SS 3: live lessons in groups of up to 4.',
    who: 'Children from Primary 3 to SS 3 who need steady support in one or more school subjects.',
    tag: 'Primary 3 – SS 3',
    regions: ['ng'],
    facts: ['Up to 4 students', '1 lesson a week per subject', 'Monthly project included'],
    weekly: [
      'One live lesson a week in each subject: 60 minutes for Primary, 90 minutes for JSS and SS.',
      'A monthly curriculum-based project.',
      'Homework that builds on the week’s lesson.',
    ],
    parentSees: 'A monthly progress report and a check-in with you every month.',
    prices: {
      ng: { amount: '₦35,000', unit: 'per subject per month', detail: 'More subjects, lower price: 2 subjects ₦65,000 · 3 subjects ₦95,000 · 4 subjects ₦120,000.' },
    },
  },
  {
    slug: 'one-to-one',
    name: 'One-to-One Lessons',
    short: 'Live lessons with a tutor who works only with your child.',
    who: 'Families who want lessons built entirely around one child, including exam preparation.',
    tag: 'All ages',
    regions: ['ng', 'intl'],
    facts: ['One-to-one', 'Weekly lessons', 'School subjects and exam prep'],
    weekly: [
      'One live lesson a week per subject, at an agreed weekly time.',
      'A plan built from your child’s assessment, adjusted every month.',
      'Homework and practice between lessons.',
    ],
    parentSees: 'A monthly progress report.',
    prices: {
      ng: { amount: '₦70,000', unit: 'per subject per month, Primary & JSS', detail: 'SS and exam prep (IGCSE, SAT, AP): ₦90,000 per subject per month. One 60-minute lesson a week. Focus lesson (one-to-one alongside group classes): ₦50,000 per subject per month.' },
      intl: { amount: '$25', unit: 'per hour, Grades 3–8 / Years 4–9', detail: 'Grades 9–12 / Years 10–13: $30 an hour. Exam preparation (11+, IGCSE, AP): $30 an hour. One weekly lesson in a core subject is $100 a month.' },
    },
  },
];

export const getProgramme = (slug) => PROGRAMMES.find((p) => p.slug === slug) || null;
export const SAT_SLUGS = ['sat-programme', 'psat-prep'];
