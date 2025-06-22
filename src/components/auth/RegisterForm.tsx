import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const RegisterForm = ({ onSwitchToLogin, onClose }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('=== REGISTRATION DEBUG START ===');
      console.log('Email:', email);
      console.log('Password length:', password.length);
      console.log('Current URL:', window.location.origin);
      
      // First, let's test the Supabase connection
      console.log('Testing Supabase connection...');
      const { data: connectionTest, error: connectionError } = await supabase.auth.getSession();
      console.log('Connection test result:', { data: connectionTest, error: connectionError });
      
      console.log('Attempting user registration...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: 'New User',
            phone: ''
          }
        }
      });

      console.log('=== REGISTRATION RESPONSE ===');
      console.log('Full response data:', JSON.stringify(data, null, 2));
      console.log('Error details:', error);
      console.log('Error code:', error?.status);
      console.log('Error message:', error?.message);
      console.log('=== END REGISTRATION RESPONSE ===');

      if (error) {
        console.error('Registration failed with error:', error);
        
        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message?.includes('email')) {
          errorMessage = "Email address may already be registered or invalid.";
        } else if (error.message?.includes('password')) {
          errorMessage = "Password does not meet requirements.";
        } else if (error.message?.includes('signup')) {
          errorMessage = "Registration is currently disabled or misconfigured.";
        }
        
        toast({
          title: "Registration Failed",
          description: `${errorMessage} (${error.status || 'Unknown error'})`,
          variant: "destructive",
        });
      } else {
        console.log('Registration appears successful!');
        console.log('User created:', data.user ? 'Yes' : 'No');
        console.log('Session created:', data.session ? 'Yes' : 'No');
        console.log('User email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
        
        toast({
          title: "Registration Successful!",
          description: data.session ? 
            "You have been automatically signed in!" : 
            "Please check your email to confirm your account.",
        });
        
        // Handle different registration outcomes
        if (data.session) {
          console.log('User has active session, closing modal');
          onClose();
        } else if (data.user && !data.user.email_confirmed_at) {
          console.log('User created but needs email confirmation');
          toast({
            title: "Email Confirmation Required",
            description: "Please check your email and click the confirmation link to complete registration.",
          });
          onSwitchToLogin();
        } else {
          console.log('Registration completed, switching to login');
          onSwitchToLogin();
        }
      }
    } catch (error: any) {
      console.error('=== UNEXPECTED ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error object:', error);
      console.error('Error stack:', error.stack);
      console.error('=== END UNEXPECTED ERROR ===');
      
      toast({
        title: "Unexpected Error",
        description: `Registration failed: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('=== REGISTRATION DEBUG END ===');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      console.log('Attempting Google sign up');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Google sign up error:', error);
        toast({
          title: "Google Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Unexpected Google sign up error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred with Google sign up.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Sign up for your StudyNest account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button 
          onClick={handleGoogleSignUp}
          variant="outline"
          className="w-full flex items-center justify-center gap-3"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
