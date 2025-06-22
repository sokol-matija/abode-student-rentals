
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home } from "lucide-react";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <Home className="h-6 w-6 text-blue-600" />
            StudyNest
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm 
              onSwitchToRegister={switchToRegister}
              onClose={onClose}
            />
          ) : (
            <RegisterForm 
              onSwitchToLogin={switchToLogin}
              onClose={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
