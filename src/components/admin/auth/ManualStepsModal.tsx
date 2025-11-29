import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  CheckCircle, 
  Share2, 
  Shield,
  Settings,
  UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PasswordProtectedAccess } from './PasswordProtectedAccess';

interface ManualStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ManualStepsModalProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    estimatedTime: string;
    requiresRestart?: boolean;
    dependencies: string[];
    steps?: ManualStep[];
    externalLinks?: Array<{
      label: string;
      url: string;
      description: string;
    }>;
    whoShouldPerform?: string;
    securityImpact?: string;
    sensitiveAction?: boolean;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkComplete: (recommendationId: string) => void;
  currentUser?: string;
}

export const ManualStepsModal: React.FC<ManualStepsModalProps> = ({
  recommendation,
  isOpen,
  onOpenChange,
  onMarkComplete,
  currentUser = "Admin"
}) => {
  const { toast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState<{ url: string; label: string } | null>(null);

  const defaultSteps: ManualStep[] = recommendation.steps || [
    {
      id: "step1",
      title: "Navigate to Configuration",
      description: "Access the relevant settings panel or dashboard",
      completed: false
    },
    {
      id: "step2", 
      title: "Apply Security Changes",
      description: "Follow the security best practices and apply the recommended configuration",
      completed: false
    },
    {
      id: "step3",
      title: "Verify Changes",
      description: "Test the configuration and ensure it's working as expected",
      completed: false
    }
  ];

  const steps = defaultSteps;

  const handleStepToggle = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const allStepsCompleted = steps.every(step => completedSteps[step.id]);

  const handleMarkComplete = () => {
    onMarkComplete(recommendation.id);
    setShowConfirmation(false);
    onOpenChange(false);
    
    toast({
      title: "✅ Fix marked as completed",
      description: `${recommendation.title} completed by ${currentUser}`,
    });
  };

  const handleShareSteps = async () => {
    try {
      await navigator.clipboard.writeText(`Manual Fix: ${recommendation.title}\n\nSteps:\n${steps.map((step, i) => `${i + 1}. ${step.title}: ${step.description}`).join('\n')}`);
      toast({
        title: "Steps copied to clipboard",
        description: "Manual fix instructions have been copied",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy steps to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <SheetTitle>Manual Fix Instructions – {recommendation.title}</SheetTitle>
          </div>
          <SheetDescription>
            Step-by-step guide to resolve this security issue manually
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Overview Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  <strong>Estimated Time:</strong> {recommendation.estimatedTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={recommendation.severity === 'Critical' ? 'destructive' : 'secondary'}>
                  {recommendation.severity}
                </Badge>
              </div>
            </div>

            {recommendation.whoShouldPerform && (
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <strong>Who Should Perform:</strong> {recommendation.whoShouldPerform}
                </span>
              </div>
            )}

            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          </div>

          <Separator />

          {/* Security Warnings */}
          {(recommendation.sensitiveAction || recommendation.requiresRestart || recommendation.securityImpact) && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Important Warnings</span>
                </h4>
                
                {recommendation.sensitiveAction && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">Sensitive Configuration Action</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      This action changes platform security behavior. Proceed with caution.
                    </p>
                  </div>
                )}

                {recommendation.requiresRestart && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-800">Service Impact</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      This fix may restart session services and cause brief logout for some users.
                    </p>
                  </div>
                )}

                {recommendation.securityImpact && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">{recommendation.securityImpact}</p>
                  </div>
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Step-by-Step Guide */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Step-by-Step Fix Guide</span>
            </h4>
            
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={step.id}
                    checked={completedSteps[step.id] || false}
                    onCheckedChange={() => handleStepToggle(step.id)}
                  />
                  <div className="flex-1 space-y-1">
                    <label 
                      htmlFor={step.id}
                      className={`text-sm font-medium cursor-pointer ${
                        completedSteps[step.id] ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {index + 1}. {step.title}
                    </label>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* External Links */}
          {recommendation.externalLinks && recommendation.externalLinks.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold text-sm flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <span>Quick Access Links</span>
                </h4>
                
                <div className="space-y-2">
                  {recommendation.externalLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedLink({ url: link.url, label: link.label });
                        setShowPasswordDialog(true);
                      }}
                    >
                      <Shield className="h-4 w-4 mr-2 text-red-500" />
                      {link.label} (Super Admin Only)
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <Separator />
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareSteps}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Fix Steps
              </Button>
            </div>

            <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="default" 
                  className="w-full"
                  disabled={!allStepsCompleted}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Fix as Completed
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Fix Completion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark "{recommendation.title}" as completed? 
                    This action will be logged in the audit trail and the fix will be marked as resolved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleMarkComplete}>
                    Yes, Mark as Completed
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Password Protected Access Dialog */}
        {selectedLink && (
          <PasswordProtectedAccess
            isOpen={showPasswordDialog}
            onOpenChange={setShowPasswordDialog}
            targetUrl={selectedLink.url}
            linkLabel={selectedLink.label}
            userEmail="a.mekrizvani@hotmail.com"
          />
        )}
      </SheetContent>
    </Sheet>
  );
};