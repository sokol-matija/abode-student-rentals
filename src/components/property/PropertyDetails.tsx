
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Home, Bath, Bed, Calendar, Phone, Mail, MessageSquare, Heart, Share2, X } from "lucide-react";
import { getProfile, createInquiry } from '@/services/database';
import { useToast } from "@/hooks/use-toast";
import RentPayment from '@/components/payment/RentPayment';
import type { Property, Profile } from '@/types/database';

interface PropertyDetailsProps {
  property: Property;
  open: boolean;
  onClose: () => void;
  currentUserId?: string;
}

const PropertyDetails = ({ property, open, onClose, currentUserId }: PropertyDetailsProps) => {
  const [ownerProfile, setOwnerProfile] = useState<Profile | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasActivePayment, setHasActivePayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open && property.owner_id) {
      loadOwnerProfile();
    }
  }, [open, property.owner_id, currentUserId]);

  const loadOwnerProfile = async () => {
    try {
      const profile = await getProfile(property.owner_id);
      setOwnerProfile(profile);
    } catch (error) {
      console.error('Error loading owner profile:', error);
    }
  };

  const handleSendInquiry = async () => {
    if (!currentUserId || !inquiryMessage.trim()) return;

    setLoading(true);
    try {
      await createInquiry({
        property_id: property.id,
        student_id: currentUserId,
        owner_id: property.owner_id,
        message: inquiryMessage.trim(),
        status: 'pending'
      });

      toast({
        title: "Inquiry Sent!",
        description: "Your message has been sent to the property owner.",
      });

      setInquiryMessage('');
      setShowInquiryForm(false);
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from Saved" : "Property Saved!",
      description: isSaved ? "Property removed from your saved list." : "Property added to your saved list.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Property link copied to clipboard.",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-video">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {property.images.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {property.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square">
                      <img
                        src={image}
                        alt={`${property.title} ${index + 2}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Property Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-bold text-green-600">
                        {formatCurrency(Number(property.rent))}/month
                      </CardTitle>
                      <div className="flex items-center text-gray-600 mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleSaveProperty}>
                        <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="capitalize">{property.property_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span>Available from {new Date(property.available_from).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {property.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Info and Payment */}
            <div className="space-y-4">
              {/* Rent Payment Section */}
              <RentPayment 
                property={property}
                currentUserId={currentUserId}
                hasActivePayment={hasActivePayment}
                paymentStatus={paymentStatus}
              />

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Property Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ownerProfile && (
                    <div>
                      <h4 className="font-medium">{ownerProfile.full_name}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {ownerProfile.phone}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => setShowInquiryForm(true)}
                      disabled={!currentUserId}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </Button>
                    
                    {ownerProfile && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`tel:${ownerProfile.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Property Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant={property.status === 'available' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {property.status}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Inquiry Form Modal */}
        <Dialog open={showInquiryForm} onOpenChange={setShowInquiryForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Inquiry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Message</label>
                <Textarea
                  placeholder="Hi, I'm interested in this property. When would be a good time to arrange a viewing?"
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={handleSendInquiry}
                  disabled={!inquiryMessage.trim() || loading}
                  className="flex-1"
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInquiryForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetails;
