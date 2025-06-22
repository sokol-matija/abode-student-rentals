import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Building, MessageCircle, User, Bell, Calendar } from "lucide-react";
import AddPropertyForm from '../property/AddPropertyForm';
import PropertyCard from '../property/PropertyCard';

interface PropertyOwnerDashboardProps {
  profile: {
    fullName: string;
    phone: string;
  };
}

interface Property {
  id: string;
  title: string;
  description: string;
  rent: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  availableFrom: string;
  propertyType: string;
  status: 'available' | 'rented' | 'pending';
}

const PropertyOwnerDashboard = ({ profile }: PropertyOwnerDashboardProps) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [showAddForm, setShowAddForm] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  const tabs = [
    { id: 'properties', label: 'My Properties', icon: Building },
    { id: 'bookings', label: 'Booking Requests', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const handleAddProperty = (propertyData: any) => {
    const newProperty: Property = {
      id: Date.now().toString(),
      ...propertyData,
      status: 'available' as const
    };
    setProperties(prev => [...prev, newProperty]);
    setShowAddForm(false);
  };

  const handleEditProperty = (property: Property) => {
    console.log('Edit property:', property);
    // TODO: Implement edit functionality
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

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
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-700">{profile.fullName}</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Property Owner
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
                      ? 'border-green-600 text-green-600'
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
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {showAddForm ? (
              <AddPropertyForm 
                onSubmit={handleAddProperty}
                onCancel={() => setShowAddForm(false)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
                    {properties.length > 0 && (
                      <p className="text-gray-600 mt-1">{properties.length} propert{properties.length === 1 ? 'y' : 'ies'} listed</p>
                    )}
                  </div>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Button>
                </div>
                
                {properties.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No properties listed yet</h3>
                      <p className="text-gray-600 mb-6">Create your first property listing to start connecting with students.</p>
                      <Button 
                        onClick={() => setShowAddForm(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Property
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onEdit={handleEditProperty}
                        onDelete={handleDeleteProperty}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests</h3>
                <p className="text-gray-600">Booking requests from students will appear here.</p>
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
                <p className="text-gray-600">Messages from interested students will appear here.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertyOwnerDashboard;
