export interface Shop {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Ratings {
  overall: number;
  dough: number;
  sauce: number;
  cheese: number;
  foldability: number;
}

export interface Visit {
  id: string;
  shopId: string;
  date: string;
  style: string;
  photoUrl?: string;
  ratings: Ratings;
  comment?: string;
}

export interface ShopWithVisits extends Shop {
  visits: Visit[];
  averageRating: number;
}
