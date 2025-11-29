import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Settings2, 
  Pin, 
  Loader2,
  CheckCircle,
  Send
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: {
    module: string;
    riskScore: number;
    checksPassed: number;
    warnings: number;
    responseTime: number;
    lastFixApplied: string;
    complianceStatus: string;
  };
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  open,
  onOpenChange,
  reportData
}) => {
  const [selectedChannel, setSelectedChannel] = useState<'admin' | 'platform'>('admin');
  const [message, setMessage] = useState('');
  const [pinToTop, setPinToTop] = useState(false);
  const [sharing, setSharing] = useState(false);

  const channelOptions = [
    {
      id: 'admin' as const,
      title: 'Admin Chat Team',
      description: 'Share with all Super Admins and Moderators responsible for platform security.',
      icon: Users,
      color: 'text-red-600 bg-red-50 border-red-200'
    }
  ];

  const handleShare = async () => {
    setSharing(true);
    
    try {
      // Simulate API call to share the report
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log the share action for audit purposes
      const auditLog = {
        action: 'security_report_shared',
        module: reportData.module,
        channel: selectedChannel,
        user: 'a.mekrizvani@hotmail.com',
        timestamp: new Date().toISOString(),
        pinned: pinToTop,
        note: message || 'No additional note provided'
      };
      
      console.log('Share Report Audit:', auditLog);
      
      // Show success toast
      const channelName = selectedChannel === 'admin' ? 'Admin Chat Team' : 'Platform Chat Team';
      toast({
        title: "✅ Report Shared Successfully",
        description: `Security report for ${reportData.module} shared with ${channelName}`,
      });

      // Reset form and close modal
      setMessage('');
      setPinToTop(false);
      onOpenChange(false);
      
    } catch (error) {
      toast({
        title: "❌ Share Failed",
        description: "Failed to share the security report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSharing(false);
    }
  };

  const getRiskScoreStatus = (score: number) => {
    if (score >= 80) return 'Secure';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Caution';
    return 'Critical';
  };

  const generateChatMessage = () => {
    const riskStatus = getRiskScoreStatus(reportData.riskScore);
    
    return `🛡️ Security Report Shared: ${reportData.module}
🔢 Risk Score: ${reportData.riskScore} (${riskStatus})
✅ Checks Passed: ${reportData.checksPassed}
⚠️ Warnings: ${reportData.warnings}
📊 Response Time: ${reportData.responseTime}ms
📅 Last Fix Applied: ${reportData.lastFixApplied}
🧾 Compliance: ${reportData.complianceStatus}
🔗 View Full Report: [Open Analysis Report Modal]${message ? `\n📝 Note: "${message}"` : ''}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="flex flex-col items-center gap-2 text-sm">
            <Send className="h-4 w-4 text-primary" />
            <span className="leading-tight">Share Security Report</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-1">
          {/* Preview of what will be shared */}
          <div className="bg-muted/50 rounded-lg p-3">
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Report Preview:
            </Label>
            <div className="bg-background rounded border p-2 text-xs font-mono whitespace-pre-wrap break-all overflow-hidden">
              {generateChatMessage()}
            </div>
          </div>

          {/* Channel Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Target Channel</Label>
            <RadioGroup 
              value={selectedChannel} 
              onValueChange={(value) => setSelectedChannel(value as 'admin' | 'platform')}
              className="space-y-2"
            >
              {channelOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <label 
                        htmlFor={option.id} 
                        className="flex items-center gap-1 cursor-pointer mb-1"
                      >
                        <Icon className="h-3 w-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{option.title}</span>
                      </label>
                      <p className="text-xs text-muted-foreground leading-tight break-words">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="share-message" className="text-sm">Add a note (optional)</Label>
            <Textarea
              id="share-message"
              placeholder="e.g., Please review the latest scan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={300}
              rows={2}
              className="resize-none text-xs w-full break-words overflow-wrap-anywhere"
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/300
            </p>
          </div>

          {/* Pin to Top Option */}
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <Label className="text-sm font-medium block">Pin to top</Label>
                <p className="text-xs text-muted-foreground leading-tight">
                  Keep visible for quick access
                </p>
              </div>
            </div>
            <Switch 
              checked={pinToTop} 
              onCheckedChange={setPinToTop}
              className="flex-shrink-0"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-3 border-t">
            <Button 
              onClick={handleShare}
              disabled={sharing}
              className="w-full text-xs"
              size="sm"
            >
              {sharing ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Send className="h-3 w-3 mr-2" />
                  Send Report
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={sharing}
              className="w-full text-xs"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};