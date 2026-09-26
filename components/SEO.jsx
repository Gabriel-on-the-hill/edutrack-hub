// components/SEO.jsx
// Reusable SEO component for consistent meta tags across pages

import Head from 'next/head';
import { SITE_URL } from '@/lib/site';

const defaultMeta = {
    title: 'EduTrack Hub',
    description: 'Live online tutoring for SAT, PSAT and school subjects, for families in Nigeria and in the UK, US and Canada. Start with a free consultation and a free assessment class.',
    image: '/og-image.png',
    url: SITE_URL,
    type: 'website',
};

// Social previews (WhatsApp, X, LinkedIn) need absolute URLs.
const absolute = (path) => (path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

export default function SEO({
    title,
    fullTitle,
    description,
    image,
    url,
    type = 'website',
    noIndex = false,
}) {
    const meta = {
        title: fullTitle || (title ? `${title} - EduTrack Hub` : defaultMeta.title),
        description: description || defaultMeta.description,
        image: absolute(image || defaultMeta.image),
        url: absolute(url || defaultMeta.url),
        type: type || defaultMeta.type,
    };

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{meta.title}</title>
            <meta name="title" content={meta.title} />
            <meta name="description" content={meta.description} />

            {/* Robots */}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={meta.type} />
            <meta property="og:url" content={meta.url} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:image" content={meta.image} />
            {!image && <meta property="og:image:width" content="1200" />}
            {!image && <meta property="og:image:height" content="630" />}
            <meta property="og:site_name" content="EduTrack Hub" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={meta.url} />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={meta.image} />

            {/* Favicon */}
            <link rel="icon" href="/logo.png" type="image/png" />
            <link rel="apple-touch-icon" href="/logo.png" />

            {/* Theme Color */}
            <meta name="theme-color" content="#14b8a6" />

            {/* Canonical URL */}
            <link rel="canonical" href={meta.url} />
        </Head>
    );
}
