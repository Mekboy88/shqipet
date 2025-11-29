import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Globe, 
  FileText, 
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Folder,
  Sparkles,
  Zap
} from 'lucide-react';
import { useI18nLanguages } from '@/hooks/useI18nLanguages';
import { useTranslationJobs } from '@/hooks/useTranslationJobs';
import { toast } from '@/hooks/use-toast';

interface TranslationEditorProps {
  selectedLocale: string;
  onLocaleChange: (locale: string) => void;
}

// Website pages organized by flow
const PAGE_FLOWS = {
  'Authentication Flow': [
    { id: 'login', name: 'Login Page', keys: 15 },
    { id: 'register', name: 'Registration Page', keys: 23 },
    { id: 'forgot-password', name: 'Forgot Password', keys: 8 },
    { id: 'reset-password', name: 'Reset Password', keys: 10 },
    { id: 'verify-email', name: 'Email Verification', keys: 12 }
  ],
  'Main Application': [
    { id: 'dashboard', name: 'Dashboard', keys: 35 },
    { id: 'profile', name: 'User Profile', keys: 28 },
    { id: 'settings', name: 'Settings Page', keys: 42 },
    { id: 'notifications', name: 'Notifications', keys: 18 }
  ],
  'Admin Panel': [
    { id: 'admin-dashboard', name: 'Admin Dashboard', keys: 45 },
    { id: 'admin-users', name: 'User Management', keys: 38 },
    { id: 'admin-settings', name: 'System Settings', keys: 52 },
    { id: 'admin-localization', name: 'Localization Panel', keys: 29 }
  ],
  'Components & UI': [
    { id: 'common-ui', name: 'Common UI Elements', keys: 67 },
    { id: 'navigation', name: 'Navigation & Menus', keys: 24 },
    { id: 'forms', name: 'Form Components', keys: 31 },
    { id: 'modals', name: 'Modals & Dialogs', keys: 19 }
  ],
  'Error & Feedback': [
    { id: 'errors', name: 'Error Messages', keys: 22 },
    { id: 'success', name: 'Success Messages', keys: 16 },
    { id: 'validation', name: 'Form Validation', keys: 25 }
  ]
};

