
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { createProperty } from '@/services/database';
import { useToast } from "@/hooks/use-toast";
import type { Property } from '@/types/database';

interface PropertyFormData {
  title: string;
  description: string;
  rent: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: 'house' | 'apartment' | 'studio' | 'shared_room';
  availableFrom: string;
}

interface AddPropertyFormProps {
  onSubmit: (property: Property) => void;
  ownerId: string;
}

const AddPropertyForm = ({ onSubmit, ownerId }: AddPropertyFormProps) => {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PropertyFormData>();

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter(a => a !== amenity));
  };

  const onFormSubmit = async (data: PropertyFormData) => {
    try {
      setIsSubmitting(true);

      const propertyData = {
        owner_id: ownerId,
        title: data.title,
        description: data.description,
        rent: data.rent,
        location: data.location,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        property_type: data.propertyType,
        status: 'available' as const,
        amenities,
        available_from: data.availableFrom,
        images: [], // We'll implement image upload later
      };

      const newProperty = await createProperty(propertyData);
      onSubmit(newProperty);
      
      // Reset form
      reset();
      setAmenities([]);
      
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <Label htmlFor="title">Property Title *</Label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., Cozy 2-bed apartment near university"
            className="mt-1"
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Describe your property..."
            className="mt-1 min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Rent */}
        <div>
          <Label htmlFor="rent">Monthly Rent (£) *</Label>
          <Input
            id="rent"
            type="number"
            {...register('rent', { 
              required: 'Rent is required',
              min: { value: 1, message: 'Rent must be greater than 0' }
            })}
            placeholder="e.g., 800"
            className="mt-1"
          />
          {errors.rent && (
            <p className="text-sm text-red-600 mt-1">{errors.rent.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...register('location', { required: 'Location is required' })}
            placeholder="e.g., Birmingham City Centre"
            className="mt-1"
          />
          {errors.location && (
            <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Bedrooms */}
        <div>
          <Label htmlFor="bedrooms">Bedrooms *</Label>
          <Input
            id="bedrooms"
            type="number"
            {...register('bedrooms', { 
              required: 'Number of bedrooms is required',
              min: { value: 1, message: 'Must have at least 1 bedroom' }
            })}
            placeholder="e.g., 2"
            className="mt-1"
          />
          {errors.bedrooms && (
            <p className="text-sm text-red-600 mt-1">{errors.bedrooms.message}</p>
          )}
        </div>

        {/* Bathrooms */}
        <div>
          <Label htmlFor="bathrooms">Bathrooms *</Label>
          <Input
            id="bathrooms"
            type="number"
            {...register('bathrooms', { 
              required: 'Number of bathrooms is required',
              min: { value: 1, message: 'Must have at least 1 bathroom' }
            })}
            placeholder="e.g., 1"
            className="mt-1"
          />
          {errors.bathrooms && (
            <p className="text-sm text-red-600 mt-1">{errors.bathrooms.message}</p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <Label htmlFor="propertyType">Property Type *</Label>
          <select
            id="propertyType"
            {...register('propertyType', { required: 'Property type is required' })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select type...</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="shared_room">Shared Room</option>
          </select>
          {errors.propertyType && (
            <p className="text-sm text-red-600 mt-1">{errors.propertyType.message}</p>
          )}
        </div>

        {/* Available From */}
        <div>
          <Label htmlFor="availableFrom">Available From *</Label>
          <Input
            id="availableFrom"
            type="date"
            {...register('availableFrom', { required: 'Available date is required' })}
            className="mt-1"
          />
          {errors.availableFrom && (
            <p className="text-sm text-red-600 mt-1">{errors.availableFrom.message}</p>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <Label>Amenities</Label>
        <div className="mt-2 space-y-3">
          <div className="flex gap-2">
            <Input
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add an amenity (e.g., WiFi, Parking)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
            />
            <Button type="button" onClick={addAmenity} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
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
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
          {isSubmitting ? 'Adding Property...' : 'Add Property'}
        </Button>
      </div>
    </form>
  );
};

export default AddPropertyForm;
