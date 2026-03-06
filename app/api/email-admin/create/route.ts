import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/db';
import { hashPassword, encryptPassword } from '@/lib/crypto';
import { createCpanelEmail } from '@/lib/cpanel';

export async function POST(request: NextRequest) {
  try {
    const { adminPassword, studentName, emailLocal, proxyPassword } =
      await request.json();

    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid admin password' }, { status: 401 });
    }

    if (!studentName?.trim() || !emailLocal?.trim() || !proxyPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const domain = process.env.EMAIL_DOMAIN;
    if (!domain) {
      return NextResponse.json(
        { error: 'EMAIL_DOMAIN is not configured on the server' },
        { status: 500 }
      );
    }

    // Sanitize the local part
    const localPart = emailLocal.toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (!localPart) {
      return NextResponse.json({ error: 'Invalid email local part' }, { status: 400 });
    }

    const fullEmail = `${localPart}@${domain}`;

    // Generate a cryptographically secure real password — never shared with students
    const realPassword = crypto.randomBytes(24).toString('base64url');

    // Create the inbox on the hosting server via cPanel
    await createCpanelEmail(localPart, realPassword);

    // Persist the student record with hashed proxy pw and encrypted real pw
    const db = getDb();
    const result = db
      .prepare(
        `INSERT INTO students (name, email, proxy_password_hash, real_password_encrypted)
         VALUES (?, ?, ?, ?)`
      )
      .run(studentName.trim(), fullEmail, hashPassword(proxyPassword), encryptPassword(realPassword));

    return NextResponse.json({
      success: true,
      studentId: result.lastInsertRowid,
      email: fullEmail,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
