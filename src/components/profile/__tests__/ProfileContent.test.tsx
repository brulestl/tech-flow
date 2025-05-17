import { render, screen, fireEvent } from '@testing-library/react';
import ProfileContent from '../ProfileContent';
import { UserProfile } from '@/lib/utils';

// Mock the utility functions
jest.mock('@/lib/utils', () => ({
  getFromStorage: jest.fn(),
  setToStorage: jest.fn(),
}));

describe('ProfileContent', () => {
  const mockProfile: UserProfile = {
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    streak: 5,
    flashcardsMastered: 42,
    activeSessions: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/lib/utils').getFromStorage as jest.Mock).mockReturnValue(mockProfile);
  });

  it('should render profile information', () => {
    render(<ProfileContent />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('5 day streak')).toBeInTheDocument();
    expect(screen.getByText('42 flashcards mastered')).toBeInTheDocument();
    expect(screen.getByText('2 active sessions')).toBeInTheDocument();
  });

  it('should show default values when profile is missing', () => {
    (require('@/lib/utils').getFromStorage as jest.Mock).mockReturnValue(null);
    
    render(<ProfileContent />);
    
    expect(screen.getByText('Anonymous User')).toBeInTheDocument();
    expect(screen.getByText('0 day streak')).toBeInTheDocument();
    expect(screen.getByText('0 flashcards mastered')).toBeInTheDocument();
    expect(screen.getByText('0 active sessions')).toBeInTheDocument();
  });

  it('should display profile avatar', () => {
    render(<ProfileContent />);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'Test User');
  });

  it('should show default avatar when none provided', () => {
    const profileWithoutAvatar = {
      ...mockProfile,
      avatar: undefined,
    };
    (require('@/lib/utils').getFromStorage as jest.Mock).mockReturnValue(profileWithoutAvatar);
    
    render(<ProfileContent />);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', '/default-avatar.png');
  });

  it('should handle profile edit', () => {
    const mockOnEdit = jest.fn();
    render(<ProfileContent onEdit={mockOnEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('should display achievement badges', () => {
    render(<ProfileContent />);
    
    expect(screen.getByText('5 Day Streak')).toBeInTheDocument();
    expect(screen.getByText('Flashcard Master')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<ProfileContent isLoading={true} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should handle profile update', async () => {
    const mockOnUpdate = jest.fn();
    render(<ProfileContent onUpdate={mockOnUpdate} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockProfile,
      name: 'New Name',
    });
  });
}); 