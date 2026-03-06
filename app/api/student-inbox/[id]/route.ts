import { NextRequest, NextResponse } from 'next/server';
import { getDb, Student } from '@/lib/db';
import { verifyPassword, decryptPassword } from '@/lib/crypto';
import { listEmails } from '@/lib/imap-client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { proxyPassword } = await request.json();
    const { id } = await params;
    const studentId = parseInt(id, 10);

    const db = getDb();
    const student = db
      .prepare('SELECT * FROM students WHERE id = ?')
      .get(studentId) as Student | undefined;

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (!verifyPassword(proxyPassword, student.proxy_password_hash)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Decrypt the real email password (never sent to the client)
    const realPassword = decryptPassword(student.real_password_encrypted);

    const messages = await listEmails(student.email, realPassword);

    return NextResponse.json({ messages, email: student.email, name: student.name });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
