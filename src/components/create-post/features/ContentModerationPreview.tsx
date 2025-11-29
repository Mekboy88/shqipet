import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModerationResult {
  overall: 'approved' | 'warning' | 'blocked';
  score: number;
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion?: string;
  }>;
  estimatedReach: number;
  visibility: 'full' | 'limited' | 'hidden';
}

interface ContentModerationPreviewProps {
  content: string;
  files: File[];
}

const ContentModerationPreview: React.FC<ContentModerationPreviewProps> = ({ content, files }) => {
  const [result, setResult] = useState<ModerationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Mock content moderation analysis
  const analyzeContent = async (text: string, fileCount: number): Promise<ModerationResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const issues = [];
    let score = 100;
    
    // Simple keyword detection (in real app, would use ML models)
    const sensitiveWords = ['hate', 'violence', 'spam', 'scam'];
    const foundSensitive = sensitiveWords.some(word => 
      text.toLowerCase().includes(word)
    );
    
    if (foundSensitive) {
      issues.push({
        type: 'Language',
        severity: 'high' as const,
        description: 'Potentially offensive language detected',
        suggestion: 'Consider rephrasing sensitive content'
      });
      score -= 30;
    }
    
    // Check for excessive capitalization
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.3) {
      issues.push({
        type: 'Format',
        severity: 'medium' as const,
        description: 'Excessive capitalization detected',
        suggestion: 'Reduce ALL CAPS usage'
      });
      score -= 15;
    }
    
    // Check for spam patterns
    const repeatPattern = /(.)\1{4,}/g;
    if (repeatPattern.test(text) || text.includes('!!!!!!')) {
      issues.push({
        type: 'Spam',
        severity: 'medium' as const,
        description: 'Potential spam patterns detected',
        suggestion: 'Avoid excessive repetition'
      });
      score -= 20;
    }
    
    // Check file count
    if (fileCount > 10) {
      issues.push({
        type: 'Media',
        severity: 'low' as const,
        description: 'Large number of attachments',
        suggestion: 'Consider reducing attachments'
      });
      score -= 10;
    }
    
    let overall: 'approved' | 'warning' | 'blocked';
    let visibility: 'full' | 'limited' | 'hidden';
    
    if (score >= 80) {
      overall = 'approved';
      visibility = 'full';
    } else if (score >= 50) {
      overall = 'warning';
      visibility = 'limited';
    } else {
      overall = 'blocked';
      visibility = 'hidden';
    }
    
    return {
      overall,
      score,
      issues,
      estimatedReach: Math.floor((score / 100) * 1000),
      visibility
    };
  };

  useEffect(() => {
    if (content.trim().length > 10) {
      setIsChecking(true);
      analyzeContent(content, files.length)
        .then(setResult)
        .finally(() => setIsChecking(false));
    } else {
      setResult(null);
    }
  }, [content, files.length]);

  if (!showPreview && !result?.issues.length) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPreview(true)}
        className="h-8"
      >
        <Shield className="w-4 h-4 mr-2" />
        Preview Moderation
      </Button>
    );
  }

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="w-4 h-4 animate-pulse" />
        <span>Analyzing content...</span>
      </div>
    );
  }

  if (!result) return null;

  const getStatusIcon = () => {
    switch (result.overall) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (result.overall) {
      case 'approved':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'blocked':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className={`border rounded-lg p-3 space-y-3 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            Content Moderation Preview
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Eye className="w-3 h-3" />
          <span>Est. reach: {result.estimatedReach}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="font-medium">Safety Score</div>
          <div className="flex items-center gap-1">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  result.score >= 80 ? 'bg-green-500' :
                  result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <span>{result.score}/100</span>
          </div>
        </div>
        <div>
          <div className="font-medium">Visibility</div>
          <div className="capitalize">{result.visibility}</div>
        </div>
      </div>

      {result.issues.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Issues Detected:</div>
          {result.issues.map((issue, index) => (
            <div key={index} className="bg-white/50 rounded p-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                  issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                  issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {issue.type}
                </span>
                <span className="text-xs">{issue.description}</span>
              </div>
              {issue.suggestion && (
                <div className="text-xs text-muted-foreground">
                  💡 {issue.suggestion}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(false)}
          className="h-6 text-xs"
        >
          Hide Preview
        </Button>
        {result.overall === 'blocked' && (
          <Button variant="outline" size="sm" className="h-6 text-xs">
            Edit Content
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentModerationPreview;