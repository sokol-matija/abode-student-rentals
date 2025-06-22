
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building, Phone, ArrowRight } from "lucide-react";

interface ProfileSetupProps {
  role: 'student' | 'property_owner';
  onComplete: (profileData: { fullName: string; phone: string }) => void;
}

const ProfileSetup = ({ role, onComplete }: ProfileSetupProps) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onComplete({ fullName: fullName.trim(), phone: phone.trim() });
    setLoading(false);
  };

  const roleConfig = {
    student: {
      icon: User,
      color: 'blue',
      title: 'Student Profile',
      description: 'Complete your profile to start browsing properties'
    },
    property_owner: {
      icon: Building,
      color: 'green',
      title: 'Property Owner Profile',
      description: 'Complete your profile to start listing properties'
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 bg-${config.color}-100 rounded-full flex items-center justify-center mb-4`}>
            <Icon className={`h-8 w-8 text-${config.color}-600`} />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <p className="text-gray-600 text-sm">{config.description}</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button 
              type="submit"
              className={`w-full h-12 bg-${config.color}-600 hover:bg-${config.color}-700`}
              disabled={!fullName.trim() || !phone.trim() || loading}
            >
              {loading ? (
                'Setting up your profile...'
              ) : (
                <>
                  Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
