import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person, PersonListResponse, PersonFilters } from '../models/person.model';
import { buildHttpParams } from '@core/utils/http.utils';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/auth/persons`;

  constructor(private http: HttpClient) {}

  getPersons(filters?: PersonFilters): Observable<PersonListResponse> {
    return this.http.get<PersonListResponse>(`${this.apiUrl}/`, {params: buildHttpParams(filters)});
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

