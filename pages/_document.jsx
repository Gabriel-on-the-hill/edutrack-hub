// pages/_document.jsx
// Custom document for HTML structure, fonts, and meta tags

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Fonts - Primary: Plus Jakarta Sans */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Theme color - Teal-500 brand color */}
        <meta name="theme-color" content="#14B8A6" />

        {/* No-JS fallback: scroll-reveal sections start at opacity-0 and are
            revealed by JavaScript. If JS is disabled, force them visible. */}
        <noscript>
          <style>{`[class*="opacity-0"]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
