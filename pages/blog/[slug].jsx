import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { getPostBySlug, getPostSlugs } from '../../lib/mdx';
import { SITE_URL } from '../../lib/site';

const components = {
    // Custom components can be passed here
};

export default function BlogPost({ source, meta }) {
    const router = useRouter();
    const siteUrl = SITE_URL;
    const postUrl = `${siteUrl}${router.asPath}`;
    const shareTitle = encodeURIComponent(`${meta.title} | EduTrack Hub`);

    return (
        <>
            <Head>
                <title>{meta.title} | EduTrack Hub</title>
                <meta name="description" content={meta.description} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={postUrl} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.image || `${siteUrl}/brand-board.png`} />
                <meta property="article:published_time" content={meta.date} />
                <meta property="article:author" content={meta.author} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={postUrl} />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.image || `${siteUrl}/brand-board.png`} />
            </Head>
            <Navbar />
            <div className="min-h-screen bg-slate-50 pt-32 pb-20">
                <article className="max-w-3xl mx-auto px-6">
                    <div className="mb-8">
                        <Link href="/blog" className="text-teal-600 font-medium hover:underline flex items-center gap-2 mb-8">
                            &larr; Back to Blog
                        </Link>

                        <div className="flex gap-2 mb-6">
                            {meta.tags?.map(tag => (
                                <span key={tag} className="text-xs font-bold tracking-wider text-teal-700 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {meta.title}
                        </h1>

                        <div className="flex items-center gap-4 text-slate-500 border-b border-slate-200 pb-8 mb-8">
                            <div className="font-medium text-slate-900">By {meta.author}</div>
                            <div>•</div>
                            <div>{meta.date}</div>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-teal-600 hover:prose-a:text-teal-700 mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
                        <MDXRemote {...source} components={components} />

                        <div className="mt-16 pt-8 border-t border-slate-100 italic text-slate-500 text-sm">
                            Last updated on {meta.updated || meta.date} by {meta.author}
                        </div>
                    </div>

                    {/* Social Share Section */}
                    <div className="max-w-3xl mx-auto mt-12 bg-teal-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-teal-900/20">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Share this insight</h3>
                                <p className="text-teal-100/70">Help other students succeed by sharing this post.</p>
                            </div>
                            <div className="flex gap-4">
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${postUrl}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group"
                                    title="Share on X"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">𝕏</span>
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group"
                                    title="Share on Facebook"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">f</span>
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors group"
                                    title="Share on LinkedIn"
                                >
                                    <span className="text-xl group-hover:scale-110 transition-transform">in</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
            <Footer />
        </>
    );
}

export async function getStaticProps({ params }) {
    const { slug } = params;
    const post = getPostBySlug(slug);
    const mdxSource = await serialize(post.content);
    return {
        props: {
            source: mdxSource,
            meta: post.meta
        }
    }
}

export async function getStaticPaths() {
    const slugs = getPostSlugs();
    return {
        paths: slugs.map(slug => ({ params: { slug: slug.replace(/\.mdx?$/, '') } })),
        fallback: false
    }
}
