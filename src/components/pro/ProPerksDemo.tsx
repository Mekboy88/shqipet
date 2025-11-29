import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PremiumLoginAnimations } from '@/components/pro/PremiumLoginAnimations';
import { VerifiedFrameDemo } from '@/components/pro/BrandedVerifiedFrame';
import { DocsButtonDemo } from '@/components/pro/TooltipDocsButton';
import { Crown, Sparkles, HelpCircle } from 'lucide-react';

export const ProPerksDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-indigo-600" />
            Optional Pro-Only UI Perks Demo
          </CardTitle>
          <CardDescription>
            Exclusive visual polish and enhanced user experience features for Pro and Premium subscribers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Premium Login Animations */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
            <PremiumLoginAnimations isDemo={false} />
          </div>

          {/* Branded Verified Frames */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <VerifiedFrameDemo />
          </div>

          {/* Tooltip Docs Button */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
            <DocsButtonDemo />
          </div>

          {/* Pro Value Proposition */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Why Pro UI Perks Matter
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="h-6 w-6 text-indigo-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Premium Feel</h5>
                <p className="text-sm text-gray-600">
                  Exclusive animations and visual elements that make Pro users feel valued and special.
                </p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Status Recognition</h5>
                <p className="text-sm text-gray-600">
                  Verified badges and special frames that showcase Pro status to other users.
                </p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h5 className="font-medium text-gray-800 mb-2">Enhanced Support</h5>
                <p className="text-sm text-gray-600">
                  Contextual help and documentation access for better user experience.
                </p>
              </div>
            </div>
          </div>

          {/* Implementation Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
              </div>
              <h4 className="font-medium text-indigo-800 text-sm">Premium Animations</h4>
              <p className="text-xs text-indigo-600 mt-1">Custom login transitions</p>
              <Badge variant="outline" className="mt-2 text-indigo-700 border-indigo-300">
                Implemented
              </Badge>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Crown className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="font-medium text-purple-800 text-sm">Verified Frames</h4>
              <p className="text-xs text-purple-600 mt-1">Glowing profile borders</p>
              <Badge variant="outline" className="mt-2 text-purple-700 border-purple-300">
                Implemented
              </Badge>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <HelpCircle className="h-4 w-4 text-orange-600" />
              </div>
              <h4 className="font-medium text-orange-800 text-sm">Docs Integration</h4>
              <p className="text-xs text-orange-600 mt-1">Contextual help buttons</p>
              <Badge variant="outline" className="mt-2 text-orange-700 border-orange-300">
                Implemented
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};