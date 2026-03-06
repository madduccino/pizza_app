import { NextRequest, NextResponse } from 'next/server';
import { getDb, Student } from '@/lib/db';
import { verifyPassword, decryptPassword } from '@/lib/crypto';
import { getEmail } from '@/lib/imap-client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; uid: string }> }
) {
  try {
    const { proxyPassword } = await request.json();
    const { id, uid } = await params;

    const db = getDb();
    const student = db
      .prepare('SELECT * FROM students WHERE id = ?')
      .get(parseInt(id, 10)) as Student | undefined;

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (!verifyPassword(proxyPassword, student.proxy_password_hash)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const realPassword = decryptPassword(student.real_password_encrypted);
    const email = await getEmail(student.email, realPassword, parseInt(uid, 10));

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json(email);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
