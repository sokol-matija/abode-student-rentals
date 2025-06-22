
import { useState } from 'react';
import RoleSelection from './auth/RoleSelection';
import ProfileSetup from './auth/ProfileSetup';
import StudentDashboard from './dashboard/StudentDashboard';
import PropertyOwnerDashboard from './dashboard/PropertyOwnerDashboard';

type AppState = 'role-selection' | 'profile-setup' | 'dashboard';
type UserRole = 'student' | 'property_owner';

interface UserProfile {
  role: UserRole;
  fullName: string;
  phone: string;
}

const StudyNestApp = () => {
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAppState('profile-setup');
  };

  const handleProfileComplete = (profileData: { fullName: string; phone: string }) => {
    if (selectedRole) {
      setUserProfile({
        role: selectedRole,
        ...profileData
      });
      setAppState('dashboard');
    }
  };

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
