
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Shield } from "lucide-react";

interface LandingPageProps {
  onShowAuth: () => void;
}

const LandingPage = ({ onShowAuth }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">StudyNest</span>
          </div>
          <Button 
            onClick={onShowAuth}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="text-blue-600 block">Student Home</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with trusted property owners and discover affordable, comfortable accommodation designed for students.
          </p>
          <Button 
            size="lg" 
            onClick={onShowAuth}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Find Properties</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Browse verified student accommodation with detailed photos, amenities, and location information.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Connect Directly</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Message property owners directly to arrange viewings and discuss rental terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Safe & Secure</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                All users are verified through Google authentication for your safety and peace of mind.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Home?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have found their perfect accommodation through StudyNest.
          </p>
          <Button 
            size="lg" 
            onClick={onShowAuth}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Sign Up Now
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
