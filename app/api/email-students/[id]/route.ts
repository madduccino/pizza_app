import { NextRequest, NextResponse } from 'next/server';
import { getDb, StudentPublic } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const student = db
    .prepare('SELECT id, name, email, created_at FROM students WHERE id = ?')
    .get(parseInt(id, 10)) as StudentPublic | undefined;

  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }

  return NextResponse.json(student);
}
