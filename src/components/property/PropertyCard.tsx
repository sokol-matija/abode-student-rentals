
import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Calendar, Edit, Trash2, Eye } from "lucide-react";
import PropertyDetails from './PropertyDetails';
import type { Property } from '@/types/database';

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
  onViewDetails?: (property: Property) => void;
  showActions?: boolean;
  currentUserId?: string;
}

const PropertyCard = ({ 
  property, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  showActions = false,
  currentUserId 
}: PropertyCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property);
    } else {
      setShowDetails(true);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Property Image */}
        <div className="aspect-video relative">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge 
              variant={property.status === 'available' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {property.status}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(Number(property.rent))}
              </div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Property Details */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Available {new Date(property.available_from).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <Badge variant="outline" className="capitalize">
              {property.property_type.replace('_', ' ')}
            </Badge>
          </div>

          {/* Description Preview */}
          {property.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {property.description}
            </p>
          )}

          {/* Amenities Preview */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={handleViewDetails}
              className="flex-1"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            
            {showActions && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit?.(property)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete?.(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <PropertyDetails
        property={property}
        open={showDetails}
        onClose={() => setShowDetails(false)}
        currentUserId={currentUserId}
      />
    </>
  );
};

export default PropertyCard;
