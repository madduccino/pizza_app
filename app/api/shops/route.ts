import { NextRequest, NextResponse } from 'next/server';
import { getShops, saveShop, shopExists } from '@/lib/data';
import { Shop } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function GET() {
  const shops = getShops();
  return NextResponse.json(shops);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, zipCode, photoUrl } = body;

    if (!name || !address || !zipCode) {
      return NextResponse.json({ error: 'Name, address, and zip code are required.' }, { status: 400 });
    }

    if (shopExists(name, address)) {
      return NextResponse.json({ error: 'This shop already exists in the system.' }, { status: 409 });
    }

    const shop: Shop = {
      id: randomUUID(),
      name,
      address,
      zipCode,
      photoUrl: photoUrl ?? '',
      createdAt: new Date().toISOString(),
    };

    saveShop(shop);
    return NextResponse.json(shop, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add shop.' }, { status: 500 });
  }
}
