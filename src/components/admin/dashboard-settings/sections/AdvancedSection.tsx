import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, Download, Upload, RefreshCw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdvancedSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const AdvancedSection: React.FC<AdvancedSectionProps> = ({
  settings,
  updateSettings
}) => {
  const { toast } = useToast();
  const [jsonEditor, setJsonEditor] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('dev');
  
  const environments = [
    { value: 'dev', label: 'Development' },
    { value: 'stage', label: 'Staging' },
    { value: 'prod', label: 'Production' },
  ];

  const handleJsonEdit = () => {
    try {
      setJsonEditor(JSON.stringify(settings, null, 2));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings as JSON",
        variant: "destructive",
      });
    }
  };

  const handleJsonValidate = () => {
    try {
      JSON.parse(jsonEditor);
      toast({
        title: "Valid JSON",
        description: "The JSON configuration is valid",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive",
      });
    }
  };

  const handleJsonSave = () => {
    try {
      const newSettings = JSON.parse(jsonEditor);
      updateSettings(newSettings);
      toast({
        title: "Settings Updated",
        description: "Dashboard settings have been updated from JSON",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Cannot save invalid JSON configuration",
        variant: "destructive",
      });
    }
  };

  const handleExportSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported",
      description: "Dashboard settings have been downloaded as JSON",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        updateSettings(importedSettings);
        toast({
          title: "Settings Imported",
          description: "Dashboard settings have been imported successfully",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid JSON file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCopyToEnvironment = () => {
    // Mock implementation - would copy to selected environment
    toast({
      title: "Settings Copied",
      description: `Settings copied to ${environments.find(e => e.value === selectedEnvironment)?.label}`,
    });
  };

  const handleResetToDefaults = () => {
    const defaultSettings = {
      layout: {
        cards: [
          { id: "totalUsers", size: "medium", order: 0, visible: true },
          { id: "onlineUsers", size: "medium", order: 1, visible: true },
          { id: "contentPosts", size: "medium", order: 2, visible: true },
          { id: "messages", size: "medium", order: 3, visible: true },
        ],
        density: "comfortable",
        defaultDateWindow: "24h"
      },
      refresh: {
        globalInterval: 30000,
        allowCardOverrides: true
      },
      thresholds: {
        uptime: { warning: 95, critical: 90 },
        latency: { warning: 1000, critical: 2000 },
        errorRate: { warning: 1, critical: 5 }
      },
      permissions: {
        piiSafeMode: false
      }
    };
    
    updateSettings(defaultSettings);
    setShowResetDialog(false);
    
    toast({
      title: "Settings Reset",
      description: "Dashboard settings have been reset to safe defaults",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Settings copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>JSON Schema Editor</span>
          </CardTitle>
          <CardDescription>Edit the complete dashboard configuration as JSON</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleJsonEdit}
            >
              <Code className="h-4 w-4 mr-2" />
              Load Current Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleJsonValidate}
              disabled={!jsonEditor}
            >
              Validate JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(jsonEditor)}
              disabled={!jsonEditor}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          
          <Textarea
            placeholder="Click 'Load Current Settings' to edit the JSON configuration..."
            value={jsonEditor}
            onChange={(e) => setJsonEditor(e.target.value)}
            className="font-mono text-sm min-h-[300px]"
          />
          
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {jsonEditor && (
                <Badge variant="outline">
                  {jsonEditor.split('\n').length} lines
                </Badge>
              )}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={handleJsonSave}
                disabled={!jsonEditor}
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Migration Tools</span>
          </CardTitle>
          <CardDescription>Import/export settings and copy between environments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Export Settings</Label>
              <Button
                variant="outline"
                onClick={handleExportSettings}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Import Settings</Label>
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload JSON
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <Label className="text-sm font-medium">Copy to Environment</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {environments.map(env => (
                    <SelectItem key={env.value} value={env.value}>
                      {env.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleCopyToEnvironment}
              >
                Copy Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>Irreversible actions that affect the entire dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <h4 className="font-medium text-destructive mb-2">Reset to Safe Defaults</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently reset all dashboard settings to safe default values. 
              This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset All Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Dashboard Settings?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently reset all dashboard settings to safe defaults. 
              All custom configurations, thresholds, layouts, and integrations will be lost.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetToDefaults}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdvancedSection;