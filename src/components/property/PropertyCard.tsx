
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Bed, Bath, Calendar, Edit, Trash2 } from "lucide-react";
import type { Property } from '@/types/database';

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
  onViewDetails?: (property: Property) => void;
  showActions?: boolean;
}

const PropertyCard = ({ property, onEdit, onDelete, onViewDetails, showActions = false }: PropertyCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rented':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPropertyType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {/* Property Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-lg flex items-center justify-center relative">
        <Home className="h-16 w-16 text-gray-400" />
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className={getStatusColor(property.status)}>
            {property.status === 'available' ? 'Available' : 
             property.status === 'rented' ? 'Rented' : 'Pending'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">£{property.rent}</div>
            <div className="text-sm text-gray-500">/month</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location and Property Details */}
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
          </div>
          <Badge variant="outline" className="text-xs">
            {formatPropertyType(property.property_type)}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          Available from {formatDate(property.available_from)}
        </div>

        {/* Description */}
        {property.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
        )}

        {/* Amenities */}
        {property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs bg-gray-100">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {showActions ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit?.(property)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete?.(property.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => onViewDetails?.(property)}
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
