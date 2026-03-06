import { NextRequest, NextResponse } from 'next/server';
import { getDb, Student } from '@/lib/db';
import { deleteCpanelEmail } from '@/lib/cpanel';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { adminPassword } = await request.json();

    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid admin password' }, { status: 401 });
    }

    const { id } = await params;
    const studentId = parseInt(id, 10);

    const db = getDb();
    const student = db
      .prepare('SELECT * FROM students WHERE id = ?')
      .get(studentId) as Student | undefined;

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Remove the inbox from the hosting server
    const localPart = student.email.split('@')[0];
    await deleteCpanelEmail(localPart);

    // Remove from database
    db.prepare('DELETE FROM students WHERE id = ?').run(studentId);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
