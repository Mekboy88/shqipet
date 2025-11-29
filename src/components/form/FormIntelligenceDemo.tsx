import React, { useState } from 'react';
import { IntelligentInput } from './IntelligentInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, User, MessageSquare } from 'lucide-react';

export const FormIntelligenceDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    bio: ''
  });

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Form Interaction Intelligence Demo
          </CardTitle>
          <CardDescription>
            Experience smart form interactions with blur prompts, completion hints, and animated borders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Form */}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email Address
                <Badge variant="outline" className="text-xs">Required</Badge>
              </label>
              <IntelligentInput
                id="demo-email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={updateField('email')}
                required
                options={{
                  enableBlurPrompts: true,
                  enableCompletionHints: true,
                  enableAnimatedBorders: true,
                  cacheKey: 'demo-form'
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Username
                <Badge variant="outline" className="text-xs">Required</Badge>
              </label>
              <IntelligentInput
                id="demo-username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={updateField('username')}
                required
                options={{
                  enableBlurPrompts: true,
                  enableCompletionHints: true,
                  enableAnimatedBorders: true,
                  cacheKey: 'demo-form'
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4" />
                Password
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </label>
              <IntelligentInput
                id="demo-password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={updateField('password')}
                required={false}
                options={{
                  enableBlurPrompts: false,
                  enableCompletionHints: false,
                  enableAnimatedBorders: true,
                  cacheKey: 'demo-form'
                }}
                inputProps={{ type: 'password' }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                Bio
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </label>
              <IntelligentInput
                id="demo-bio"
                type="textarea"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={updateField('bio')}
                required={false}
                options={{
                  enableBlurPrompts: false,
                  enableCompletionHints: true,
                  enableAnimatedBorders: true,
                  cacheKey: 'demo-form'
                }}
                textareaProps={{ rows: 3 }}
              />
            </div>
          </div>

          {/* Feature Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-800 text-sm">Blur-Aware Prompts</h4>
              <p className="text-xs text-blue-600 mt-1">Leave required fields empty to see prompts</p>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium text-green-800 text-sm">Completion Hints</h4>
              <p className="text-xs text-green-600 mt-1">Type in fields to see suggestions</p>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="font-medium text-purple-800 text-sm">Animated Borders</h4>
              <p className="text-xs text-purple-600 mt-1">Focus on fields to see glowing effect</p>
            </div>
          </div>

          <Button className="w-full" disabled>
            Demo Form - Features Active
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};