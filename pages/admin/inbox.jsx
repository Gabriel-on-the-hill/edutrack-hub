// pages/admin/inbox.jsx
// Admin Inbox: view contact-form messages and captured leads, with CSV export.

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { withAuth } from '../../hooks/useAuth';
import AdminLayout from '../../components/admin/AdminLayout';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

// Build a CSV string from rows (array of objects) and trigger a download.
function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminInbox() {
  const [tab, setTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mRes, lRes] = await Promise.all([
        fetch('/api/admin/messages', { credentials: 'include' }),
        fetch('/api/admin/leads', { credentials: 'include' }),
      ]);
      if (mRes.ok) {
        const data = await mRes.json();
        setMessages(data.messages || []);
        setUnread(data.unread || 0);
      }
      if (lRes.ok) {
        const data = await lRes.json();
        setLeads(data.leads || []);
      }
    } catch (e) {
      console.error('Failed to load inbox:', e);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (msg) => {
    if (msg.isRead) return;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
    setUnread((u) => Math.max(0, u - 1));
    try {
      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: msg.id, isRead: true }),
      });
    } catch (e) {
      console.error('Failed to mark read:', e);
    }
  };

  const toggle = (msg) => {
    setExpanded(expanded === msg.id ? null : msg.id);
    markRead(msg);
  };

  const exportMessages = () => downloadCsv('contact-messages.csv', messages.map((m) => ({
    name: m.name, email: m.email, phone: m.phone || '', subject: m.subject || '',
    message: m.message, read: m.isRead ? 'yes' : 'no', received: formatDate(m.createdAt),
  })));

  const exportLeads = () => downloadCsv('leads.csv', leads.map((l) => ({
    email: l.email, name: l.name || '', source: l.source || '',
    subscribed: l.isSubscribed ? 'yes' : 'no', captured: formatDate(l.createdAt),
  })));

  return (
    <AdminLayout>
      <Head><title>Inbox - EduTrack Hub</title></Head>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inbox</h1>
          <p className="text-slate-600 mt-1">Contact messages and captured leads.</p>
        </div>
        <button
          onClick={tab === 'messages' ? exportMessages : exportLeads}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
          disabled={tab === 'messages' ? messages.length === 0 : leads.length === 0}
        >
          Export {tab === 'messages' ? 'messages' : 'leads'} (CSV)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('messages')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === 'messages' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
        >
          Messages{unread > 0 && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-teal-500 text-white">{unread}</span>}
        </button>
        <button
          onClick={() => setTab('leads')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === 'leads' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}
        >
          Leads <span className="ml-1 text-slate-400">({leads.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent" />
        </div>
      ) : tab === 'messages' ? (
        messages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`bg-white rounded-2xl border p-5 cursor-pointer transition-colors ${m.isRead ? 'border-slate-100' : 'border-teal-200 bg-teal-50/30'}`}
                onClick={() => toggle(m)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!m.isRead && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />}
                      <p className={`truncate ${m.isRead ? 'font-medium text-slate-800' : 'font-bold text-slate-900'}`}>{m.name}</p>
                      {m.email && <span className="text-slate-400 text-sm truncate">&lt;{m.email}&gt;</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-1 truncate">{m.subject || 'General Inquiry'}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{formatDate(m.createdAt)}</span>
                </div>
                {expanded === m.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <p className="text-slate-700 whitespace-pre-wrap">{m.message}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {m.email && <a href={`mailto:${m.email}`} className="text-teal-600 font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>Reply by email</a>}
                      {m.phone && <a href={`https://wa.me/${m.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>WhatsApp</a>}
                      {m.phone && <a href={`tel:${m.phone}`} className="text-teal-600 font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>Call {m.phone}</a>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        leads.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">No leads yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscribed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Captured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      <a href={`mailto:${l.email}`} className="hover:text-teal-600">{l.email}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{l.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{l.source || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${l.isSubscribed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {l.isSubscribed ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </AdminLayout>
  );
}

export default withAuth(AdminInbox, { requireAdmin: true });
