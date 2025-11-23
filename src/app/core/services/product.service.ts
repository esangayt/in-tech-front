import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductListResponse, ProductFilters } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters?: ProductFilters): Observable<ProductListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.sku) {
        params = params.set('sku', filters.sku);
      }
      if (filters.price_min !== undefined && filters.price_min !== null) {
        params = params.set('price_min', filters.price_min.toString());
      }
      if (filters.price_max !== undefined && filters.price_max !== null) {
        params = params.set('price_max', filters.price_max.toString());
      }
      if (filters.q) {
        params = params.set('q', filters.q);
      }
      if (filters.ordering) {
        params = params.set('ordering', filters.ordering);
      }
      if (filters.page) {
        params = params.set('page', filters.page.toString());
      }
    }

    return this.http.get<ProductListResponse>(`${this.apiUrl}/`, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}/`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}

