// pages/api/auth/forgot-password.js
// Request a password reset email

import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/db';
import { sendEmail, passwordResetTemplate } from '../../../lib/email';
import { applyRateLimit } from '../../../lib/rate-limit';
import { getJwtSecret } from '../../../lib/auth';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const schema = z.object({
    email: z.string().email('Invalid email address'),
});

export default async function handler(req, res) {
    // 1. Rate Limiting (5 requests per 15 minutes)
    if (!await applyRateLimit(req, res, {
        limit: 5,
        windowMs: 15 * 60 * 1000,
        keyPrefix: 'forgot-pass'
    })) return;

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Invalid email address',
            });
        }

        const { email } = result.data;

        // Find user by email (don't reveal if user exists or not for security)
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true, name: true, email: true, isActive: true },
        });

        // Always return success message for security (don't reveal if email exists)
        const successMessage = 'If an account with that email exists, we\'ve sent a password reset link.';

        if (!user || !user.isActive) {
            // Still return success message but don't send email
            return res.status(200).json({ message: successMessage });
        }

        // Generate reset token (expires in 1 hour)
        const resetToken = jwt.sign(
            { userId: user.id, email: user.email, type: 'password_reset' },
            getJwtSecret(),
            { expiresIn: '1h' }
        );

        // Create reset URL
        const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

        // Send password reset email
        await sendEmail({
            to: user.email,
            subject: 'Reset Your Password - EduTrack Hub',
            html: passwordResetTemplate(user.name, resetUrl),
        });

        return res.status(200).json({ message: successMessage });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            error: 'Something went wrong. Please try again.',
        });
    }
}
