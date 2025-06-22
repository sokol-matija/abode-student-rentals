
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, ArrowRight } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelect: (role: 'student' | 'property_owner') => void;
}

const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'property_owner' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to StudyNest!
          </h1>
          <p className="text-lg text-gray-600">
            Let's set up your account. What brings you here?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all duration-200 ${
              selectedRole === 'student' 
                ? 'border-2 border-blue-500 bg-blue-50 shadow-lg' 
                : 'border hover:shadow-md hover:border-blue-200'
            }`}
            onClick={() => setSelectedRole('student')}
          >
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedRole === 'student' ? 'bg-blue-200' : 'bg-blue-100'
              }`}>
                <User className={`h-8 w-8 ${
                  selectedRole === 'student' ? 'text-blue-700' : 'text-blue-600'
                }`} />
              </div>
              <CardTitle className="text-xl">I'm a Student</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                I'm looking for accommodation while studying
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Browse available properties</li>
                <li>• Contact property owners</li>
                <li>• Find your perfect student home</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-200 ${
              selectedRole === 'property_owner' 
                ? 'border-2 border-green-500 bg-green-50 shadow-lg' 
                : 'border hover:shadow-md hover:border-green-200'
            }`}
            onClick={() => setSelectedRole('property_owner')}
          >
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedRole === 'property_owner' ? 'bg-green-200' : 'bg-green-100'
              }`}>
                <Building className={`h-8 w-8 ${
                  selectedRole === 'property_owner' ? 'text-green-700' : 'text-green-600'
                }`} />
              </div>
              <CardTitle className="text-xl">I'm a Property Owner</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                I have properties to rent to students
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• List your properties</li>
                <li>• Manage bookings</li>
                <li>• Connect with students</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            size="lg"
            className={`px-8 py-3 ${
              selectedRole === 'student' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : selectedRole === 'property_owner'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400'
            }`}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
