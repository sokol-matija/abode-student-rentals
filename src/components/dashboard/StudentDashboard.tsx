
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home, Search, Filter, MapPin, LogOut, User } from "lucide-react";
import PropertyCard from '../property/PropertyCard';
import { getProperties, signOut } from '@/services/database';
import { useToast } from "@/hooks/use-toast";
import type { Profile, Property } from '@/types/database';

interface StudentDashboardProps {
  profile: Profile;
}

const StudentDashboard = ({ profile }: StudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'saved' | 'messages'>('browse');
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRent: '',
    maxRent: '',
    bedrooms: '',
    propertyType: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      // Only show available properties to students
      const availableProperties = (data || []).filter(p => p.status === 'available');
      setProperties(availableProperties);
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

  const filterProperties = () => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rent filter
    if (filters.minRent) {
      filtered = filtered.filter(property => property.rent >= parseInt(filters.minRent));
    }
    if (filters.maxRent) {
      filtered = filtered.filter(property => property.rent <= parseInt(filters.maxRent));
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.property_type === filters.propertyType);
    }

    setFilteredProperties(filtered);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleViewDetails = (property: Property) => {
    // TODO: Implement property details view
    console.log('View details for:', property);
    toast({
      title: "Property Details",
      description: `Viewing details for ${property.title}`,
    });
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
              <span className="text-sm text-gray-500 ml-4">Student</span>
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
            onClick={() => setActiveTab('browse')}
            className={`pb-2 border-b-2 font-medium text-sm ${
              activeTab === 'browse'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Browse Properties
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2 border-b-2 font-medium text-sm ${
              activeTab === 'saved'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Saved Properties
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
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by title, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Rent (£)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      value={filters.minRent}
                      onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Rent (£)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 1000"
                      value={filters.maxRent}
                      onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Bedrooms</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Any</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                      <option value="shared_room">Shared Room</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties Grid */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {properties.length === 0 ? 'No properties available' : 'No properties match your filters'}
                  </h3>
                  <p className="text-gray-600">
                    {properties.length === 0 
                      ? 'Check back later for new listings!' 
                      : 'Try adjusting your search criteria to see more results.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Showing {filteredProperties.length} of {properties.length} properties
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onViewDetails={handleViewDetails}
                      showActions={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Saved Properties</h3>
              <p className="text-gray-600">Your saved properties will appear here.</p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'messages' && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600">Your conversations with property owners will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
