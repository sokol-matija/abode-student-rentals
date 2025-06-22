import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Search, MessageCircle, User, Bell, Heart } from "lucide-react";
import PropertyCard from '../property/PropertyCard';

interface StudentDashboardProps {
  profile: {
    fullName: string;
    phone: string;
  };
}

// Sample properties for demonstration
const sampleProperties = [
  {
    id: '1',
    title: 'Modern Student Room Near University',
    description: 'Comfortable single room in a shared house, just 10 minutes walk from campus. Includes all bills and high-speed WiFi.',
    rent: 450,
    location: 'Manchester City Centre',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Bills Included', 'Furnished', 'Kitchen Access', 'Laundry'],
    images: [],
    availableFrom: '2024-09-01',
    propertyType: 'room',
    status: 'available' as const
  },
  {
    id: '2',
    title: 'Studio Apartment with Garden View',
    description: 'Self-contained studio with kitchenette and private bathroom. Perfect for students who value privacy and independence.',
    rent: 650,
    location: 'Leeds Student Quarter',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Parking', 'Garden', 'Furnished', 'Bills Included'],
    images: [],
    availableFrom: '2024-08-15',
    propertyType: 'studio',
    status: 'available' as const
  },
  {
    id: '3',
    title: 'Shared House Room with Study Space',
    description: 'Large bedroom in friendly house share with dedicated study area. Great transport links to university.',
    rent: 380,
    location: 'Birmingham Selly Oak',
    bedrooms: 1,
    bathrooms: 2,
    amenities: ['WiFi', 'Study Room', 'Kitchen Access', 'Laundry', 'Garden'],
    images: [],
    availableFrom: '2024-09-15',
    propertyType: 'room',
    status: 'available' as const
  },
  {
    id: '4',
    title: 'Luxury Student Apartment',
    description: 'Premium apartment with gym access and 24/7 security. Modern furnishing and all utilities included.',
    rent: 750,
    location: 'London Zone 2',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Gym', 'Bills Included', 'Furnished', 'Parking'],
    images: [],
    availableFrom: '2024-08-01',
    propertyType: 'studio',
    status: 'available' as const
  },
  {
    id: '5',
    title: 'Cozy Room in Victorian House',
    description: 'Character property with original features. Close to shops, restaurants and public transport.',
    rent: 420,
    location: 'Bristol Clifton',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen Access', 'Laundry', 'Bills Included'],
    images: [],
    availableFrom: '2024-09-01',
    propertyType: 'room',
    status: 'available' as const
  },
  {
    id: '6',
    title: 'Modern Shared Apartment',
    description: 'Contemporary apartment share with fellow students. Communal areas and private bedrooms.',
    rent: 520,
    location: 'Edinburgh Old Town',
    bedrooms: 1,
    bathrooms: 2,
    amenities: ['WiFi', 'Furnished', 'Kitchen Access', 'Study Room', 'Bills Included'],
    images: [],
    availableFrom: '2024-08-20',
    propertyType: 'room',
    status: 'available' as const
  }
];

const StudentDashboard = ({ profile }: StudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState('browse');

  const tabs = [
    { id: 'browse', label: 'Browse Properties', icon: Search },
    { id: 'inquiries', label: 'My Inquiries', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">StudyNest</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">{profile.fullName}</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Student
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
                <p className="text-gray-600 mt-1">{sampleProperties.length} properties available</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Advanced Search
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">My Inquiries</h1>
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
                <p className="text-gray-600">Start browsing properties to send your first inquiry!</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">Messages from property owners will appear here.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Favorite Properties</h1>
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600">Save properties you like to easily find them later.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
