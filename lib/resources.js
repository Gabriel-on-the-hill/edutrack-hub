// lib/resources.js
// Shared, login-gated content library (SAT practice apps, tools, downloads).
//
// This is the single source of truth for the /resources page. Add an entry per
// item as you host it. Host the actual app/file wherever you like — it does NOT
// need to live in this repo or on Vercel:
//   • A separate static deploy (e.g. another Vercel/Netlify/Cloudflare Pages site)
//   • A folder in /public (e.g. /public/sat/...) -> href: '/sat/.../index.html'
//   • Any external URL (Google Drive share link, etc.)
//
// Set `comingSoon: true` (or leave href empty) to show a placeholder card that
// isn't clickable yet.

export const RESOURCE_CATEGORIES = ['SAT Math', 'Algebra', 'Geometry', 'General'];

export const sharedResources = [
  {
    title: 'SAT Math — Systems & Equivalent Expressions',
    subject: 'SAT Math',
    level: 'Success Hub',
    type: 'Interactive App',
    description: 'Desmos-first practice on systems of linear equations and equivalent expressions.',
    href: '',
    comingSoon: true,
  },
  {
    title: 'SAT Math — Core Geometry',
    subject: 'SAT Math',
    level: 'Success Hub',
    type: 'Interactive App',
    description: 'Lines, angles, triangles and circles with SAT-style strategy prompts.',
    href: '',
    comingSoon: true,
  },
  {
    title: 'SAT Math — Analytical Geometry',
    subject: 'SAT Math',
    level: 'Success Hub',
    type: 'Interactive App',
    description: 'Coordinate geometry and graph reasoning, Desmos-integrated.',
    href: '',
    comingSoon: true,
  },
  {
    title: 'SAT Math — Data Analysis',
    subject: 'SAT Math',
    level: 'Success Hub',
    type: 'Interactive App',
    description: 'Ratios, percentages, statistics and data interpretation practice.',
    href: '',
    comingSoon: true,
  },
];

export default sharedResources;
