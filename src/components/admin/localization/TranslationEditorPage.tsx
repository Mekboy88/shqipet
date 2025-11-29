import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Play, Upload, Undo, Eye, FileText, Download, Lock } from 'lucide-react';
import { useI18nLanguages } from '@/hooks/useI18nLanguages';
import { useTranslationJobs } from '@/hooks/useTranslationJobs';
import supabase from '@/lib/relaxedSupabase';
import { toast } from 'sonner';

const AVAILABLE_PAGES = [
  'login',
  'registration',
  'profile',
  'main',
  'admin_login',
  'admin_settings',
  'emails',
  'components',
  'errors',
  'dashboard',
  'settings',
  'users',
  'reports',
  'notifications'
];

export const TranslationEditorPage: React.FC = () => {
  const [selectedLocale, setSelectedLocale] = useState<string>('');
  const [scope, setScope] = useState<'all' | 'pages' | 'page'>('all');
  const [mode, setMode] = useState<'all' | 'missing'>('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [translationFiles, setTranslationFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<any>(null);

  const { languages } = useI18nLanguages();
  const { jobs, loading: jobsLoading, createTranslationJob, publishTranslations, rollbackTranslations } = useTranslationJobs();

  const enabledLanguages = languages.filter(lang => lang.enabled);
  const activeJob = jobs.find(job => job.status === 'running' || job.status === 'queued');
  const latestJob = jobs[0];

  useEffect(() => {
    if (selectedLocale) {
      loadTranslationFiles();
    }
  }, [selectedLocale]);

  const loadTranslationFiles = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('i18n_lovable')
        .list(`locales/${selectedLocale}/pages`, {
          limit: 100
        });

      if (error) {
        console.error('Error loading files:', error);
        return;
      }

      setTranslationFiles(files || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadFileContent = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('i18n_lovable')
        .download(`locales/${selectedLocale}/pages/${fileName}`);

      if (error) {
        console.error('Error loading file content:', error);
        return;
      }

      const content = await data.text();
      const parsed = JSON.parse(content);
      setFileContent(parsed);
      setSelectedFile(fileName);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Failed to load file content');
    }
  };

  const handlePageSelection = (page: string, checked: boolean) => {
    if (checked) {
      setSelectedPages(prev => [...prev, page]);
    } else {
      setSelectedPages(prev => prev.filter(p => p !== page));
    }
  };

  const handleStartTranslation = async () => {
    if (!selectedLocale) {
      toast.error('Please select a locale');
      return;
    }

    try {
      const pagesToTranslate = scope === 'all' ? AVAILABLE_PAGES : 
                              scope === 'pages' ? selectedPages : 
                              selectedPages.slice(0, 1);

      await createTranslationJob(selectedLocale, scope, pagesToTranslate, mode);
    } catch (error) {
      console.error('Error starting translation:', error);
    }
  };

  const handlePublish = async () => {
    if (!latestJob || latestJob.status !== 'done') {
      toast.error('No completed translation job to publish');
      return;
    }

    try {
      await publishTranslations(latestJob.id);
    } catch (error) {
      console.error('Error publishing:', error);
    }
  };

  const handleRollback = async () => {
    if (!selectedLocale) {
      toast.error('Please select a locale');
      return;
    }

    try {
      await rollbackTranslations(selectedLocale);
    } catch (error) {
      console.error('Error rolling back:', error);
    }
  };

  const openPreview = () => {
    if (selectedLocale) {
      const url = `${window.location.origin}?previewLocale=${selectedLocale}`;
      window.open(url, '_blank');
    }
  };

  const downloadFile = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('i18n_lovable')
        .download(`locales/${selectedLocale}/pages/${fileName}`);

      if (error) throw error;

      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Production Guard Notice */}
      <Card className="mb-6 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20">
        <CardContent className="flex items-center gap-2 pt-4">
          <Lock className="h-4 w-4 text-amber-600" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Production Guard:</strong> Admin Login and Admin Settings are forced to English in production. 
            Use Preview locale for safe testing; changes do not persist in production.
          </p>
        </CardContent>
      </Card>

      {/* Top Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Translation Editor</CardTitle>
          <CardDescription>
            AI-powered translation system for multi-language support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
            {/* Locale Selection */}
            <div className="space-y-2">
              <Label>Locale</Label>
              <Select value={selectedLocale} onValueChange={setSelectedLocale}>
                <SelectTrigger>
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  {enabledLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scope Selection */}
            <div className="space-y-2">
              <Label>Scope</Label>
              <RadioGroup value={scope} onValueChange={(value: any) => setScope(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="text-sm">All pages</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pages" id="pages" />
                  <Label htmlFor="pages" className="text-sm">Selected pages</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="page" id="page" />
                  <Label htmlFor="page" className="text-sm">Single page</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <Label>Mode</Label>
              <RadioGroup value={mode} onValueChange={(value: any) => setMode(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="translate-all" />
                  <Label htmlFor="translate-all" className="text-sm">Translate All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="missing" id="translate-missing" />
                  <Label htmlFor="translate-missing" className="text-sm">Translate Missing</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-3 flex flex-wrap gap-2">
              <Button 
                onClick={handleStartTranslation}
                disabled={!selectedLocale || activeJob !== undefined}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Translation
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handlePublish}
                disabled={!latestJob || latestJob.status !== 'done'}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Publish
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleRollback}
                disabled={!selectedLocale}
                className="flex items-center gap-2"
              >
                <Undo className="h-4 w-4" />
                Rollback
              </Button>
              
              <Button 
                variant="outline" 
                onClick={openPreview}
                disabled={!selectedLocale}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Left Sidebar - Pages */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pages</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => {}}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {scope !== 'all' && (
              <div className="space-y-2">
                {AVAILABLE_PAGES.map((page) => (
                  <div key={page} className="flex items-center space-x-2">
                    <Checkbox
                      id={page}
                      checked={selectedPages.includes(page)}
                      onCheckedChange={(checked) => handlePageSelection(page, checked as boolean)}
                    />
                    <Label htmlFor={page} className="text-sm font-medium">
                      {page.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            {scope === 'all' && (
              <p className="text-sm text-muted-foreground">
                All pages will be translated
              </p>
            )}
          </CardContent>
        </Card>

        {/* Main Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Job Monitor */}
          {(activeJob || latestJob) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Translation Status</CardTitle>
              </CardHeader>
              <CardContent>
                {activeJob && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={activeJob.status === 'running' ? 'default' : 'secondary'}>
                          {activeJob.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {activeJob.locale} - {activeJob.scope}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(activeJob.progress * 100)}%
                      </span>
                    </div>
                    <Progress value={activeJob.progress * 100} />
                    <div className="text-sm text-muted-foreground">
                      {activeJob.translated_keys} / {activeJob.total_keys} keys translated
                    </div>
                  </div>
                )}

                {latestJob && !activeJob && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={latestJob.status === 'done' ? 'default' : 'destructive'}>
                        {latestJob.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Completed: {new Date(latestJob.done_at || latestJob.created_at).toLocaleString()}
                      </span>
                    </div>
                    {latestJob.status === 'done' && (
                      <p className="text-sm text-green-600">
                        ✓ {latestJob.translated_keys} keys translated successfully
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* File Preview */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-base">Translation Files</CardTitle>
              <CardDescription>
                View and manage translated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedLocale ? (
                <div className="space-y-4">
                  {/* File List */}
                  <div className="grid gap-2">
                    {translationFiles.map((file) => (
                      <div 
                        key={file.name}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => loadFileContent(file.name)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">{file.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(file.name);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* File Content Preview */}
                  {selectedFile && fileContent && (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <h4 className="font-medium mb-3">{selectedFile}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-auto">
                        <div>
                          <h5 className="text-sm font-medium mb-2 text-muted-foreground">Keys</h5>
                          <div className="space-y-2">
                            {Object.keys(fileContent.keys || {}).map(key => (
                              <div key={key} className="text-sm font-mono p-2 bg-background rounded border">
                                {key}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2 text-muted-foreground">Values (Read-only)</h5>
                          <div className="space-y-2">
                            {Object.values(fileContent.keys || {}).map((value: any, index) => (
                              <div key={index} className="text-sm p-2 bg-muted rounded border">
                                {typeof value === 'string' ? value : JSON.stringify(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a locale to view translation files</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};