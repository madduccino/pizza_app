import { NextRequest, NextResponse } from 'next/server';
import { getVisitById, getShopById } from '@/lib/data';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const visit = getVisitById(id);
  if (!visit) {
    return NextResponse.json({ error: 'Visit not found.' }, { status: 404 });
  }
  const shop = getShopById(visit.shopId);
  return NextResponse.json({ visit, shop });
}
