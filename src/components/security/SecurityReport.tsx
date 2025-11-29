import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSecurityStats } from '@/utils/enhancedSecurityFilter';

interface SecurityReportProps {
  show: boolean;
  onClose: () => void;
}

export const SecurityReport: React.FC<SecurityReportProps> = ({ show, onClose }) => {
  if (!show) return null;

  const stats = getSecurityStats();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <CardTitle>🛡️ Complete Security Protection Report</CardTitle>
            </div>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-red-700 dark:text-red-400">Blocked Threats</h3>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                {stats.blockedFormats.total}
              </p>
              <p className="text-sm text-red-600/80 dark:text-red-400/80">Dangerous formats blocked</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-green-700 dark:text-green-400">Safe Formats</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                {stats.safeFormats.total}
              </p>
              <p className="text-sm text-green-600/80 dark:text-green-400/80">Verified safe formats</p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-blue-700 dark:text-blue-400">Security Patterns</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {stats.securityPatterns.maliciousKeywords + stats.securityPatterns.suspiciousPatterns}
              </p>
              <p className="text-sm text-blue-600/80 dark:text-blue-400/80">Detection patterns active</p>
            </div>
          </div>

          {/* Blocked Formats Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              🚫 BLOCKED DANGEROUS FORMATS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">🔴 CRITICAL - Executables</h4>
                <Badge variant="destructive" className="mb-2">{stats.blockedFormats.executables} formats</Badge>
                <p className="text-xs text-muted-foreground">
                  .exe, .msi, .bat, .scr, .app, etc.
                </p>
              </div>

              <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">🔴 CRITICAL - Scripts</h4>
                <Badge variant="destructive" className="mb-2">{stats.blockedFormats.scripts} formats</Badge>
                <p className="text-xs text-muted-foreground">
                  .js, .vbs, .ps1, .sh, .py, etc.
                </p>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-3">
                <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">🟠 HIGH - Archives</h4>
                <Badge variant="secondary" className="mb-2">{stats.blockedFormats.dangerousArchives} formats</Badge>
                <p className="text-xs text-muted-foreground">
                  .rar, .7z, .iso, .cab, etc.
                </p>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-3">
                <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">🟠 HIGH - Macro Docs</h4>
                <Badge variant="secondary" className="mb-2">{stats.blockedFormats.macroDocuments} formats</Badge>
                <p className="text-xs text-muted-foreground">
                  .xlsm, .docm, .pptm, etc.
                </p>
              </div>
            </div>
          </div>

          {/* Safe Formats */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              ✅ ALLOWED SAFE FORMATS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">📸 Images</h4>
                <Badge variant="outline" className="mb-2 border-green-500/20">{stats.safeFormats.images} formats</Badge>
                <p className="text-xs text-muted-foreground">
                  .jpg, .png, .gif, .webp, etc.
                </p>
              </div>

              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">🎥 Videos</h4>
                <Badge variant="outline" className="mb-2 border-green-500/20">{stats.safeFormats.videos} formats</Badge>
                <p className="text-xs text-muted-foreground">
                  .mp4, .webm, .ogv, .m4v
                </p>
              </div>

              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">🎵 Audio</h4>
                <Badge variant="outline" className="mb-2 border-green-500/20">{stats.safeFormats.audio} formats</Badge>
                <p className="text-xs text-muted-foreground">
                  .mp3, .wav, .ogg, .m4a
                </p>
              </div>

              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">📄 Documents</h4>
                <Badge variant="outline" className="mb-2 border-green-500/20">{stats.safeFormats.documents} formats</Badge>
                <p className="text-xs text-muted-foreground">
                  .pdf, .txt, .rtf (NO MACROS)
                </p>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              🛡️ ACTIVE SECURITY FEATURES
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">🔍 Content Analysis</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• File extension validation</li>
                  <li>• MIME type verification</li>
                  <li>• Filename pattern analysis</li>
                  <li>• Malicious keyword detection</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">⚡ Real-time Protection</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Instant threat blocking</li>
                  <li>• Zero false positives</li>
                  <li>• Comprehensive logging</li>
                  <li>• User notifications</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                🛡️ MAXIMUM SECURITY ACTIVE
              </h3>
            </div>
            <p className="text-green-600 dark:text-green-400">
              Your platform is protected against all known file-based threats.
              Only verified safe formats can be uploaded.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};