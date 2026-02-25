import fs from 'fs';
import path from 'path';
import { Shop, Visit } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SHOPS_FILE = path.join(DATA_DIR, 'shops.json');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');

export function getShops(): Shop[] {
  const raw = fs.readFileSync(SHOPS_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function getVisits(): Visit[] {
  const raw = fs.readFileSync(VISITS_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function getShopById(id: string): Shop | undefined {
  return getShops().find((s) => s.id === id);
}

export function getVisitById(id: string): Visit | undefined {
  return getVisits().find((v) => v.id === id);
}

export function getVisitsByShopId(shopId: string): Visit[] {
  return getVisits().filter((v) => v.shopId === shopId);
}

export function saveShop(shop: Shop): void {
  const shops = getShops();
  shops.push(shop);
  fs.writeFileSync(SHOPS_FILE, JSON.stringify(shops, null, 2));
}

export function saveVisit(visit: Visit): void {
  const visits = getVisits();
  visits.push(visit);
  fs.writeFileSync(VISITS_FILE, JSON.stringify(visits, null, 2));
}

export function shopExists(name: string, address: string): boolean {
  const shops = getShops();
  return shops.some(
    (s) =>
      s.name.toLowerCase() === name.toLowerCase() ||
      s.address.toLowerCase() === address.toLowerCase()
  );
}

export function getAverageRating(visits: Visit[]): number {
  if (visits.length === 0) return 0;
  const sum = visits.reduce((acc, v) => acc + v.ratings.overall, 0);
  return Math.round((sum / visits.length) * 10) / 10;
}

export function getElite8(): (Visit & { shopName: string })[] {
  const visits = getVisits();
  const shops = getShops();
  const shopMap = new Map(shops.map((s) => [s.id, s]));

  return visits
    .map((v) => ({ ...v, shopName: shopMap.get(v.shopId)?.name ?? 'Unknown' }))
    .sort((a, b) => {
      if (b.ratings.overall !== a.ratings.overall) {
        return b.ratings.overall - a.ratings.overall;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 8);
}

export function getRecentVisits(n = 3): (Visit & { shopName: string; shopAddress: string })[] {
  const visits = getVisits();
  const shops = getShops();
  const shopMap = new Map(shops.map((s) => [s.id, s]));

  return visits
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, n)
    .map((v) => ({
      ...v,
      shopName: shopMap.get(v.shopId)?.name ?? 'Unknown',
      shopAddress: shopMap.get(v.shopId)?.address ?? '',
    }));
}

export function searchVisits(query: {
  name?: string;
  zipCode?: string;
  style?: string;
}): (Visit & { shopName: string; shopAddress: string; shopZip: string })[] {
  const visits = getVisits();
  const shops = getShops();
  const shopMap = new Map(shops.map((s) => [s.id, s]));

  return visits
    .map((v) => {
      const shop = shopMap.get(v.shopId);
      return {
        ...v,
        shopName: shop?.name ?? 'Unknown',
        shopAddress: shop?.address ?? '',
        shopZip: shop?.zipCode ?? '',
      };
    })
    .filter((v) => {
      if (query.name && !v.shopName.toLowerCase().includes(query.name.toLowerCase())) return false;
      if (query.zipCode && !v.shopZip.includes(query.zipCode)) return false;
      if (query.style && !v.style.toLowerCase().includes(query.style.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
