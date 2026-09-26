// Site-wide settings. Change values here (or in the matching environment
// variable on Vercel) instead of editing individual pages.

// Public address of the site, used in emails, the sitemap and share links.
// A localhost value is only honoured in local development, so a copied
// .env can never make the live site send people to localhost.
const RAW_APP_URL = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
export const SITE_URL = RAW_APP_URL && (process.env.NODE_ENV !== 'production' || !RAW_APP_URL.includes('localhost'))
  ? RAW_APP_URL
  : 'https://edutrackhub.com';

// Business WhatsApp number: digits only, with country code, no + or spaces
// (e.g. 234XXXXXXXXXX). Leave empty to hide every WhatsApp button.
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export function whatsappLink(message = "Hi! I'm interested in tutoring with EduTrack Hub") {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Public email address shown on the contact, privacy and terms pages.
// Make sure this inbox exists and is checked.
export const CONTACT_EMAIL = 'hello@edutrackhub.com';

// Lesson hours shown on the contact page. Confirm before launch.
export const LESSON_HOURS = {
  lines: ['Mon – Fri: 4 PM – 9 PM', 'Sat: 10 AM – 6 PM'],
  zone: 'Lagos time (WAT). Families abroad agree a weekly time in their own time zone.',
};

// Parts of the site that are built but not ready for the public.
// Turning one on is a one-line change here.
export const FEATURES = {
  resourceLibrary: false,   // /resources (all items are still "coming soon")
  learningHubs: false,      // /hubs/* (thin pages)
  onlinePayments: false,    // Stripe checkout (payments move to Paystack links)
  curriculumGenerator: false, // /admin/curriculum/generator (needs the local generator server)
  classCatalogue: false,    // /classes and /class/* (old enrol-yourself flow; redirects in next.config.js)
};

// Launch offer (e.g. Independence Day). While `active` is false, or headline is
// empty, the offer banner and every mention of it stay hidden.
export const LAUNCH_OFFER = {
  active: false,
  label: 'Independence Day offer',
  headline: '',      // e.g. "Nigeria at 66: ..."
  details: '',       // one or two plain sentences with the exact terms
  endsLabel: '',     // e.g. "Ends Monday 12 October"
};

// The tutor shown on the homepage. Leave `bio` empty to show only name and role.
// `facts` are short credential chips; an empty list hides them.
export const TUTOR = {
  name: 'Gabriel',
  role: 'Founder and lead tutor',
  photo: '/gabriel-portrait.jpg',
  // DRAFT from Gabriel's own background. Check the wording before launch.
  bio: 'Gabriel has taught for over eight years, from Grade 3 to early university, and specialises in SAT, IGCSE and AP preparation. He also works as a UK curriculum advisor, writing guides and assessment tools aligned to the National Curriculum in England.',
  facts: ['B.Eng, Mechanical Engineering', '8+ years teaching', 'SAT · IGCSE · AP', 'UK curriculum advisor'],
};

// Short facts shown in a strip under the homepage hero. Keep every one true today.
export const PROOF_FACTS = [
  { value: '8+ years', label: 'teaching SAT, IGCSE and AP' },
  { value: 'Up to 4', label: 'students in a group class' },
  { value: 'Live', label: 'every lesson, on Google Meet' },
  { value: 'Monthly', label: 'one-page progress report' },
];

// Real results from Gabriel's past students. The homepage section stays hidden
// while this list is empty. Only add a result the family has agreed to share.
// Example entry:
//   { result: '1150 → 1390', what: 'SAT total, 12 weeks', who: 'Grade 11 student, Lagos',
//     quote: 'Optional short quote in the family\'s own words.' },
export const RESULTS = [];

// Social profiles. Leave a value empty to hide its icon in the footer.
// Only fill in accounts that exist and are active.
export const SOCIAL = {
  instagram: '', // e.g. 'https://instagram.com/edutrackhub'
  x: '',         // e.g. 'https://x.com/edutrackhub'
  linkedin: '',  // e.g. 'https://linkedin.com/company/edutrackhub'
};
