
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload } from "lucide-react";

interface AddPropertyFormProps {
  onSubmit: (property: PropertyData) => void;
  onCancel: () => void;
}

interface PropertyData {
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
}

const AddPropertyForm = ({ onSubmit, onCancel }: AddPropertyFormProps) => {
  const [formData, setFormData] = useState<PropertyData>({
    title: '',
    description: '',
    rent: 0,
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    images: [],
    availableFrom: '',
    propertyType: 'room'
  });

  const [newAmenity, setNewAmenity] = useState('');

  const commonAmenities = [
    'WiFi', 'Parking', 'Laundry', 'Kitchen Access', 'Garden', 
    'Gym', 'Study Room', 'Bills Included', 'Furnished', 'Pet Friendly'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      addAmenity(newAmenity.trim());
      setNewAmenity('');
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-green-700">Add New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Modern Student Room Near Campus"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Manchester City Centre"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your property, nearby amenities, transportation links..."
              rows={4}
            />
          </div>

          {/* Property Details */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent (£)</Label>
              <Input
                id="rent"
                type="number"
                required
                min="0"
                value={formData.rent}
                onChange={(e) => setFormData(prev => ({ ...prev, rent: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <select
                id="propertyType"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.propertyType}
                onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
              >
                <option value="room">Single Room</option>
                <option value="shared">Shared Room</option>
                <option value="studio">Studio</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableFrom">Available From</Label>
            <Input
              id="availableFrom"
              type="date"
              required
              value={formData.availableFrom}
              onChange={(e) => setFormData(prev => ({ ...prev, availableFrom: e.target.value }))}
            />
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {commonAmenities.map((amenity) => (
                <Button
                  key={amenity}
                  type="button"
                  variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                  className={`h-8 text-xs ${formData.amenities.includes(amenity) ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => formData.amenities.includes(amenity) ? removeAmenity(amenity) : addAmenity(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </div>
            
            {/* Custom Amenity Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
              />
              <Button type="button" onClick={addCustomAmenity} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Amenities */}
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="bg-green-100 text-green-700">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload Placeholder */}
          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Image upload will be implemented with Supabase Storage</p>
              <p className="text-sm text-gray-500">For now, properties will use placeholder images</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              Create Property
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPropertyForm;
