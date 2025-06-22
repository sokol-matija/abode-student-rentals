
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, getProfile, createProfile } from '@/services/database';
import RoleSelection from './auth/RoleSelection';
import ProfileSetup from './auth/ProfileSetup';
import StudentDashboard from './dashboard/StudentDashboard';
import PropertyOwnerDashboard from './dashboard/PropertyOwnerDashboard';
import AuthModal from './auth/AuthModal';
import LandingPage from './LandingPage';
import type { Profile } from '@/types/database';

type AppState = 'loading' | 'landing' | 'role-selection' | 'profile-setup' | 'dashboard';
type UserRole = 'student' | 'property_owner';

const StudyNestApp = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      if (event === 'SIGNED_IN') {
        checkUser();
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setAppState('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking user authentication...');
      const user = await getCurrentUser();
      if (!user) {
        console.log('No authenticated user found');
        setAppState('landing');
        return;
      }

      console.log('User found:', user.id);
      try {
        const profile = await getProfile(user.id);
        console.log('Profile found:', profile);
        setUserProfile(profile);
        setAppState('dashboard');
      } catch (error) {
        console.log('Profile not found, showing role selection');
        setAppState('role-selection');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setAppState('landing');
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

  if (appState === 'landing') {
    return (
      <>
        <LandingPage onShowAuth={() => setShowAuthModal(true)} />
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
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
