import { requireAuth } from '../../../lib/auth';
import prisma from '../../../lib/db';
import Stripe from 'stripe';
import { applyRateLimit } from '../../../lib/rate-limit';
import { FEATURES } from '../../../lib/site';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

export default async function handler(req, res) {
    // Card checkout is switched off until payments go live (FEATURES.onlinePayments in lib/site.js).
    if (!FEATURES.onlinePayments) {
        return res.status(503).json({ error: 'Online payment is not available yet. Please contact us to pay.' });
    }

    // 1. Rate Limiting (5 attempts per 10 minutes)
    if (!await applyRateLimit(req, res, {
        limit: 5,
        windowMs: 10 * 60 * 1000,
        keyPrefix: 'checkout'
    })) return;

    // Only allow POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate user
    const auth = requireAuth(req, res);
    if (!auth) return;

    const { classId } = req.body;

    if (!classId) {
        return res.status(400).json({ error: 'Class ID is required' });
    }

    try {
        // Fetch class details
        const cls = await prisma.class.findUnique({
            where: { id: classId },
        });

        if (!cls) {
            return res.status(404).json({ error: 'Class not found' });
        }

        if (cls.price <= 0) {
            return res.status(400).json({ error: 'Class is free, use regular enrollment' });
        }

        // Determine return URL
        const origin = req.headers.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: cls.currency.toLowerCase(),
                        product_data: {
                            name: cls.title,
                            description: `${cls.subject} - ${cls.level}`,
                        },
                        unit_amount: cls.price,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                classId: cls.id,
                userId: auth.user.userId,
            },
            success_url: `${origin}/dashboard/student?payment_success=true&class_id=${cls.id}`,
            cancel_url: `${origin}/class/${cls.id}?payment_cancelled=true`,
        });

        // Create pending Payment record
        await prisma.payment.create({
            data: {
                userId: auth.user.userId,
                amount: cls.price,
                currency: cls.currency,
                stripeSessionId: session.id,
                status: 'PENDING',
                description: `Enrollment for ${cls.title}`,
                classId: cls.id,
            },
        });

        // Return the checkout URL
        return res.status(200).json({ url: session.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return res.status(500).json({ error: 'Failed to create checkout session' });
    }
}
