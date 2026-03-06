'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Student {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const [adminPassword, setAdminPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Create form
  const [studentName, setStudentName] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [proxyPassword, setProxyPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<{ email: string } | null>(null);
  const [createError, setCreateError] = useState('');

  const domain = process.env.NEXT_PUBLIC_EMAIL_DOMAIN || 'yourdomain.com';

  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch('/api/email-students');
      setStudents(await res.json());
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchStudents();
  }, [authenticated, fetchStudents]);

  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adminPassword) {
      setAuthError('Please enter the admin password.');
      return;
    }
    setAuthError('');
    setAuthenticated(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateResult(null);

    try {
      const res = await fetch('/api/email-admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword, studentName, emailLocal, proxyPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error ?? 'Failed to create email account');
      } else {
        setCreateResult({ email: data.email });
        setStudentName('');
        setEmailLocal('');
        setProxyPassword('');
        fetchStudents();
      }
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(student: Student) {
    if (!confirm(`Delete inbox for ${student.name} (${student.email})?\n\nThis permanently removes the email account and all its messages.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/email-admin/delete/${student.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.error}`);
      } else {
        fetchStudents();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Network error');
    }
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">Student Email Manager</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                autoFocus
              />
              {authError && (
                <p className="text-red-600 text-sm mt-1">{authError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-4">
            <Link href="/students" className="text-sm text-blue-600 hover:underline">
              View student inboxes →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Student Email Manager</h1>
            <p className="text-xs text-gray-500 mt-0.5">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/students"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Student Portal →
            </Link>
            <button
              onClick={() => { setAuthenticated(false); setAdminPassword(''); }}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Create Email Form */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Create Student Email Account
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="text"
                    value={emailLocal}
                    onChange={(e) =>
                      setEmailLocal(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))
                    }
                    placeholder="janesmith"
                    className="flex-1 px-3 py-2 focus:outline-none min-w-0"
                    required
                  />
                  <span className="bg-gray-50 border-l border-gray-300 px-3 py-2 text-gray-500 text-sm whitespace-nowrap">
                    @{domain}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Inbox Password{' '}
                <span className="font-normal text-gray-400">(proxy — not the real email password)</span>
              </label>
              <input
                type="text"
                value={proxyPassword}
                onChange={(e) => setProxyPassword(e.target.value)}
                placeholder="Password the student will use to view their inbox in this app"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                This password lets the student log into this portal only. The actual email account
                password is generated randomly and never shown.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating…' : 'Create Email Account'}
              </button>
            </div>
          </form>

          {createResult && (
            <div className="mt-4 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-green-800 font-medium">Email account created!</p>
                <p className="text-green-700 text-sm mt-0.5">
                  Inbox: <strong>{createResult.email}</strong>
                </p>
              </div>
            </div>
          )}

          {createError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              <strong>Error:</strong> {createError}
            </div>
          )}
        </section>

        {/* Students Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Students{' '}
              <span className="text-gray-400 font-normal text-base">
                ({students.length})
              </span>
            </h2>
            <button
              onClick={fetchStudents}
              disabled={loadingStudents}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {loadingStudents ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>No student accounts yet. Create one above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-medium text-gray-500">Name</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-500">Email</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-500">Created</th>
                    <th className="text-right py-2 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 group">
                      <td className="py-3 pr-4 font-medium text-gray-900">{s.name}</td>
                      <td className="py-3 pr-4 text-blue-600">{s.email}</td>
                      <td className="py-3 pr-4 text-gray-400">
                        {new Date(s.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/students/${s.id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            View Inbox
                          </Link>
                          <button
                            onClick={() => handleDelete(s)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
