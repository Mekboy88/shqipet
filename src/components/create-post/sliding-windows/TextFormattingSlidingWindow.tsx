import React from 'react';
import SlidingWindow from './SlidingWindow';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Quote, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4 
} from 'lucide-react';

interface TextFormattingSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onFormatSelect?: (format: string) => void;
  icon?: React.ReactNode;
}

const TextFormattingSlidingWindow: React.FC<TextFormattingSlidingWindowProps> = ({
  isOpen,
  onClose,
  onFormatSelect,
  icon
}) => {
  const handleFormatClick = (format: string) => {
    onFormatSelect?.(format);
  };

  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Text Formatting"
      icon={icon}
      className=""
    >
      <div className="space-y-6">
        {/* Essential Formatting */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">ESSENTIAL</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('bold')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Bold className="h-4 w-4" />
              <span className="text-sm">Bold</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('italic')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Italic className="h-4 w-4" />
              <span className="text-sm">Italic</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('underline')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Underline className="h-4 w-4" />
              <span className="text-sm">Underline</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('strikethrough')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Strikethrough className="h-4 w-4" />
              <span className="text-sm">Strike</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('quote')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Quote className="h-4 w-4" />
              <span className="text-sm">Quote</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('code')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Code className="h-4 w-4" />
              <span className="text-sm">Code</span>
            </Button>
          </div>
        </div>

        {/* Headers */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">HEADERS</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('h1')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-start gap-3 px-4"
            >
              <Heading1 className="h-4 w-4" />
              <span className="text-sm">Header 1</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('h2')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-start gap-3 px-4"
            >
              <Heading2 className="h-4 w-4" />
              <span className="text-sm">Header 2</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('h3')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-start gap-3 px-4"
            >
              <Heading3 className="h-4 w-4" />
              <span className="text-sm">Header 3</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFormatClick('h4')}
              className="h-12 w-full rounded-full border border-border hover:bg-primary/10 hover:border-primary/20 hover:scale-105 transition-all duration-200 flex items-center justify-start gap-3 px-4"
            >
              <Heading4 className="h-4 w-4" />
              <span className="text-sm">Header 4</span>
            </Button>
          </div>
        </div>
      </div>
    </SlidingWindow>
  );
};

export default TextFormattingSlidingWindow;