// POST /api/score-review
// Free Bluebook score review request. Saved as a contact message (so it shows
// in the admin inbox) and, when an email is given, as a lead.

import { z } from 'zod';
import prisma from '../../lib/db';
import { sendEmail } from '../../lib/email';
import { applyRateLimit } from '../../lib/rate-limit';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@edutrackhub.com';

const score = (min, max) =>
  z.union([z.coerce.number().int().min(min).max(max), z.literal('')]).optional();

const reviewSchema = z.object({
  studentName: z.string().trim().min(2, 'Please enter the student\'s name').max(100),
  whatsapp: z.string().trim()
    .transform((v) => v.replace(/[^\d+]/g, ''))
    .refine((v) => v.replace(/\D/g, '').length >= 8 && v.replace(/\D/g, '').length <= 15, 'Please enter a WhatsApp number with country code'),
  email: z.union([z.string().trim().email('Please check the email address'), z.literal('')]).optional(),
  role: z.enum(['parent', 'student']).optional(),
  grade: z.string().trim().max(40).optional(),
  targetTest: z.string().trim().max(60).optional(),
  practiceTest: z.string().trim().max(40).optional(),
  total: score(400, 1600),
  rw: score(200, 800),
  math: score(200, 800),
  notes: z.string().trim().max(1500).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please agree so we can contact you' }) }),
}).superRefine((d, ctx) => {
  if (d.rw && d.math && d.total && Number(d.rw) + Number(d.math) !== Number(d.total)) {
    ctx.addIssue({ code: 'custom', path: ['total'], message: 'Total should equal Reading & Writing + Math' });
  }
  for (const k of ['total', 'rw', 'math']) {
    if (d[k] && Number(d[k]) % 10 !== 0) {
      ctx.addIssue({ code: 'custom', path: [k], message: 'SAT scores go up in steps of 10' });
    }
  }
});

function formatMessage(d) {
  const line = (label, v) => (v ? `${label}: ${v}` : null);
  const scores = [d.total && `Total ${d.total}`, d.rw && `R&W ${d.rw}`, d.math && `Math ${d.math}`]
    .filter(Boolean).join(' · ');
  return [
    'FREE BLUEBOOK SCORE REVIEW',
    line('Student', d.studentName),
    line('Filled in by', d.role),
    line('WhatsApp', d.whatsapp),
    line('Email', d.email),
    line('Grade', d.grade),
    line('Aiming for', d.targetTest),
    line('Practice test', d.practiceTest),
    line('Scores', scores || 'not given yet (report to follow on WhatsApp)'),
    d.notes ? `\nNotes:\n${d.notes}` : null,
  ].filter(Boolean).join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!await applyRateLimit(req, res, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
    keyPrefix: 'score-review',
  })) return;

  // Honeypot: the hidden "website" field is left empty by people. Bots that fill it get a
  // normal-looking reply and nothing is saved.
  if (req.body && typeof req.body.website === 'string' && req.body.website.trim() !== '') {
    return res.status(200).json({ success: true });
  }

  const result = reviewSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Please check the highlighted fields',
      details: result.error.flatten().fieldErrors,
    });
  }

  const d = result.data;
  const message = formatMessage(d);

  try {
    await prisma.contactMessage.create({
      data: {
        name: d.studentName,
        email: d.email || '',
        phone: d.whatsapp,
        subject: 'Score review request',
        message,
      },
    });

    if (d.email) {
      await prisma.lead.upsert({
        where: { email: d.email },
        update: { source: 'score-review' },
        create: { email: d.email, name: d.studentName, source: 'score-review' },
      });
    }

    // Admin alert. Does nothing until Resend is configured; the inbox is the record.
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Score review] ${d.studentName}${d.total ? ` (${d.total})` : ''}`,
      html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${message
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
    }).catch((err) => console.error('Score review alert failed:', err));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Score review error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again, or message us on WhatsApp.' });
  }
}
