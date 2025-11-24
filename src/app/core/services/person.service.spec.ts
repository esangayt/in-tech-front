import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PersonService } from './person.service';
import { Person, PersonListResponse, PersonFilters } from '../models/person.model';
import { environment } from '@env/environment';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;

  const mockPerson: Person = {
    id: 1,
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan@example.com',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  };


  // 
  const mockPersonListResponse: PersonListResponse = {
    count: 2,
    next: null,
    previous: null,
    results: [
      mockPerson,
      {
        id: 2,
        first_name: 'María',
        last_name: 'García',
        email: 'maria@example.com',
        created_at: '2024-01-16T10:00:00Z',
        updated_at: '2024-01-16T10:00:00Z'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PersonService]
    });

    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPersons', () => {
    it('should retrieve persons list without filters', (done) => {
      service.getPersons().subscribe({
        next: (response) => {
          expect(response).toEqual(mockPersonListResponse);
          expect(response.results.length).toBe(2);
          expect(response.count).toBe(2);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPersonListResponse);
    });

    it('should retrieve persons list with filters', (done) => {
      const filters: PersonFilters = {
        search: 'Juan',
        ordering: '-created_at',
        page: 1,
        page_size: 10
      };

      service.getPersons(filters).subscribe({
        next: (response) => {
          expect(response).toEqual(mockPersonListResponse);
          done();
        }
      });

      const req = httpMock.expectOne((request) => {
        return request.url === `${environment.apiBaseUrl}/api/v1/auth/persons/` &&
               request.params.has('search') &&
               request.params.get('search') === 'Juan';
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockPersonListResponse);
    });

    it('should handle error when retrieving persons', (done) => {
      service.getPersons().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getPerson', () => {
    it('should retrieve a single person by id', (done) => {
      const personId = '1';

      service.getPerson(personId).subscribe({
        next: (person) => {
          expect(person).toEqual(mockPerson);
          expect(person.id).toBe(1);
          expect(person.first_name).toBe('Juan');
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/${personId}/`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPerson);
    });

    it('should handle error when person not found', (done) => {
      const personId = '999';

      service.getPerson(personId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/${personId}/`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createPerson', () => {
    it('should create a new person', (done) => {
      const newPerson: Person = {
        first_name: 'Carlos',
        last_name: 'López',
        email: 'carlos@example.com',
      };

      const createdPerson: Person = {
        ...newPerson,
        id: 3,
        created_at: '2024-01-17T10:00:00Z',
        updated_at: '2024-01-17T10:00:00Z'
      };

      service.createPerson(newPerson).subscribe({
        next: (person) => {
          expect(person).toEqual(createdPerson);
          expect(person.id).toBe(3);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPerson);
      req.flush(createdPerson);
    });

    it('should handle validation error when creating person', (done) => {
      const invalidPerson: Person = {
        first_name: '',
        last_name: '',
        email: 'invalid-email'
      };

      service.createPerson(invalidPerson).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/`);
      req.flush('Validation error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updatePerson', () => {
    it('should update an existing person', (done) => {
      const personId = '1';
      const updateData: Partial<Person> = {
        email: 'juan.updated@example.com',
      };

      const updatedPerson: Person = {
        ...mockPerson,
        ...updateData,
        updated_at: '2024-01-18T10:00:00Z'
      };

      service.updatePerson(personId, updateData).subscribe({
        next: (person) => {
          expect(person).toEqual(updatedPerson);
          expect(person.email).toBe('juan.updated@example.com');
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/${personId}/`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedPerson);
    });

    it('should handle error when updating non-existent person', (done) => {
      const personId = '999';
      const updateData: Partial<Person> = { email: 'test@example.com' };

      service.updatePerson(personId, updateData).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/${personId}/`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deletePerson', () => {
    it('should delete a person', (done) => {
      const personId = 1;

      service.deletePerson(personId).subscribe({
        next: () => {
          expect(true).toBe(true);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/${personId}/`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting person', (done) => {
      const personId = 999;

      service.deletePerson(personId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/auth/persons/${personId}/`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});

