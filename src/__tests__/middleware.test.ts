import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

// Mock next/server
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(),
  },
  NextRequest: jest.fn(),
}));

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockNextRequest = (url: string, headers?: HeadersInit): NextRequest => {
    const request = new NextRequest(url, { headers });
    return request;
  };

  it('should redirect to login for protected routes when not authenticated', () => {
    const request = createMockNextRequest('http://localhost:3000/dashboard');
    const response = middleware(request);
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', request.url));
  });

  it('should allow access to public routes', () => {
    const request = createMockNextRequest('http://localhost:3000/login');
    const response = middleware(request);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should allow access to API routes', () => {
    const request = createMockNextRequest('http://localhost:3000/api/summarize');
    const response = middleware(request);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should allow access to static files', () => {
    const request = createMockNextRequest('http://localhost:3000/favicon.ico');
    const response = middleware(request);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should handle authentication for protected routes', () => {
    // Mock authenticated session
    const request = createMockNextRequest('http://localhost:3000/dashboard', {
      cookie: 'session=valid-session-token'
    });
    
    // Mock session validation
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { id: '1' } })
      } as Response)
    );

    const response = middleware(request);
    
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('should handle authentication errors gracefully', () => {
    const request = createMockNextRequest('http://localhost:3000/dashboard', {
      cookie: 'session=invalid-token'
    });
    
    // Mock session validation error
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 401
      } as Response)
    );

    const response = middleware(request);
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/login', request.url));
  });
}); 