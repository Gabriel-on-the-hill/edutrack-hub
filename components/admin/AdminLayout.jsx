import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import Image from 'next/image';

const Icons = {
    Dashboard: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    Classes: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Students: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    Inbox: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Site: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    Logout: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
};

export default function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const isActive = (path) => router.pathname === path;

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 transform lg:translate-x-0 -translate-x-full lg:static">
                <div className="p-6 border-b flex items-center gap-3">
                    <Image src="/logo.png" alt="EduTrack Hub" width={32} height={32} />
                    <span className="font-bold text-lg text-slate-800">EduTrack Hub</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Management
                    </p>

                    <Link
                        href="/admin/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/dashboard')
                                ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <Icons.Dashboard className={`w-5 h-5 ${isActive('/admin/dashboard') ? 'text-teal-600' : 'text-slate-400'}`} />
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/classes"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/classes')
                                ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <Icons.Classes className={`w-5 h-5 ${isActive('/admin/classes') ? 'text-teal-600' : 'text-slate-400'}`} />
                        Classes
                    </Link>

                    <Link
                        href="/admin/students"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/students')
                                ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <Icons.Students className={`w-5 h-5 ${isActive('/admin/students') ? 'text-teal-600' : 'text-slate-400'}`} />
                        Students
                    </Link>

                    <Link
                        href="/admin/inbox"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/inbox')
                                ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <Icons.Inbox className={`w-5 h-5 ${isActive('/admin/inbox') ? 'text-teal-600' : 'text-slate-400'}`} />
                        Inbox
                    </Link>

                    <div className="my-6 border-t border-slate-100"></div>

                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        System
                    </p>

                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-all duration-200"
                    >
                        <Icons.Site className="w-5 h-5 text-slate-400" />
                        View Site
                    </Link>
                </nav>

                <div className="p-4 border-t bg-slate-50">
                    <div className="px-4 py-2 mb-3">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full tracking-wide">
                            ADMIN ACCESS
                        </span>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border border-slate-200 rounded-xl font-medium shadow-sm transition-all duration-200"
                    >
                        <Icons.Logout className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 transition-all duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
