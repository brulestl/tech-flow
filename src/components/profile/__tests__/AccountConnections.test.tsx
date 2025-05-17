import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import AccountConnections from '../AccountConnections';
import { toast } from '@/components/ui/use-toast';

// Mock dependencies
jest.mock('@supabase/auth-helpers-react');
jest.mock('@/components/ui/use-toast');

describe('AccountConnections', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  };

  const mockUser = {
    id: '123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
    (useUser as jest.Mock).mockReturnValue(mockUser);
    (toast as jest.Mock).mockImplementation(() => {});
  });

  it('renders connection options for Twitter and Instagram', () => {
    render(<AccountConnections />);
    
    expect(screen.getByText('Connected Accounts')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  it('shows connected state when user has linked accounts', async () => {
    const mockIdentities = [
      {
        provider: 'twitter',
        identity_data: {
          username: 'testuser',
        },
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { identities: mockIdentities },
      error: null,
    });

    render(<AccountConnections />);

    await waitFor(() => {
      expect(screen.getByText('Connected as @testuser')).toBeInTheDocument();
    });
  });

  it('handles connect button click for Twitter', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error: null });

    render(<AccountConnections />);

    const connectButton = screen.getAllByText('Connect')[0];
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'twitter',
        options: {
          redirectTo: expect.any(String),
        },
      });
    });
  });

  it('handles connect button click for Instagram', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error: null });

    render(<AccountConnections />);

    const connectButton = screen.getAllByText('Connect')[1];
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'instagram',
        options: {
          redirectTo: expect.any(String),
        },
      });
    });
  });

  it('shows error toast when connection fails', async () => {
    const error = new Error('Connection failed');
    mockSupabase.auth.signInWithOAuth.mockRejectedValue(error);

    render(<AccountConnections />);

    const connectButton = screen.getAllByText('Connect')[0];
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Connection Error',
        description: 'Failed to connect to twitter. Please try again.',
        variant: 'destructive',
      });
    });
  });

  it('shows disconnect button when account is connected', async () => {
    const mockIdentities = [
      {
        provider: 'twitter',
        identity_data: {
          username: 'testuser',
        },
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { identities: mockIdentities },
      error: null,
    });

    render(<AccountConnections />);

    await waitFor(() => {
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });
  });

  it('handles disconnect button click', async () => {
    const mockIdentities = [
      {
        provider: 'twitter',
        identity_data: {
          username: 'testuser',
        },
      },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { identities: mockIdentities },
      error: null,
    });

    render(<AccountConnections />);

    await waitFor(() => {
      const disconnectButton = screen.getByText('Disconnect');
      fireEvent.click(disconnectButton);
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Disconnect Not Implemented',
      description: 'The disconnect functionality needs to be implemented with Supabase Admin API.',
      variant: 'destructive',
    });
  });
}); 