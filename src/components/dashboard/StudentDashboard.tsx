
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Search, MessageCircle, User, Bell, Heart } from "lucide-react";

interface StudentDashboardProps {
  profile: {
    fullName: string;
    phone: string;
  };
}

const StudentDashboard = ({ profile }: StudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState('browse');

  const tabs = [
    { id: 'browse', label: 'Browse Properties', icon: Search },
    { id: 'inquiries', label: 'My Inquiries', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">StudyNest</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">{profile.fullName}</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Student
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Advanced Search
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Property Cards */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-t-lg flex items-center justify-center">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Modern Student Room</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Available
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">Comfortable single room in shared house near university campus.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">£450</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">My Inquiries</h1>
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
                <p className="text-gray-600">Start browsing properties to send your first inquiry!</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">Messages from property owners will appear here.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Favorite Properties</h1>
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600">Save properties you like to easily find them later.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
