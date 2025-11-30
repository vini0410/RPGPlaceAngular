import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { of, throwError } from 'rxjs'; // Added for observables
import { LoginResponseDTO } from '../models/login.model';
import { UserResponseDTO } from '../models/user.model';
import { RegisterRequestDTO } from '../models/auth.model';

interface LoginRequestDTO {
  name: string; // Changed from username to name
  password: string;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let mockRouter: any;
  // let store: { [key: string]: string }; // No longer needed for localStorage mocking

  let mockLocalStorage: {
    getItem: jasmine.Spy<jasmine.Func>;
    setItem: jasmine.Spy<jasmine.Func>;
    removeItem: jasmine.Spy<jasmine.Func>;
    clear: jasmine.Spy<jasmine.Func>;
  };

  beforeEach(() => {
    // Mock localStorage BEFORE TestBed.configureTestingModule, and BEFORE injecting the service
    mockLocalStorage = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true, // Allow reassignment
    });

    // Default mock behavior for localStorage
    mockLocalStorage.getItem.and.returnValue(null); // Default to no token/user
    mockLocalStorage.setItem.and.callFake((key, value) => { /* mock implementation */ });
    mockLocalStorage.removeItem.and.callFake((key) => { /* mock implementation */ });
    mockLocalStorage.clear.and.callFake(() => { /* mock implementation */ });

    mockRouter = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure that no outstanding requests are uncaught
    // Reset localStorage to original if needed, but for tests, just cleaning the mock is usually enough
    // This part is less critical as the mock is replaced in beforeEach
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for constructor's isAuthenticated initialization
  it('AuthService constructor should set isAuthenticated based on token presence', () => {
    // Test case 1: No token
    mockLocalStorage.getItem.and.returnValue(null);
    let serviceWithoutToken = TestBed.inject(AuthService); // Inject a fresh instance
    expect(serviceWithoutToken.isAuthenticated()).toBeFalse();

    // Test case 2: With token
    mockLocalStorage.getItem.and.returnValue('some_token');
    let serviceWithToken = TestBed.inject(AuthService); // Inject another fresh instance
    expect(serviceWithToken.isAuthenticated()).toBeTrue();
  });


  describe('login', () => {
    const mockLoginRequest: LoginRequestDTO = { name: 'testuser', password: 'password123' }; // Changed username to name
    const mockUser: UserResponseDTO = { id: '1', name: 'testuser', email: 'test@example.com', createdAt: new Date(), updatedAt: new Date() };
    const mockLoginResponse: LoginResponseDTO = { token: 'jwt_token_123', user: mockUser };
    const API_URL = `${environment.apiUrl}/auth/login`;

    it('should successfully log in a user and store token/user', (done) => {
      service.login(mockLoginRequest).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('jwt_token', mockLoginResponse.token);
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(mockUser));
        expect(service.isAuthenticated()).toBeTrue();
        done();
      });

      const req = httpTestingController.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);
      req.flush(mockLoginResponse);
    });

    it('should not log in a user on error', (done) => {
      const mockErrorResponse = { status: 401, statusText: 'Unauthorized' };

      service.login(mockLoginRequest).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err.status).toBe(401);
          expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
          expect(mockLocalStorage.getItem('jwt_token')).toBeNull(); // Use mockLocalStorage.getItem
          expect(service.isAuthenticated()).toBeFalse();
          done();
        }
      });

      const req = httpTestingController.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('error'), mockErrorResponse);
    });
  });

  describe('register', () => {
    const mockRegisterRequest: RegisterRequestDTO = { name: 'newuser', email: 'new@example.com', password: 'password123' }; // Changed username to name
    const mockUser: UserResponseDTO = { id: '2', name: 'newuser', email: 'new@example.com', createdAt: new Date(), updatedAt: new Date() };
    const API_URL = `${environment.apiUrl}/auth/register`;

    it('should successfully register a user', (done) => {
      service.register(mockRegisterRequest).subscribe(response => {
        expect(response).toEqual(mockUser);
        done();
      });

      const req = httpTestingController.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRegisterRequest);
      req.flush(mockUser);
    });

    it('should re-throw error on failed registration', (done) => {
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

      service.register(mockRegisterRequest).subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err.status).toBe(400);
          done();
        }
      });

      const req = httpTestingController.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('error'), mockErrorResponse);
    });
  });

  describe('logout', () => {
    const API_URL = `${environment.apiUrl}/logout`;

    it('should successfully log out a user and clear localStorage', (done) => {
      // Set some initial state using the mock
      mockLocalStorage.getItem.and.returnValue('some_token');
      mockLocalStorage.setItem('jwt_token', 'some_token');
      // Ensure currentUser mock matches UserResponseDTO
      const initialUser: UserResponseDTO = { id: '1', name: 'initial_user', email: 'initial@example.com', createdAt: new Date(), updatedAt: new Date() };
      mockLocalStorage.setItem('currentUser', JSON.stringify(initialUser));
      
      let freshService = TestBed.inject(AuthService); // Inject a fresh service to pick up initial token
      (freshService as any).isAuthenticatedSignal.set(true); // Manually set for test scenario

      freshService.logout().subscribe(response => {
        expect(response).toEqual({}); // Assuming it returns an empty object or similar
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('jwt_token');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentUser');
        expect(freshService.isAuthenticated()).toBeFalse();
        done();
      });

      const req = httpTestingController.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });

  describe('utility methods', () => {
    const mockUser: UserResponseDTO = { id: '1', name: 'testuser', email: 'test@example.com', createdAt: new Date(), updatedAt: new Date() };

    it('getToken should return token if present', () => {
      mockLocalStorage.getItem.and.returnValue('test_token');
      expect(service.getToken()).toBe('test_token');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('jwt_token');
    });

    it('getToken should return null if no token', () => {
      mockLocalStorage.getItem.and.returnValue(null);
      expect(service.getToken()).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('jwt_token');
    });

    it('getCurrentUser should return parsed user if present', () => {
      mockLocalStorage.getItem.and.returnValue(JSON.stringify(mockUser));
      expect(service.getCurrentUser()).toEqual(mockUser);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('currentUser');
    });

    it('getCurrentUser should return null if no user', () => {
      mockLocalStorage.getItem.and.returnValue(null);
      expect(service.getCurrentUser()).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('currentUser');
    });

    it('setCurrentUser should store user in localStorage', () => {
      service.setCurrentUser(mockUser);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(mockUser));
    });

    // The test for isAuthenticated constructor logic has been moved out of this describe block
    // to the main describe block directly.
  });
});