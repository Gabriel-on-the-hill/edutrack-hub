
import prisma from '../../../lib/db';
import { requireRole } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authUser = requireRole(req, res, ['ADMIN']);
        if (!authUser) return;

        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: {
                        enrollments: true,
                        attendance: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.status(200).json({ students });
    } catch (error) {
        console.error('Failed to fetch students:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
