import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token exists', () => {
    const mockToken = 'test-token-123';
    authService.getToken.and.returnValue(mockToken);

    httpClient.get('/api/persons').subscribe();

    const req = httpMock.expectOne('/api/persons');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should not add Authorization header when token does not exist', () => {
    authService.getToken.and.returnValue(null);

    httpClient.get('/api/persons').subscribe();

    const req = httpMock.expectOne('/api/persons');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip Authorization header for login endpoint', () => {
    const mockToken = 'test-token-123';
    authService.getToken.and.returnValue(mockToken);

    httpClient.post('/api/v1/auth/login', { username: 'user', password: 'pass' }).subscribe();

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip Authorization header for refresh endpoint', () => {
    const mockToken = 'test-token-123';
    authService.getToken.and.returnValue(mockToken);

    httpClient.post('/api/v1/auth/refresh', { refresh: 'refresh-token' }).subscribe();

    const req = httpMock.expectOne('/api/v1/auth/refresh');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should handle POST requests with Authorization header', () => {
    const mockToken = 'test-token-123';
    authService.getToken.and.returnValue(mockToken);

    const postData = { name: 'Test Person' };
    httpClient.post('/api/persons', postData).subscribe();

    const req = httpMock.expectOne('/api/persons');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.body).toEqual(postData);
    req.flush({});
  });

  it('should handle PUT requests with Authorization header', () => {
    //
    const mockToken = 'test-token-123';
    authService.getToken.and.returnValue(mockToken);

    const putData = { name: 'Updated Person' };
    httpClient.put('/api/persons/1', putData).subscribe();

    const req = httpMock.expectOne('/api/persons/1');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should handle DELETE requests with Authorization header', () => {
    const mockToken = 'test-token-123';
    authService.getToken.and.returnValue(mockToken);

    httpClient.delete('/api/persons/1').subscribe();

    const req = httpMock.expectOne('/api/persons/1');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should handle PATCH requests with Authorization header', () => {
    const mockToken = 'test-token-124';
    authService.getToken.and.returnValue(mockToken);

    const patchData = { email: 'updated@example.com' };
    httpClient.patch('/api/persons/1', patchData).subscribe();

    const req = httpMock.expectOne('/api/persons/1');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });

  it('should preserve other headers when adding Authorization', () => {
    const mockToken = 'test-token-123';
    authService.getToken.and.returnValue(mockToken);

    httpClient.get('/api/persons', {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'custom-value'
      }
    }).subscribe();

    const req = httpMock.expectOne('/api/persons');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('X-Custom-Header')).toBe('custom-value');
    req.flush({});
  });

  it('should work with URLs containing auth in path but not login/refresh', () => {
    const mockToken = 'test-token-123';
    authService.getToken.and.returnValue(mockToken);

    httpClient.get('/api/v1/auth/users').subscribe();

    const req = httpMock.expectOne('/api/v1/auth/users');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({});
  });
});

