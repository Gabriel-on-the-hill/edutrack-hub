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

// Parts of the site that are built but not ready for the public.
// Turning one on is a one-line change here.
export const FEATURES = {
  resourceLibrary: false,   // /resources (all items are still "coming soon")
  learningHubs: false,      // /hubs/* (thin pages)
  onlinePayments: false,    // Stripe checkout (payments move to Paystack links)
  curriculumGenerator: false, // /admin/curriculum/generator (needs the local generator server)
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
export const TUTOR = {
  name: 'Gabriel',
  role: 'Founder and lead tutor',
  photo: '/gabriel-portrait.jpg',
  bio: '',
};
