/**
 * IMAP helpers for fetching email from student inboxes.
 *
 * Uses real email credentials (stored encrypted in DB) — never exposed to students.
 *
 * Set these env vars:
 *   IMAP_HOST   – mail server hostname (defaults to mail.{EMAIL_DOMAIN})
 *   IMAP_PORT   – IMAP port (default 993 for SSL)
 *   IMAP_REJECT_UNAUTHORIZED – set to "false" to skip TLS cert check (dev only)
 */

import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export interface EmailSummary {
  uid: number;
  subject: string;
  from: string;
  date: string;
  read: boolean;
}

export interface EmailDetail extends EmailSummary {
  to: string;
  body: string;
  isHtml: boolean;
}

function createClient(user: string, pass: string): ImapFlow {
  const host =
    process.env.IMAP_HOST || `mail.${process.env.EMAIL_DOMAIN || 'localhost'}`;
  const port = parseInt(process.env.IMAP_PORT || '993', 10);
  const rejectUnauthorized = process.env.IMAP_REJECT_UNAUTHORIZED !== 'false';

  return new ImapFlow({
    host,
    port,
    secure: port === 993,
    auth: { user, pass },
    logger: false,
    tls: { rejectUnauthorized },
  });
}

function formatAddress(addr: { name?: string; mailbox?: string; host?: string } | undefined): string {
  if (!addr) return 'Unknown';
  const email = `${addr.mailbox ?? ''}@${addr.host ?? ''}`;
  return addr.name ? `${addr.name} <${email}>` : email;
}

function toIsoString(d: Date | string | undefined | null): string {
  if (!d) return '';
  if (d instanceof Date) return d.toISOString();
  return new Date(d).toISOString();
}

/**
 * Fetch a list of recent emails (envelopes only — no body).
 */
export async function listEmails(
  email: string,
  password: string,
  limit = 50
): Promise<EmailSummary[]> {
  const client = createClient(email, password);
  await client.connect();
  const results: EmailSummary[] = [];

  try {
    const lock = await client.getMailboxLock('INBOX');
    try {
      const total = (client.mailbox as any)?.exists ?? 0;
      if (total === 0) return results;

      const startSeq = Math.max(1, total - limit + 1);

      for await (const msg of client.fetch(`${startSeq}:*`, {
        uid: true,
        envelope: true,
        internalDate: true,
        flags: true,
      })) {
        results.push({
          uid: msg.uid,
          subject: msg.envelope?.subject || '(No subject)',
          from: formatAddress(msg.envelope?.from?.[0]),
          date: toIsoString(msg.internalDate ?? msg.envelope?.date),
          read: msg.flags?.has('\\Seen') ?? false,
        });
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }

  return results.reverse(); // newest first
}

/**
 * Fetch a single email by UID, returning the full body.
 */
export async function getEmail(
  email: string,
  password: string,
  uid: number
): Promise<EmailDetail | null> {
  const client = createClient(email, password);
  await client.connect();

  try {
    const lock = await client.getMailboxLock('INBOX');
    try {
      const msg = await client.fetchOne(
        `${uid}`,
        { uid: true, envelope: true, source: true, internalDate: true, flags: true },
        { uid: true }
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fetchedMsg = msg as any;
      if (!fetchedMsg?.source) return null;
      const parsed = await simpleParser(fetchedMsg.source as Buffer);

      const isHtml = !!parsed.html;
      const body = (parsed.html || parsed.text || '').toString();

      return {
        uid,
        subject: fetchedMsg.envelope?.subject || parsed.subject || '(No subject)',
        from: formatAddress(fetchedMsg.envelope?.from?.[0]) || parsed.from?.text || 'Unknown',
        to: Array.isArray(parsed.to) ? parsed.to.map((a) => a.text).join(', ') : (parsed.to?.text ?? ''),
        date: toIsoString(fetchedMsg.internalDate ?? fetchedMsg.envelope?.date),
        read: (fetchedMsg.flags as Set<string> | undefined)?.has('\\Seen') ?? false,
        body,
        isHtml,
      };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}
