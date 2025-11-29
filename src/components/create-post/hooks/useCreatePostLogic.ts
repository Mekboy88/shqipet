import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useS3FileUpload } from '@/hooks/useS3FileUpload';
import { validateFilesWithSecurity } from '@/utils/enhancedSecurityFilter';
import { usePostsData } from '@/contexts/posts/usePostsData';
import { useAuth } from '@/contexts/AuthContext';

interface CreatePostHookReturn {
  postContent: string;
  setPostContent: (content: string) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  isPosting: boolean;
  handlePost: () => Promise<void>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeFile: (index: number) => void;
  canPost: boolean;
  getInitials: (name: string) => string;
  getUserName: () => string;
  getUserImage: () => string | null;
  uploadStatus: string;
  isScanning: boolean;
}

export const useCreatePostLogic = (): CreatePostHookReturn => {
  const [postContent, setPostContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // Use context hooks
  const { addPost } = usePostsData();
  const { user, userProfile } = useAuth();
  
  // Use the ultra-stable S3 upload hook
  const { uploadFile, uploadProgress, isUploading, error, connectionStatus } = useS3FileUpload();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserName = () => {
    const first = user?.user_metadata?.first_name || userProfile?.first_name || '';
    const last = user?.user_metadata?.last_name || userProfile?.last_name || '';
    if (first && last) return `${first} ${last}`;
    return first || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };

  const getUserImage = () => {
    return user?.user_metadata?.avatar_url || null;
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    console.log('📁 Files selected:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    setIsScanning(true);
    
    try {
      // ULTRA-SECURE COMPREHENSIVE SCANNING
      toast.info('🛡️ MAXIMUM SECURITY: Scanning for ALL threats...', {
        duration: 3000,
        description: 'Checking against comprehensive threat database'
      });

      const { validFiles, blockedFiles, securityReport } = await validateFilesWithSecurity(files);
      
      // Log security report
      console.log('🛡️ SECURITY SCAN COMPLETE:', securityReport);
      
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        toast.success(`🛡️ SECURITY VERIFIED: ${validFiles.length} safe file(s)`, {
          duration: 4000,
          description: `Scanned ${securityReport.totalScanned} files - ${securityReport.blocked} threats blocked`
        });
      }
      
      if (blockedFiles.length > 0) {
        console.warn('🚫 SECURITY THREATS BLOCKED:', blockedFiles);
        
        // Show detailed security alert
        toast.error(`🛡️ MAXIMUM SECURITY: ${blockedFiles.length} threat(s) blocked`, {
          description: `Protected against: ${Object.keys(securityReport.blockedCategories).join(', ')}`,
          duration: 8000,
          action: {
            label: "Security Report",
            onClick: () => {
              toast.info("🔒 All blocked files contained security threats", {
                description: "Our system detected executables, malware, or suspicious patterns",
                duration: 10000
              });
            }
          }
        });
      }
      
    } catch (error) {
      console.error('❌ Security scan failed:', error);
      toast.error('Security scan failed. Please try again.');
    } finally {
      setIsScanning(false);
      // Reset the input value to allow selecting the same file again
      event.target.value = '';
    }
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed from post');
  };

  const handlePost = useCallback(async () => {
    console.log('🚀 Starting ultra-stable post creation process...');
    console.log('📊 Post data:', {
      contentLength: postContent.length,
      filesCount: selectedFiles.length,
      connectionStatus,
      files: selectedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
    });

    if (!postContent.trim() && selectedFiles.length === 0) {
      toast.error("Please add some content or select files to post");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create posts");
      return;
    }

    setIsPosting(true);
    
    try {
      let fileUrls: string[] = [];

      // Ultra-stable file upload process
      if (selectedFiles.length > 0) {
        console.log('📁 Starting ultra-stable file upload process...');
        console.log('🔗 Connection status:', connectionStatus);
        
        // Show connection status to user
        if (connectionStatus.connectionQuality === 'offline') {
          toast.warning('Connection issues detected - will retry automatically', {
            duration: 3000
          });
        } else if (connectionStatus.connectionQuality === 'poor') {
          toast.info('Using backup upload system for stability', {
            duration: 2000
          });
        }

        const uploadPromises = selectedFiles.map(async (file, index) => {
          try {
            console.log(`🚀 [${index + 1}/${selectedFiles.length}] Ultra-stable upload for:`, file.name);
            
            // Show individual file progress
            toast.info(`Uploading ${file.name}...`, {
              duration: 1000
            });
            
            const publicUrl = await uploadFile(file);
            console.log(`✅ [${index + 1}/${selectedFiles.length}] File uploaded successfully:`, {
              fileName: file.name,
              url: publicUrl
            });
            
            return publicUrl;
          } catch (error: any) {
            console.error(`❌ [${index + 1}/${selectedFiles.length}] File upload failed for:`, file.name);
            console.error('❌ Upload error details:', error);
            
            // Show specific error for this file
            toast.error(`Failed to upload ${file.name}: ${error.message}`, {
              duration: 5000
            });
            
            throw error;
          }
        });
        
        try {
          fileUrls = await Promise.all(uploadPromises);
          console.log('✅ All files uploaded successfully:', fileUrls);
          
          toast.success(`Successfully uploaded ${fileUrls.length} files!`, {
            duration: 2000
          });
        } catch (uploadError) {
          console.error('💥 File upload process failed:', uploadError);
          
          // For now, continue with text-only post if files fail but we have text
          if (postContent.trim()) {
            console.log('📝 S3 upload failed, creating text-only post instead...');
            toast.warning('File upload failed, creating text-only post', {
              description: 'S3 configuration needs to be fixed for file uploads',
              duration: 3000
            });
            fileUrls = []; // No files for this post
          } else {
            // If no text content, we can't create the post
            throw new Error('File upload failed and no text content provided');
          }
        }
      }
      
      // Create the post using PostsContext which handles Supabase properly
      console.log('📝 Creating post with ultra-stable database operation...');
      
      const userName = getUserName();
      const userImage = getUserImage();
      
      const newPost = {
        user: { 
          name: userName, 
          image: userImage || '', 
          verified: false 
        },
        time: 'just now',
        visibility: 'public',
        isSponsored: false,
        postType: 'regular',
        content: {
          text: postContent.trim() || undefined,
          images: fileUrls.length > 0 ? fileUrls : undefined
        },
        shares: 0 // Initialize share count for new posts
      };

      console.log('📤 Creating post via PostsContext:', newPost);

      await addPost(newPost);

      console.log('✅ Post created successfully via PostsContext with sharing enabled');

      // Success feedback
      toast.success('Post created successfully!', {
        description: fileUrls.length > 0 ? `Posted with ${fileUrls.length} files` : 'Text post created and ready to share',
        duration: 3000,
      });

      // Reset form
      setPostContent('');
      setSelectedFiles([]);
      
    } catch (error: any) {
      console.error('💥 Complete post creation failed:', error);
      
      toast.error('Failed to create post', {
        description: error.message || 'An unexpected error occurred',
        duration: 5000,
      });
    } finally {
      setIsPosting(false);
    }
  }, [postContent, selectedFiles, uploadFile, connectionStatus, addPost, user]);

  const canPost = (postContent.trim().length > 0 || selectedFiles.length > 0) && !isPosting && !isUploading && !isScanning;

  return {
    postContent,
    setPostContent,
    selectedFiles,
    setSelectedFiles,
    isPosting: isPosting || isUploading,
    handlePost,
    handleFileSelect,
    removeFile,
    canPost,
    getInitials,
    getUserName,
    getUserImage,
    uploadStatus: connectionStatus.connectionQuality,
    isScanning
  };
};