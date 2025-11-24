export interface Person {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
}

export interface PersonFilters {
  email?: string;
  last_name?: string;
  search?: string;
  ordering?: string;
  page_size?: number;
  page?: number;
}

