import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PropertyCard from '@/components/property/PropertyCard';
import type { Property } from '@/types/database';

const mockProperty: Property = {
  id: '1',
  owner_id: 'owner123',
  title: 'Cozy Studio Apartment',
  description: 'A lovely studio near campus',
  rent: 800,
  location: 'Manchester City Centre',
  bedrooms: 1,
  bathrooms: 1,
  property_type: 'studio',
  status: 'available',
  amenities: ['WiFi', 'Parking'],
  available_from: '2024-01-01',
  images: ['image1.jpg'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} currentUserId="user123" />);
    
    expect(screen.getByText('Cozy Studio Apartment')).toBeInTheDocument();
    expect(screen.getByText('Manchester City Centre')).toBeInTheDocument();
    expect(screen.getByText('£800')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
    expect(screen.getByText('1 bed')).toBeInTheDocument();
    expect(screen.getByText('1 bath')).toBeInTheDocument();
  });

  it('displays amenities correctly', () => {
    render(<PropertyCard property={mockProperty} currentUserId="user123" />);
    
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
  });

  it('shows available status badge', () => {
    render(<PropertyCard property={mockProperty} currentUserId="user123" />);
    
    expect(screen.getByText('Available')).toBeInTheDocument();
  });
});
