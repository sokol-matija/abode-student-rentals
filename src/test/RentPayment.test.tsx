
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import RentPayment from '@/components/payment/RentPayment';
import type { Property } from '@/types/database';

const mockProperty: Property = {
  id: '1',
  owner_id: 'owner123',
  title: 'Test Property',
  description: 'Test description',
  rent: 1200,
  location: 'Test Location',
  bedrooms: 2,
  bathrooms: 1,
  property_type: 'apartment',
  status: 'available',
  amenities: [],
  available_from: '2024-01-01',
  images: [],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('RentPayment', () => {
  it('renders payment component with correct rent amount', () => {
    render(<RentPayment property={mockProperty} currentUserId="user123" />);
    
    expect(screen.getByText('Monthly Rent Payment')).toBeInTheDocument();
    expect(screen.getByText('£1,200')).toBeInTheDocument();
    expect(screen.getByText('per month')).toBeInTheDocument();
  });

  it('displays payment buttons', () => {
    render(<RentPayment property={mockProperty} currentUserId="user123" />);
    
    expect(screen.getByText('Start Monthly Rent Payment')).toBeInTheDocument();
    expect(screen.getByText('Manage Subscription')).toBeInTheDocument();
  });

  it('shows secure payment message', () => {
    render(<RentPayment property={mockProperty} currentUserId="user123" />);
    
    expect(screen.getByText('Secure payment powered by Stripe')).toBeInTheDocument();
    expect(screen.getByText(/Your first payment starts the monthly subscription/)).toBeInTheDocument();
  });

  it('disables payment button when no user is logged in', () => {
    render(<RentPayment property={mockProperty} currentUserId={undefined} />);
    
    const paymentButton = screen.getByText('Start Monthly Rent Payment');
    expect(paymentButton).toBeDisabled();
  });
});
