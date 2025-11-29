import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordProtectedAccessProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  targetUrl: string;
  linkLabel: string;
  userEmail?: string;
}

export const PasswordProtectedAccess: React.FC<PasswordProtectedAccessProps> = ({
  isOpen,
  onOpenChange,
  targetUrl,
  linkLabel,
  userEmail
}) => {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const SUPER_ADMIN_EMAIL = 'a.mekrizvani@hotmail.com';
  const CORRECT_PASSWORD = 'MamiBabi88@%-23082022'; // Your actual password

  // ONLY allow access for the exact super admin email
  const isAuthorizedUser = userEmail === SUPER_ADMIN_EMAIL;

  const handlePasswordSubmit = async () => {
    console.log('🔐 Password Debug:', {
      userEmail,
      isAuthorizedUser,
      enteredPassword: password,
      correctPassword: CORRECT_PASSWORD,
      passwordsMatch: password === CORRECT_PASSWORD
    });

    if (!isAuthorizedUser) {
      console.log('❌ User not authorized:', userEmail);
      toast({
        title: "❌ Access Denied",
        description: "Only a.mekrizvani@hotmail.com can access external links.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password === CORRECT_PASSWORD) {
      toast({
        title: "✅ Access Granted",
        description: `Redirecting to ${linkLabel}...`,
      });
      
      // Close modal and redirect
      onOpenChange(false);
      setPassword('');
      
      // Open the external link
      window.open(targetUrl, '_blank');
    } else {
      toast({
        title: "❌ Access Denied",
        description: "Incorrect password.",
        variant: "destructive"
      });
      setPassword('');
    }
    
    setIsVerifying(false);
  };

  const handleClose = () => {
    setPassword('');
    onOpenChange(false);
  };

  // Don't show the dialog if user is not authorized
  if (!isAuthorizedUser) {
    toast({
      title: "❌ Access Denied",
      description: "Only a.mekrizvani@hotmail.com can access external links.",
      variant: "destructive"
    });
    onOpenChange(false);
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <DialogTitle className="text-lg font-semibold">Password Verification</DialogTitle>
          </div>
          <p className="text-sm text-gray-600">Please enter your password to access the granting</p>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Your Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Your Email</Label>
            <Input
              id="email"
              type="email"
              value={SUPER_ADMIN_EMAIL}
              disabled
              className="bg-gray-50 text-gray-700"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
              disabled={isVerifying}
              autoFocus
              className="h-10"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isVerifying}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordSubmit} 
            disabled={!password || isVerifying}
            className="bg-blue-600 hover:bg-blue-700 px-6"
          >
            {isVerifying ? "Verifying..." : "Verify Access"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};