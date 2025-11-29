import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeHighlighterProps {
  content: string;
  className?: string;
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({ content, className = '' }) => {
  // Function to parse and render content with code blocks
  const renderContentWithCodeBlocks = (text: string) => {
    // Split by code blocks (both ``` and single backticks)
    const parts = text.split(/```(\w*)\n?([\s\S]*?)```|`([^`]+)`/g);
    
    return parts.map((part, index) => {
      // Check if this is a code block
      if (index % 4 === 1) {
        // This is the language identifier
        return null;
      } else if (index % 4 === 2) {
        // This is the code content for ```
        const language = parts[index - 1] || 'typescript';
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-3 py-1 text-xs text-gray-300 font-mono border-b border-gray-700">
              {language || 'code'}
            </div>
            <SyntaxHighlighter
              language={language || 'typescript'}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '16px',
                backgroundColor: '#1e1e1e',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
              wrapLines={true}
              wrapLongLines={true}
            >
              {part}
            </SyntaxHighlighter>
          </div>
        );
      } else if (index % 4 === 3) {
        // This is inline code content for single backticks
        return (
          <code
            key={index}
            className="bg-gray-800 text-gray-100 px-2 py-1 rounded text-sm font-mono"
          >
            {part}
          </code>
        );
      } else {
        // This is regular text
        return part ? (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        ) : null;
      }
    });
  };

  return (
    <div className={`leading-relaxed ${className}`}>
      {renderContentWithCodeBlocks(content)}
    </div>
  );
};

export default CodeHighlighter;