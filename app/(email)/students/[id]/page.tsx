'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface EmailSummary {
  uid: number;
  subject: string;
  from: string;
  date: string;
  read: boolean;
}

interface EmailDetail {
  uid: number;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  isHtml: boolean;
}

interface StudentInfo {
  id: number;
  name: string;
  email: string;
}

export default function StudentInboxPage() {
  const { id } = useParams<{ id: string }>();

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [proxyPassword, setProxyPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [messages, setMessages] = useState<EmailSummary[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);

  const [selectedMsg, setSelectedMsg] = useState<EmailDetail | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Load public student info (name/email) before auth
  useEffect(() => {
    fetch(`/api/email-students/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStudentInfo(d));
  }, [id]);

  const loadInbox = useCallback(
    async (pw: string) => {
      setLoadingInbox(true);
      setAuthError('');
      try {
        const res = await fetch(`/api/student-inbox/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ proxyPassword: pw }),
        });
        const data = await res.json();
        if (!res.ok) {
          setAuthError(data.error ?? 'Authentication failed');
          return false;
        }
        setMessages(data.messages);
        setAuthenticated(true);
        return true;
      } catch {
        setAuthError('Network error — please try again');
        return false;
      } finally {
        setLoadingInbox(false);
      }
    },
    [id]
  );

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loadInbox(proxyPassword);
  }

  async function handleOpenEmail(uid: number) {
    setLoadingEmail(true);
    setSelectedMsg(null);
    try {
      const res = await fetch(`/api/student-email/${id}/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxyPassword }),
      });
      if (res.ok) {
        const data: EmailDetail = await res.json();
        setSelectedMsg(data);
        // Mark as read locally
        setMessages((prev) =>
          prev.map((m) => (m.uid === uid ? { ...m, read: true } : m))
        );
      }
    } finally {
      setLoadingEmail(false);
    }
  }

  function formatDate(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  // ── Password gate ─────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="mb-4">
            <Link href="/students" className="text-sm text-blue-600 hover:underline">
              ← All Students
            </Link>
          </div>

          <div className="text-center mb-6">
            {studentInfo && (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3 font-bold text-blue-700 text-sm">
                {studentInfo.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900">
              {studentInfo ? studentInfo.name : 'Student Inbox'}
            </h1>
            {studentInfo && (
              <p className="text-sm text-blue-600 mt-0.5">{studentInfo.email}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Enter your inbox password to view email.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inbox Password
              </label>
              <input
                type="password"
                value={proxyPassword}
                onChange={(e) => setProxyPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your inbox password"
                autoFocus
                required
              />
              {authError && (
                <p className="text-red-600 text-sm mt-1">{authError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loadingInbox}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loadingInbox ? 'Loading inbox…' : 'Open Inbox'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Inbox view ────────────────────────────────────────────────────────────
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <Link href="/students" className="text-gray-400 hover:text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {studentInfo?.name ?? 'Student Inbox'}
          </p>
          <p className="text-xs text-blue-600 truncate">{studentInfo?.email}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {unread > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {unread} unread
            </span>
          )}
          <button
            onClick={() => loadInbox(proxyPassword)}
            disabled={loadingInbox}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            {loadingInbox ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
        {/* Message list */}
        <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
              <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="font-medium">No messages</p>
              <p className="text-sm mt-1">This inbox is empty.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.uid}
                onClick={() => handleOpenEmail(msg.uid)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                  selectedMsg?.uid === msg.uid
                    ? 'bg-blue-50 border-l-[3px] border-l-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p
                    className={`text-sm truncate ${
                      !msg.read ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'
                    }`}
                  >
                    {msg.from}
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {msg.date
                      ? new Date(msg.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </p>
                </div>
                <p
                  className={`text-sm truncate ${
                    !msg.read ? 'font-medium text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {msg.subject}
                </p>
                {!msg.read && (
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                )}
              </button>
            ))
          )}
        </aside>

        {/* Email content pane */}
        <main className="flex-1 overflow-y-auto bg-white hidden md:block">
          {loadingEmail ? (
            <div className="flex items-center justify-center h-full text-gray-400 gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading…
            </div>
          ) : selectedMsg ? (
            <div className="p-6 max-w-3xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
                {selectedMsg.subject}
              </h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm space-y-1.5 text-gray-600">
                <p>
                  <span className="font-medium text-gray-700 w-10 inline-block">From</span>
                  {selectedMsg.from}
                </p>
                {selectedMsg.to && (
                  <p>
                    <span className="font-medium text-gray-700 w-10 inline-block">To</span>
                    {selectedMsg.to}
                  </p>
                )}
                <p>
                  <span className="font-medium text-gray-700 w-10 inline-block">Date</span>
                  {formatDate(selectedMsg.date)}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                {selectedMsg.isHtml ? (
                  <div
                    className="prose prose-sm max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: selectedMsg.body }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                    {selectedMsg.body}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Select an email to read</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
