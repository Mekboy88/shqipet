import React, { useState } from 'react';
import { Camera, Video, Smile, Image, MapPin, Tag, Shield, Sparkles } from 'lucide-react';
import CreatePostFilePreview from '@/components/create-post/CreatePostFilePreview';
import CreatePostAttachments from '@/components/create-post/CreatePostAttachments';
import { useCreatePostLogic } from '@/components/create-post/hooks/useCreatePostLogic';
// Import new feature components
import LinkPreviewGenerator from '@/components/create-post/features/LinkPreviewGenerator';
import ContentWarningSelector from '@/components/create-post/features/ContentWarningSelector';
import PostExpirationSelector from '@/components/create-post/features/PostExpirationSelector';
import BackgroundRemovalTool from '@/components/create-post/features/BackgroundRemovalTool';
import VoiceToTextDictation from '@/components/create-post/features/VoiceToTextDictation';
import CrossPlatformSharing from '@/components/create-post/features/CrossPlatformSharing';
import DuplicatePostWarning from '@/components/create-post/features/DuplicatePostWarning';
import AdvancedAudienceTargeting from '@/components/create-post/features/AdvancedAudienceTargeting';
import ContentModerationPreview from '@/components/create-post/features/ContentModerationPreview';
import TranslationOptions from '@/components/create-post/features/TranslationOptions';

const PostCreationArea: React.FC = () => {
  const {
    postContent,
    setPostContent,
    selectedFiles,
    handleFileSelect,
    removeFile,
    handlePost,
    canPost,
    isPosting,
    isScanning,
    getUserName
  } = useCreatePostLogic();

  // New feature states
  const [linkPreviews, setLinkPreviews] = useState<any[]>([]);
  const [contentWarnings, setContentWarnings] = useState<string[]>([]);
  const [postExpiration, setPostExpiration] = useState<string | null>(null);
  const [crossPlatforms, setCrossPlatforms] = useState<string[]>([]);
  const [audienceSettings, setAudienceSettings] = useState({
    privacy: 'public',
    excludedUsers: [],
    specificUsers: [],
  });
  const [translationSettings, setTranslationSettings] = useState({
    autoTranslate: false,
    targetLanguages: [],
    showOriginal: true,
  });
  const [translatedContent, setTranslatedContent] = useState<{ [key: string]: string }>({});

  const handleVoiceText = (text: string) => {
    setPostContent(postContent + ' ' + text);
  };

  const handleProcessedFile = (originalFile: File, processedFile: File) => {
    // Create a proper file input event
    const fileList = new DataTransfer();
    fileList.items.add(processedFile);
    
    const mockEvent = {
      target: { files: fileList.files },
      currentTarget: { files: fileList.files },
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleFileSelect(mockEvent);
  };

  return (
    <div className="relative">
      {/* 2000 Premium Badge */}
      <div className="absolute -top-3 -right-3 z-20">
        <div className="bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border-2 border-primary/20 animate-pulse">
          <Sparkles className="w-3 h-3 inline mr-1" />
          2000
        </div>
      </div>

      {/* World Class Post Creation Container */}
      <div className="bg-gradient-to-br from-card via-card/98 to-card/95 rounded-2xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
        
        {/* Premium Header Bar */}
        <div className="h-1 bg-gradient-to-r from-primary/60 via-accent to-primary/60" />
        
        {/* Main Content Area */}
        <div className="p-6">
          
          {/* User Input Section */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                P
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-card"></div>
            </div>
            
            <div className="flex-1 space-y-4">
              <textarea 
                placeholder={`What's on your mind${getUserName() ? `, ${getUserName()}` : ''}?`}
                className="w-full p-4 border border-border/30 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 min-h-[120px]"
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                disabled={isPosting || isScanning}
              />

              {/* Security Status */}
              {(isScanning || selectedFiles.length > 0) && (
                <div className="flex items-center gap-2 text-xs">
                  <Shield className={`w-3 h-3 ${isScanning ? 'text-yellow-500' : 'text-green-500'}`} />
                  <span className="text-muted-foreground">
                    {isScanning ? 'Scanning for security threats...' : 'All files secured ✓'}
                  </span>
                </div>
              )}
              
              {/* Link Preview Generator */}
              <LinkPreviewGenerator 
                content={postContent}
                onPreviewChange={setLinkPreviews}
              />

              {/* Duplicate Post Warning */}
              <DuplicatePostWarning content={postContent} />

              {/* File Preview */}
              {selectedFiles.length > 0 && (
                <CreatePostFilePreview 
                  files={selectedFiles}
                  onRemoveFile={removeFile}
                />
              )}

              {/* Background Removal Tool */}
              {selectedFiles.length > 0 && (
                <BackgroundRemovalTool 
                  selectedFiles={selectedFiles}
                  onProcessedFile={handleProcessedFile}
                />
              )}
              
              {/* Attachments */}
              <CreatePostAttachments onFileSelect={handleFileSelect} />

              {/* Voice to Text */}
              <VoiceToTextDictation onTextGenerated={handleVoiceText} />

              {/* Advanced Features Row */}
              <div className="flex flex-wrap gap-2">
                <ContentWarningSelector 
                  warnings={contentWarnings}
                  onWarningsChange={setContentWarnings}
                />
                <PostExpirationSelector 
                  expiration={postExpiration}
                  onExpirationChange={setPostExpiration}
                />
                <CrossPlatformSharing 
                  selectedPlatforms={crossPlatforms}
                  onPlatformsChange={setCrossPlatforms}
                />
                <AdvancedAudienceTargeting 
                  settings={audienceSettings}
                  onSettingsChange={setAudienceSettings}
                />
                <TranslationOptions 
                  settings={translationSettings}
                  onSettingsChange={setTranslationSettings}
                  content={postContent}
                  onContentChange={setTranslatedContent}
                />
              </div>

              {/* Content Moderation Preview */}
              <ContentModerationPreview 
                content={postContent}
                files={selectedFiles}
              />
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="border-t border-border/30 pt-4">
            <div className="flex items-center justify-between">
              
              {/* Left Side - Quick Actions */}
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-xl transition-all duration-200 border border-blue-200/50 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group">
                  <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Photo</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 rounded-xl transition-all duration-200 border border-purple-200/50 hover:border-purple-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group">
                  <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Video</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 rounded-xl transition-all duration-200 border border-green-200/50 hover:border-green-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 group">
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">AI Generate</span>
                </button>
              </div>

              {/* Right Side - Additional Options & Post Button */}
              <div className="flex items-center space-x-3">
                {/* See All Link */}
                <button className="text-xs text-primary hover:text-primary/80 font-medium hover:underline">
                  See All Options
                </button>
                
                {/* Mini Action Icons */}
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    <MapPin className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    <Tag className="w-4 h-4" />
                  </button>
                </div>

                {/* Post Button */}
                <button 
                  onClick={handlePost}
                  disabled={!canPost}
                  className={`px-8 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg transform ${
                    canPost
                      ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground hover:shadow-xl hover:-translate-y-0.5 hover:scale-105" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isPosting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Posting...
                    </div>
                  ) : isScanning ? (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Scanning...
                    </div>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreationArea;