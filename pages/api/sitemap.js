// pages/api/sitemap.js
// Generates XML sitemap for SEO

import prisma from '../../lib/db';

export default async function handler(req, res) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://edutrackhub.com';

    // Static pages
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/classes', priority: '0.9', changefreq: 'daily' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/login', priority: '0.5', changefreq: 'monthly' },
        { url: '/signup', priority: '0.6', changefreq: 'monthly' },
        { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
        { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    ];

    // Dynamic class pages
    let classPages = [];
    try {
        const classes = await prisma.class.findMany({
            where: { status: 'SCHEDULED' },
            select: { id: true, updatedAt: true },
        });
        classPages = classes.map(c => ({
            url: `/class/${c.id}`,
            priority: '0.8',
            changefreq: 'weekly',
            lastmod: c.updatedAt.toISOString().split('T')[0],
        }));
    } catch (error) {
        console.error('Failed to fetch classes for sitemap:', error);
    }

    const allPages = [...staticPages, ...classPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(sitemap);
}
