
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Plus, MessageSquare, LogOut, User } from "lucide-react";
import AddPropertyForm from '../property/AddPropertyForm';
import PropertyCard from '../property/PropertyCard';
import { getProperties, deleteProperty, signOut } from '@/services/database';
import { useToast } from "@/hooks/use-toast";
import type { Profile, Property } from '@/types/database';

interface PropertyOwnerDashboardProps {
  profile: Profile;
}

const PropertyOwnerDashboard = ({ profile }: PropertyOwnerDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'add-property' | 'messages'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties(profile.id);
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyAdded = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...prev]);
    setActiveTab('properties');
    toast({
      title: "Success",
      description: "Property added successfully!",
    });
  };

  const handleEditProperty = (property: Property) => {
    // TODO: Implement edit functionality
    console.log('Edit property:', property);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast({
        title: "Success",
        description: "Property deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const stats = {
    totalProperties: properties.length,
    availableProperties: properties.filter(p => p.status === 'available').length,
    rentedProperties: properties.filter(p => p.status === 'rented').length,
    pendingProperties: properties.filter(p => p.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">StudyNest</span>
              <span className="text-sm text-gray-500 ml-4">Property Owner</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{profile.full_name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-2 border-b-2 font-medium text-sm ${
              activeTab === 'properties'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('add-property')}
            className={`pb-2 border-b-2 font-medium text-sm ${
              activeTab === 'add-property'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Add Property
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-2 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Messages
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProperties}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.availableProperties}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rented</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.rentedProperties}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingProperties}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button onClick={() => setActiveTab('add-property')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Property
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('messages')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'properties' && (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                  <p className="text-gray-600 mb-6">Get started by adding your first property listing.</p>
                  <Button onClick={() => setActiveTab('add-property')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        )}

        {activeTab === 'add-property' && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Property</CardTitle>
            </CardHeader>
            <CardContent>
              <AddPropertyForm onSubmit={handlePropertyAdded} ownerId={profile.id} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'messages' && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600">Your inquiries and messages will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PropertyOwnerDashboard;
