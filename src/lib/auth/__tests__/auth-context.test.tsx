import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../auth-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

// Mock the Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AuthContext', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null,
        })),
      })),
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  const TestComponent = () => {
    const { user, signIn, signUp, signOut, updateUser } = useAuth();

    return (
      <div>
        <div data-testid="user">{user ? 'logged-in' : 'logged-out'}</div>
        <button onClick={() => signIn('test@example.com', 'password')}>
          Sign In
        </button>
        <button onClick={() => signUp('test@example.com', 'password')}>
          Sign Up
        </button>
        <button onClick={() => signOut()}>Sign Out</button>
        <button onClick={() => updateUser({ fullName: 'Test User' })}>
          Update User
        </button>
      </div>
    );
  };

  it('provides authentication context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('logged-out');
  });

  it('handles sign in', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles sign up', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles sign out', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('handles user update', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Update User'));

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('users');
    });
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = consoleError;
  });
}); 