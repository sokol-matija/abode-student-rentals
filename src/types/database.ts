
export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: 'student' | 'property_owner';
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  rent: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  property_type: 'house' | 'apartment' | 'studio' | 'shared_room';
  status: 'available' | 'rented' | 'pending';
  amenities: string[];
  available_from: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  property_id: string;
  student_id: string;
  owner_id: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface InquiryMessage {
  id: string;
  inquiry_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface RentPayment {
  id: string;
  property_id: string;
  tenant_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  monthly_rent: number;
  status: 'active' | 'cancelled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}
