import { HttpParams } from '@angular/common/http';

export function buildHttpParams<T extends Record<string, any>>(
  filters?: T
): HttpParams {
  let params = new HttpParams();

  if (!filters) return params;

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params = params.set(key, value.toString());
    }
  });

  return params;
}
