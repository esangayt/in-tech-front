export interface Product {
  id?: number;
  name: string;
  sku: string;
  price: number;
  owner?: number | null;
  owner_details?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductFilters {
  sku?: string;
  price_min?: number;
  price_max?: number;
  q?: string;
  ordering?: string;
  page?: number;
}

