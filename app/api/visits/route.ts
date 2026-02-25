import { NextRequest, NextResponse } from 'next/server';
import { getVisits, saveVisit, getShopById } from '@/lib/data';
import { Visit } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function GET() {
  const visits = getVisits();
  return NextResponse.json(visits);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shopId, date, style, photoUrl, ratings, comment } = body;

    if (!shopId || !date || !style || !ratings) {
      return NextResponse.json({ error: 'shopId, date, style, and ratings are required.' }, { status: 400 });
    }

    const shop = getShopById(shopId);
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found.' }, { status: 404 });
    }

    const { overall, dough, sauce, cheese, foldability } = ratings;
    if ([overall, dough, sauce, cheese, foldability].some((v) => v === undefined || v < 0 || v > 5)) {
      return NextResponse.json({ error: 'All ratings must be between 0 and 5.' }, { status: 400 });
    }

    const visit: Visit = {
      id: randomUUID(),
      shopId,
      date,
      style,
      photoUrl: photoUrl ?? '',
      ratings: { overall, dough, sauce, cheese, foldability },
      comment: comment ?? '',
    };

    saveVisit(visit);
    return NextResponse.json(visit, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add visit.' }, { status: 500 });
  }
}
