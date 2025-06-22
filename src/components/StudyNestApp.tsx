
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, getProfile, createProfile } from '@/services/database';
import RoleSelection from './auth/RoleSelection';
import ProfileSetup from './auth/ProfileSetup';
import StudentDashboard from './dashboard/StudentDashboard';
import PropertyOwnerDashboard from './dashboard/PropertyOwnerDashboard';
import AuthModal from './auth/AuthModal';
import type { Profile } from '@/types/database';

type AppState = 'loading' | 'auth' | 'role-selection' | 'profile-setup' | 'dashboard';
type UserRole = 'student' | 'property_owner';

const StudyNestApp = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkUser();
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setAppState('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setAppState('auth');
        return;
      }

      try {
        const profile = await getProfile(user.id);
        setUserProfile(profile);
        setAppState('dashboard');
      } catch (error) {
        // Profile doesn't exist, need to create one
        console.log('Profile not found, showing role selection');
        setAppState('role-selection');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setAppState('auth');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAppState('profile-setup');
  };

  const handleProfileComplete = async (profileData: { fullName: string; phone: string }) => {
    if (!selectedRole) return;

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const newProfile = await createProfile({
        id: user.id,
        full_name: profileData.fullName,
        phone: profileData.phone,
        role: selectedRole
      });

      setUserProfile(newProfile);
      setAppState('dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (appState === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to StudyNest</h1>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </button>
        </div>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  if (appState === 'role-selection') {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (appState === 'profile-setup' && selectedRole) {
    return (
      <ProfileSetup 
        role={selectedRole} 
        onComplete={handleProfileComplete} 
      />
    );
  }

  if (appState === 'dashboard' && userProfile) {
    if (userProfile.role === 'student') {
      return <StudentDashboard profile={userProfile} />;
    } else {
      return <PropertyOwnerDashboard profile={userProfile} />;
    }
  }

  return null;
};

export default StudyNestApp;
