import { NextResponse } from 'next/server';
import { getDb, StudentPublic } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const students = db
    .prepare('SELECT id, name, email, created_at FROM students ORDER BY name ASC')
    .all() as StudentPublic[];
  return NextResponse.json(students);
}
