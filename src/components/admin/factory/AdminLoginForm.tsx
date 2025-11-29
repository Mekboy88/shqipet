
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";
import { getRoleBadgeConfig } from './AdminRoleUtils';

interface AdminLoginFormProps {
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  allowedRole: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
  errorMessage?: string;
  isSubmitting?: boolean;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  password,
  onPasswordChange,
  onSubmit,
  allowedRole,
  colorScheme,
  errorMessage,
  isSubmitting
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-6">
      <Input
        id="password"
        type="password"
        placeholder="Enter your platform password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        aria-invalid={!!errorMessage}
        className="w-full border-2 focus:ring-2"
        style={{ 
          borderColor: (errorMessage ? '#ef4444' : colorScheme.primary + '40')
        }}
      />
      {errorMessage && (
        <p className="text-sm text-red-600 -mt-2">{errorMessage}</p>
      )}
      
      <Button 
        type="submit"
        variant="ghost"
        disabled={!password || !!isSubmitting}
        className="flex-1 w-full p-4 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200 font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <KeyRound className="h-5 w-5 mr-2" />
        {isSubmitting ? 'Checking…' : `Access ${getRoleBadgeConfig(allowedRole).text} Dashboard`}
      </Button>
      
      <div className="text-center">
        <p className="text-xs text-gray-500 mt-2">
          Only the registered {getRoleBadgeConfig(allowedRole).text} can access this portal
        </p>
      </div>
    </form>
  );
};

export default AdminLoginForm;
