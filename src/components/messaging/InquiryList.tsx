
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin, Calendar, User } from "lucide-react";
import { getInquiries, updateInquiryStatus } from '@/services/database';
import { useToast } from "@/hooks/use-toast";
import type { Profile } from '@/types/database';

interface InquiryListProps {
  profile: Profile;
}

const InquiryList = ({ profile }: InquiryListProps) => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInquiries();
  }, [profile]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await getInquiries(profile.id, profile.role);
      setInquiries(data || []);
    } catch (error) {
      console.error('Error loading inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (inquiryId: string, status: 'pending' | 'responded' | 'closed') => {
    try {
      await updateInquiryStatus(inquiryId, status);
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
        )
      );
      toast({
        title: "Status Updated",
        description: `Inquiry marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading messages...</p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages</h3>
          <p className="text-gray-600">
            {profile.role === 'student' 
              ? "Send inquiries to property owners to start conversations."
              : "Inquiries from students will appear here."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400"  />
                <div>
                  <CardTitle className="text-lg">
                    {profile.role === 'student' 
                      ? inquiry.owner_profiles?.full_name || 'Property Owner'
                      : inquiry.profiles?.full_name || 'Student'
                    }
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {inquiry.properties?.title}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={
                    inquiry.status === 'pending' ? 'default' :
                    inquiry.status === 'responded' ? 'secondary' : 'outline'
                  }
                  className="capitalize"
                >
                  {inquiry.status}
                </Badge>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{inquiry.message}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Property: {inquiry.properties?.title} - £{inquiry.properties?.rent}/month
              </div>
              
              {profile.role === 'property_owner' && inquiry.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateStatus(inquiry.id, 'responded')}
                  >
                    Mark as Responded
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus(inquiry.id, 'closed')}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InquiryList;
