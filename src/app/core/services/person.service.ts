import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Person, PersonListResponse, PersonFilters } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/auth/persons`;

  constructor(private http: HttpClient) {}

  getPersons(filters?: PersonFilters): Observable<PersonListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.email) {
        params = params.set('email', filters.email);
      }
      if (filters.last_name) {
        params = params.set('last_name', filters.last_name);
      }
      if (filters.ordering) {
        params = params.set('ordering', filters.ordering);
      }
      if (filters.page) {
        params = params.set('page', filters.page.toString());
      }
    }

    return this.http.get<PersonListResponse>(`${this.apiUrl}/`, { params });
  }

  getPerson(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}/`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/`, person);
  }

  updatePerson(id: string, person: Partial<Person>): Observable<Person> {
    return this.http.patch<Person>(`${this.apiUrl}/${id}/`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}

