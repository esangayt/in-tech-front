import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Product, ProductListResponse, ProductFilters } from '../models/product.model';
import {buildHttpParams} from '@core/utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters?: ProductFilters): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.apiUrl}/`,{params: buildHttpParams(filters)});
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

