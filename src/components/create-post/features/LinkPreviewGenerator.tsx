import React, { useState, useEffect } from 'react';
import { Link, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
}

interface LinkPreviewGeneratorProps {
  content: string;
  onPreviewChange: (previews: LinkPreview[]) => void;
}

const LinkPreviewGenerator: React.FC<LinkPreviewGeneratorProps> = ({ content, onPreviewChange }) => {
  const [previews, setPreviews] = useState<LinkPreview[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract URLs from content
  const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  // Mock fetch metadata (in real app, would call a backend service)
  const fetchMetadata = async (url: string): Promise<LinkPreview> => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real implementation, use Open Graph scraper
      const domain = new URL(url).hostname;
      return {
        url,
        title: `Preview for ${domain}`,
        description: `This is a preview description for the link from ${domain}`,
        image: `https://picsum.photos/200/100?random=${Math.floor(Math.random() * 1000)}`,
        domain
      };
    } catch (error) {
      return { url, domain: url };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urls = extractUrls(content);
    const newUrls = urls.filter(url => !previews.some(p => p.url === url));
    
    if (newUrls.length > 0) {
      Promise.all(newUrls.map(fetchMetadata)).then(newPreviews => {
        const updatedPreviews = [...previews, ...newPreviews];
        setPreviews(updatedPreviews);
        onPreviewChange(updatedPreviews);
      });
    }
  }, [content]);

  const removePreview = (url: string) => {
    const updatedPreviews = previews.filter(p => p.url !== url);
    setPreviews(updatedPreviews);
    onPreviewChange(updatedPreviews);
  };

  if (previews.length === 0 && !loading) return null;

  return (
    <div className="space-y-3">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link className="w-4 h-4 animate-pulse" />
          <span>Generating link preview...</span>
        </div>
      )}
      
      {previews.map((preview, index) => (
        <div key={index} className="border border-border rounded-lg overflow-hidden bg-card/50">
          <div className="flex">
            {preview.image && (
              <img 
                src={preview.image} 
                alt={preview.title}
                className="w-20 h-20 object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{preview.title || preview.domain}</p>
                  {preview.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{preview.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{preview.domain}</span>
                  </div>
                </div>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => removePreview(preview.url)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkPreviewGenerator;