
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProfile, getProfile, createProperty, getProperties } from '@/services/database';

// Mock the supabase client
const mockSupabase = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
    signOut: vi.fn(),
  },
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

describe('Database Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Profile Services', () => {
    it('creates a profile successfully', async () => {
      const mockProfileData = {
        id: '123',
        full_name: 'Test User',
        phone: '1234567890',
        role: 'student' as const,
      };

      const mockResponse = {
        data: { ...mockProfileData, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
        error: null,
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(mockResponse),
          }),
        }),
      });

      const result = await createProfile(mockProfileData);
      
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toEqual(mockResponse.data);
    });

    it('gets a profile by user ID', async () => {
      const userId = '123';
      const mockProfile = {
        id: userId,
        full_name: 'Test User',
        phone: '1234567890',
        role: 'student',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
          }),
        }),
      });

      const result = await getProfile(userId);
      
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('Property Services', () => {
    it('creates a property successfully', async () => {
      const mockPropertyData = {
        owner_id: 'owner123',
        title: 'Test Property',
        description: 'Test description',
        rent: 1000,
        location: 'Test Location',
        bedrooms: 2,
        bathrooms: 1,
        property_type: 'apartment' as const,
        status: 'available' as const,
        amenities: ['WiFi'],
        available_from: '2024-01-01',
        images: ['image1.jpg'],
      };

      const mockResponse = {
        data: { 
          ...mockPropertyData, 
          id: '1',
          created_at: '2024-01-01T00:00:00Z', 
          updated_at: '2024-01-01T00:00:00Z' 
        },
        error: null,
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(mockResponse),
          }),
        }),
      });

      const result = await createProperty(mockPropertyData);
      
      expect(mockSupabase.from).toHaveBeenCalledWith('properties');
      expect(result).toEqual(mockResponse.data);
    });

    it('gets all properties', async () => {
      const mockProperties = [
        {
          id: '1',
          title: 'Property 1',
          rent: 1000,
          location: 'Location 1',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Property 2',
          rent: 1200,
          location: 'Location 2',
          created_at: '2024-01-02T00:00:00Z',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockProperties, error: null }),
        }),
      });

      const result = await getProperties();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('properties');
      expect(result).toEqual(mockProperties);
    });
  });
});
