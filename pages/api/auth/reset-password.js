// pages/api/auth/reset-password.js
// Complete password reset with token

import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/db';
import { hashPassword, getJwtSecret } from '../../../lib/auth';


const schema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.flatten().fieldErrors,
            });
        }

        const { token, password } = result.data;

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, getJwtSecret());
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({
                    error: 'This reset link has expired. Please request a new one.',
                });
            }
            return res.status(400).json({
                error: 'Invalid reset link. Please request a new one.',
            });
        }

        // Check token type
        if (decoded.type !== 'password_reset') {
            return res.status(400).json({
                error: 'Invalid reset token.',
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true },
        });

        if (!user || user.email !== decoded.email) {
            return res.status(400).json({
                error: 'Invalid reset link.',
            });
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return res.status(200).json({
            message: 'Password reset successfully. You can now log in with your new password.',
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            error: 'Something went wrong. Please try again.',
        });
    }
}
