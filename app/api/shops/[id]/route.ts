import { NextRequest, NextResponse } from 'next/server';
import { getShopById, getVisitsByShopId } from '@/lib/data';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = getShopById(id);
  if (!shop) {
    return NextResponse.json({ error: 'Shop not found.' }, { status: 404 });
  }
  const visits = getVisitsByShopId(id);
  return NextResponse.json({ shop, visits });
}
