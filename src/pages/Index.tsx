
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Shield, MessageCircle } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import StudyNestApp from "@/components/StudyNestApp";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDemoApp, setShowDemoApp] = useState(false);

  if (showDemoApp) {
    return <StudyNestApp />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">StudyNest</span>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowDemoApp(true)}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Try Demo
            </Button>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </div>
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
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowDemoApp(true)}
              variant="outline"
              className="text-lg px-8 py-3 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Try Demo
            </Button>
            <Button 
              size="lg" 
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Get Started
            </Button>
          </div>
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
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowDemoApp(true)}
              className="bg-white/20 text-white hover:bg-white/30 text-lg px-8 py-3 border border-white/30"
            >
              Try Demo
            </Button>
            <Button 
              size="lg" 
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </main>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