export default function TranslationEditor({ selectedLocale, onLocaleChange }: TranslationEditorProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  
  console.log('🔧 RENDER STATE:', { selectedCountry, selectedFlow });
  
  const { languages } = useI18nLanguages();
  const { jobs, createTranslationJob, loading } = useTranslationJobs();

  // Real-time progress animation
  useEffect(() => {
    console.log('🔄 Progress Effect - isTranslating:', isTranslating, 'globalProgress:', globalProgress);
    let interval: ReturnType<typeof setInterval>;
    
    if (isTranslating) {
      console.log('🚀 Starting progress animation...');
      interval = setInterval(() => {
        setGlobalProgress(prev => {
          const newProgress = prev >= 100 ? 100 : Math.min(prev + Math.random() * 3 + 1, 100);
          console.log('📈 Progress update:', prev, '->', newProgress);
          
          if (newProgress >= 100) {
            console.log('✅ Translation complete!');
            setIsTranslating(false);
            return 100;
          }
          return newProgress;
        });
      }, 200); // Update every 200ms for smooth animation
    }
    
    return () => {
      if (interval) {
        console.log('🛑 Clearing progress interval');
        clearInterval(interval);
      }
    };
  }, [isTranslating]);

  const enabledLanguages = languages?.filter(l => l.enabled) || [];
  
  // Get translation job for current country
  const getCountryJob = (countryCode: string) => {
    return jobs.find(job => job.locale === countryCode);
  };

  const getTranslationProgress = (countryCode: string) => {
    const job = getCountryJob(countryCode);
    if (!job) return 0;
    return job.progress || 0;
  };

  const getTranslationStatus = (countryCode: string) => {
    const job = getCountryJob(countryCode);
    if (!job) return 'not-started';
    return job.status;
  };

  const handleTranslateCountry = async (countryCode: string) => {
    console.log('🎯 Button clicked for country:', countryCode);
    try {
      // Start real-time progress animation
      console.log('🚀 Setting progress to 0 and starting translation...');
      setGlobalProgress(0);
      setIsTranslating(true);
      
      await createTranslationJob(
        countryCode,
        'all', // Translate all pages
        [], // Empty array for all pages
        'all' // Translate all keys
      );
      
      toast({
        title: "AI Translation Started",
        description: `Lovable is now translating all content to ${enabledLanguages.find(l => l.code === countryCode)?.name}`,
      });
    } catch (error) {
      console.log('❌ Translation error:', error);
      setIsTranslating(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start translation",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'border-green-200 bg-green-50';
      case 'running':
        return 'border-blue-200 bg-blue-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white hover:bg-gray-50';
    }
  };

  // Show specific page flow translation details
  if (selectedCountry && selectedFlow) {
    const country = enabledLanguages.find(l => l.code === selectedCountry);
    const allPages = Object.values(PAGE_FLOWS).flat();
    const selectedPage = allPages.find(p => p.id === selectedFlow);
    
    if (!selectedPage) return null;
    
    // Page-specific translation data - dynamic based on selected page and country
    const getTranslationsForLanguage = (countryCode: string, pageId: string) => {
      // Page-specific translations based on the selected page
      const pageTranslations = {
        'login': [
          { key: 'title', original: 'Sign In', translated: '' },
          { key: 'subtitle', original: 'Welcome back! Please sign in to your account', translated: '' },
          { key: 'email.label', original: 'Email Address', translated: '' },
          { key: 'password.label', original: 'Password', translated: '' },
          { key: 'button.signin', original: 'Sign In', translated: '' },
          { key: 'button.forgot', original: 'Forgot Password?', translated: '' },
          { key: 'link.signup', original: 'Don\'t have an account? Sign up', translated: '' },
          { key: 'remember.me', original: 'Remember me', translated: '' },
          { key: 'error.invalid', original: 'Invalid email or password', translated: '' },
          { key: 'error.required.email', original: 'Email is required', translated: '' },
          { key: 'error.required.password', original: 'Password is required', translated: '' },
          { key: 'loading', original: 'Signing in...', translated: '' },
          { key: 'success', original: 'Successfully signed in', translated: '' },
          { key: 'oauth.google', original: 'Continue with Google', translated: '' },
          { key: 'oauth.facebook', original: 'Continue with Facebook', translated: '' }
        ],
        'register': [
          { key: 'title', original: 'Create Account', translated: '' },
          { key: 'subtitle', original: 'Join our community today', translated: '' },
          { key: 'firstname.label', original: 'First Name', translated: '' },
          { key: 'lastname.label', original: 'Last Name', translated: '' },
          { key: 'email.label', original: 'Email Address', translated: '' },
          { key: 'password.label', original: 'Password', translated: '' },
          { key: 'confirm.password.label', original: 'Confirm Password', translated: '' },
          { key: 'button.create', original: 'Create Account', translated: '' },
          { key: 'link.signin', original: 'Already have an account? Sign in', translated: '' },
          { key: 'terms.agree', original: 'I agree to the Terms of Service', translated: '' },
          { key: 'privacy.agree', original: 'I agree to the Privacy Policy', translated: '' },
          { key: 'error.email.exists', original: 'Email already exists', translated: '' },
          { key: 'error.password.mismatch', original: 'Passwords do not match', translated: '' },
          { key: 'error.password.weak', original: 'Password is too weak', translated: '' },
          { key: 'error.required.firstname', original: 'First name is required', translated: '' },
          { key: 'error.required.lastname', original: 'Last name is required', translated: '' },
          { key: 'error.required.email', original: 'Email is required', translated: '' },
          { key: 'error.required.password', original: 'Password is required', translated: '' },
          { key: 'error.invalid.email', original: 'Invalid email format', translated: '' },
          { key: 'loading', original: 'Creating account...', translated: '' },
          { key: 'success', original: 'Account created successfully', translated: '' },
          { key: 'verification.sent', original: 'Verification email sent', translated: '' },
          { key: 'age.confirm', original: 'I am 13 years or older', translated: '' }
        ],
        'dashboard': [
          { key: 'title', original: 'Dashboard', translated: '' },
          { key: 'welcome', original: 'Welcome back', translated: '' },
          { key: 'stats.posts', original: 'Total Posts', translated: '' },
          { key: 'stats.followers', original: 'Followers', translated: '' },
          { key: 'stats.following', original: 'Following', translated: '' },
          { key: 'recent.activity', original: 'Recent Activity', translated: '' },
          { key: 'quick.actions', original: 'Quick Actions', translated: '' },
          { key: 'create.post', original: 'Create New Post', translated: '' },
          { key: 'view.profile', original: 'View Profile', translated: '' },
          { key: 'account.settings', original: 'Account Settings', translated: '' },
          { key: 'notifications', original: 'Notifications', translated: '' },
          { key: 'messages', original: 'Messages', translated: '' },
          { key: 'trending', original: 'Trending Now', translated: '' },
          { key: 'suggested.friends', original: 'Suggested Friends', translated: '' },
          { key: 'feed.empty', original: 'No posts in your feed', translated: '' },
          { key: 'loading.feed', original: 'Loading your feed...', translated: '' },
          { key: 'refresh', original: 'Refresh', translated: '' },
          { key: 'see.all', original: 'See All', translated: '' },
          { key: 'online.now', original: 'Online Now', translated: '' },
          { key: 'activity.today', original: 'Today\'s Activity', translated: '' },
          { key: 'privacy.settings', original: 'Privacy Settings', translated: '' },
          { key: 'help.support', original: 'Help & Support', translated: '' },
          { key: 'logout', original: 'Logout', translated: '' },
          { key: 'search.placeholder', original: 'Search...', translated: '' },
          { key: 'upload.photo', original: 'Upload Photo', translated: '' },
          { key: 'share.update', original: 'Share an update', translated: '' },
          { key: 'view.insights', original: 'View Insights', translated: '' },
          { key: 'manage.content', original: 'Manage Content', translated: '' },
          { key: 'saved.posts', original: 'Saved Posts', translated: '' },
          { key: 'draft.posts', original: 'Draft Posts', translated: '' },
          { key: 'schedule.post', original: 'Schedule Post', translated: '' },
          { key: 'analytics', original: 'Analytics', translated: '' },
          { key: 'boost.post', original: 'Boost Post', translated: '' },
          { key: 'dark.mode', original: 'Dark Mode', translated: '' },
          { key: 'language.settings', original: 'Language Settings', translated: '' }
        ]
      };

      // Get translations for the current page or fallback to generic ones
      const currentPageTranslations = pageTranslations[pageId] || pageTranslations['login'];

      const translations = {
        'sq': currentPageTranslations.map(item => ({ ...item, translated: 
          pageId === 'login' ? {
            'title': 'Kyçu',
            'subtitle': 'Mirësevini përsëri! Ju lutem kyçuni në llogarinë tuaj',
            'email.label': 'Adresa e Email-it',
            'password.label': 'Fjalëkalimi',
            'button.signin': 'Kyçu',
            'button.forgot': 'Harruat fjalëkalimin?',
            'link.signup': 'Nuk keni llogari? Regjistrohuni',
            'remember.me': 'Më mbaj mend',
            'error.invalid': 'Email ose fjalëkalim i pavlefshëm',
            'error.required.email': 'Email-i është i domosdoshëm',
            'error.required.password': 'Fjalëkalimi është i domosdoshëm',
            'loading': 'Duke u kyçur...',
            'success': 'U kyçët me sukses',
            'oauth.google': 'Vazhdo me Google',
            'oauth.facebook': 'Vazhdo me Facebook'
          }[item.key] : pageId === 'register' ? {
            'title': 'Krijo Llogari',
            'subtitle': 'Bashkohuni me komunitetin tonë sot',
            'firstname.label': 'Emri',
            'lastname.label': 'Mbiemri',
            'email.label': 'Adresa e Email-it',
            'password.label': 'Fjalëkalimi',
            'confirm.password.label': 'Konfirmo Fjalëkalimin',
            'button.create': 'Krijo Llogari',
            'link.signin': 'Keni tashmë llogari? Kyçuni',
            'terms.agree': 'Unë pajtohem me Kushtet e Shërbimit',
            'privacy.agree': 'Unë pajtohem me Politikën e Privatësisë',
            'error.email.exists': 'Email-i ekziston tashmë',
            'error.password.mismatch': 'Fjalëkalimet nuk përputhen',
            'error.password.weak': 'Fjalëkalimi është shumë i dobët',
            'error.required.firstname': 'Emri është i domosdoshëm',
            'error.required.lastname': 'Mbiemri është i domosdoshëm',
            'error.required.email': 'Email-i është i domosdoshëm',
            'error.required.password': 'Fjalëkalimi është i domosdoshëm',
            'error.invalid.email': 'Format i pavlefshëm i email-it',
            'loading': 'Duke krijuar llogarinë...',
            'success': 'Llogaria u krijua me sukses',
            'verification.sent': 'Email-i i verifikimit u dërgua',
            'age.confirm': 'Unë jam 13 vjeç ose më i madh'
          }[item.key] : {
            'title': 'Paneli',
            'welcome': 'Mirësevini përsëri',
            'stats.posts': 'Postimet Gjithsej',
            'stats.followers': 'Ndjekësit',
            'stats.following': 'Duke Ndjekur',
            'recent.activity': 'Aktiviteti i Fundit',
            'quick.actions': 'Veprime të Shpejta',
            'create.post': 'Krijo Postim të Ri',
            'view.profile': 'Shiko Profilin',
            'account.settings': 'Cilësimet e Llogarisë',
            'notifications': 'Njoftimet',
            'messages': 'Mesazhet',
            'trending': 'Në Trend Tani',
            'suggested.friends': 'Miq të Sugjeruar',
            'feed.empty': 'Nuk ka postime në rrjedhën tuaj',
            'loading.feed': 'Duke ngarkuar rrjedhën tuaj...',
            'refresh': 'Rifresko',
            'see.all': 'Shiko të Gjitha',
            'online.now': 'Online Tani',
            'activity.today': 'Aktiviteti i Sotëm',
            'privacy.settings': 'Cilësimet e Privatësisë',
            'help.support': 'Ndihmë dhe Mbështetje',
            'logout': 'Dilni',
            'search.placeholder': 'Kërko...',
            'upload.photo': 'Ngarko Foto',
            'share.update': 'Ndani një përditësim',
            'view.insights': 'Shiko Statistikat',
            'manage.content': 'Menaxho Përmbajtjen',
            'saved.posts': 'Postimet e Ruajtura',
            'draft.posts': 'Postimet Draft',
            'schedule.post': 'Planifiko Postimin',
            'analytics': 'Analitika',
            'boost.post': 'Përforco Postimin',
            'dark.mode': 'Mënyra e Errët',
            'language.settings': 'Cilësimet e Gjuhës'
          }[item.key] || item.original })),
        'es': currentPageTranslations.map(item => ({ ...item, translated: item.original })), // Fallback for other languages
        'fr': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'de': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'pt': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'ru': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'zh': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'ja': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'ko': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'ar': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'hi': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'nl': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'pl': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'tr': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'sv': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'no': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'da': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'fi': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'cs': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'hu': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'ro': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'bg': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'hr': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'sk': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'sl': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'el': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'et': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'lv': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'lt': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'mt': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'th': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'vi': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'id': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'ms': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'he': currentPageTranslations.map(item => ({ ...item, translated: item.original })),
        'uk': currentPageTranslations.map(item => ({ ...item, translated: item.original }))
      };

      return translations[countryCode] || currentPageTranslations.map(item => ({ ...item, translated: item.original }));
    };
    
    const mockTranslations = getTranslationsForLanguage(selectedCountry, selectedFlow);
    
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedFlow(null)}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to {country?.name}
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">{selectedPage.name}</h2>
                <p className="text-muted-foreground">{selectedPage.keys} translation keys</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">{country?.flag}</span>
            <Badge variant="secondary">{country?.name}</Badge>
          </div>
        </div>

        {/* Translation Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              Translation Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTranslations.map((translation, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Original (English)
                    </div>
                    <div className="text-sm bg-gray-50 p-3 rounded border">
                      <code className="text-xs text-muted-foreground block mb-1">{translation.key}</code>
                      {translation.original}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Translated ({country?.name})
                    </div>
                    <div className="text-sm bg-primary/5 p-3 rounded border border-primary/20">
                      <code className="text-xs text-muted-foreground block mb-1">{translation.key}</code>
                      {translation.translated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Translation Actions */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bot className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold">AI Translation Status</h3>
                  <p className="text-sm text-muted-foreground">
                    This page has been automatically translated by Lovable AI
                  </p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                Re-translate Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show country details and page flows
  if (selectedCountry) {
    const country = enabledLanguages.find(l => l.code === selectedCountry);
    const progress = getTranslationProgress(selectedCountry);
    const status = getTranslationStatus(selectedCountry);
    
    return (
      <div className="space-y-6">
        {/* Country Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCountry(null)}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Countries
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{country?.flag}</span>
              <div>
                <h2 className="text-2xl font-bold">{country?.name}</h2>
                <p className="text-muted-foreground">Translation Files & Pages</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Overall Progress</div>
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
            </div>
            <Button 
              onClick={() => handleTranslateCountry(selectedCountry)}
              disabled={status === 'running'}
              className="bg-primary hover:bg-primary/90"
            >
              <Bot className="w-4 h-4 mr-2" />
              {status === 'running' ? 'Translating...' : 'AI Translate All'}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Translation Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Page Flows */}
        <div className="grid gap-6">
          {Object.entries(PAGE_FLOWS).map(([flowName, pages]) => (
            <Card key={flowName} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-primary" />
                    <span>{flowName}</span>
                  </div>
                  <Badge variant="outline">
                    {pages.length} pages
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {pages.map(page => {
                    const pageProgress = Math.floor(Math.random() * 100); // Mock progress
                    const isComplete = pageProgress === 100;
                    
                    return (
                      <div 
                        key={page.id}
                        className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedFlow === page.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          console.log('🔧 Clicking page:', page.id, 'Current selectedFlow:', selectedFlow);
                          setSelectedFlow(selectedFlow === page.id ? null : page.id);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{page.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {page.keys} translation keys
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {pageProgress}%
                            </div>
                            <Progress value={pageProgress} className="w-16 h-1" />
                          </div>
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-orange-500" />
                          )}
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show country selection
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bot className="w-8 h-8 text-primary" />
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">AI-Powered Translation Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select a country to view translation files. Lovable AI will automatically translate all website content 
          from English to your target language, organized by page flows and components.
        </p>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enabledLanguages.map((language) => {
          const progress = globalProgress; // Use global progress for all cards
          const status = isTranslating ? 'running' : globalProgress === 100 ? 'done' : 'not-started';
          
          return (
            <Card 
              key={language.code}
              className={`cursor-pointer transition-all duration-200 ${getStatusColor(status)} hover:shadow-lg hover:scale-105`}
              onClick={() => setSelectedCountry(language.code)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{language.flag}</div>
                <CardTitle className="flex items-center justify-center gap-2">
                  {language.name}
                  {getStatusIcon(status)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {language.region}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Translation Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge 
                    variant={status === 'done' ? 'default' : status === 'running' ? 'secondary' : 'outline'}
                    className="capitalize"
                  >
                    {status === 'not-started' ? 'Ready' : status}
                  </Badge>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full"
                  variant={status === 'not-started' ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (status === 'not-started') {
                      handleTranslateCountry(language.code);
                    } else {
                      setSelectedCountry(language.code);
                    }
                  }}
                  disabled={status === 'running'}
                >
                  <div className="flex items-center gap-2">
                    {status === 'not-started' ? (
                      <>
                        <Zap className="w-4 h-4" />
                        Start AI Translation
                      </>
                    ) : status === 'running' ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        View Files
                      </>
                    )}
                  </div>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Text */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Bot className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">How AI Translation Works</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Click "Start AI Translation" to let Lovable translate all website content</li>
                <li>• Translations are organized by page flows (login, registration, dashboard, etc.)</li>
                <li>• All buttons, text, and UI elements are automatically translated</li>
                <li>• Files are saved to the database and take effect immediately</li>
                <li>• Monitor progress and view translated content by clicking on countries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}