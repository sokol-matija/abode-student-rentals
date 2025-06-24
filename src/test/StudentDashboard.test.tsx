import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import type { Profile } from '@/types/database';

const mockProfile: Profile = {
  id: '123',
  full_name: 'John Doe',
  phone: '1234567890',
  role: 'student',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock useQuery
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
}));

describe('StudentDashboard', () => {
  it('renders student dashboard with correct profile information', () => {
    render(<StudentDashboard profile={mockProfile} />);
    
    expect(screen.getByText('StudyNest')).toBeInTheDocument();
    expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    expect(screen.getByText('Browse Properties')).toBeInTheDocument();
    expect(screen.getByText('My Inquiries')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('displays available properties section', () => {
    render(<StudentDashboard profile={mockProfile} />);
    
    expect(screen.getByText('Available Properties')).toBeInTheDocument();
    expect(screen.getByText('0 properties available')).toBeInTheDocument();
  });

  it('shows profile information in profile tab', () => {
    render(<StudentDashboard profile={mockProfile} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
  });
});
