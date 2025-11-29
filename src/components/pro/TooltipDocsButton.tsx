import React, { useState } from 'react';
import { Info, HelpCircle, ExternalLink, X, BookOpen, Video, FileText } from 'lucide-react';

interface TooltipDocsButtonProps {
  title: string;
  content: string;
  helpUrl?: string;
  variant?: 'info' | 'help' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export const TooltipDocsButton: React.FC<TooltipDocsButtonProps> = ({
  title,
  content,
  helpUrl,
  variant = 'info',
  size = 'sm',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const variants = {
    info: {
      icon: Info,
      iconColor: 'text-blue-500 hover:text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900'
    },
    help: {
      icon: HelpCircle,
      iconColor: 'text-gray-500 hover:text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-900'
    },
    warning: {
      icon: Info,
      iconColor: 'text-orange-500 hover:text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900'
    }
  };

  const sizes = {
    sm: { icon: 'h-4 w-4', popup: 'max-w-xs' },
    md: { icon: 'h-5 w-5', popup: 'max-w-sm' }
  };

  const config = variants[variant];
  const sizeConfig = sizes[size];
  const IconComponent = config.icon;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${config.iconColor} transition-colors p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        aria-label="More information"
      >
        <IconComponent className={sizeConfig.icon} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Popup */}
          <div className={`
            absolute top-full left-0 mt-2 z-50 
            ${sizeConfig.popup} ${config.bgColor} ${config.borderColor} ${config.textColor}
            border rounded-lg shadow-lg p-4 animate-fade-in
          `}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">{title}</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="text-sm leading-relaxed mb-4">
              {content}
            </div>

            {/* Help Actions */}
            <div className="flex items-center gap-2">
              {helpUrl && (
                <a
                  href={helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-white border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Learn More
                </a>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface HelpResourceType {
  type: 'article' | 'video' | 'guide';
  title: string;
  description: string;
  url: string;
  duration?: string;
}

interface ProHelpCenterProps {
  topic: string;
  resources: HelpResourceType[];
  className?: string;
}

export const ProHelpCenter: React.FC<ProHelpCenterProps> = ({
  topic,
  resources,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: HelpResourceType['type']) => {
    switch (type) {
      case 'article': return FileText;
      case 'video': return Video;
      case 'guide': return BookOpen;
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-200 transition-colors"
      >
        <HelpCircle className="h-3 w-3" />
        Help Center
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">Help: {topic}</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Resources */}
            <div className="p-4 space-y-3">
              {resources.map((resource, index) => {
                const Icon = getIcon(resource.type);
                return (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-gray-900 leading-tight">
                        {resource.title}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {resource.description}
                      </p>
                      {resource.duration && (
                        <div className="text-xs text-indigo-600 mt-1">
                          {resource.duration}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  </a>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <a
                href="#"
                className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Browse All Help Articles
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface DocsButtonDemoProps {
  className?: string;
}

export const DocsButtonDemo: React.FC<DocsButtonDemoProps> = ({ className = '' }) => {
  const helpResources: HelpResourceType[] = [
    {
      type: 'video',
      title: 'Getting Started with Pro Features',
      description: 'Complete walkthrough of all Pro features and how to use them effectively.',
      url: '#',
      duration: '8 min'
    },
    {
      type: 'article',
      title: 'Pro Settings Configuration',
      description: 'Step-by-step guide to configure your Pro account settings for optimal performance.',
      url: '#'
    },
    {
      type: 'guide',
      title: 'Pro Best Practices',
      description: 'Tips and tricks to get the most out of your Pro subscription.',
      url: '#'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h4 className="font-medium text-orange-800 mb-4">Tooltip Docs Button</h4>
        
        {/* Interactive Examples */}
        <div className="space-y-4">
          {/* Form Field Example */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">
                Pro Subscription Plan
              </label>
              <TooltipDocsButton
                title="Subscription Plans"
                content="Pro plans include advanced features like custom animations, verified badges, and priority support. You can upgrade or downgrade at any time."
                helpUrl="#"
                variant="info"
              />
            </div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Basic (Free)</option>
              <option>Pro ($9/month)</option>
              <option>Premium ($19/month)</option>
            </select>
            <div className="text-xs text-gray-500 mt-1">Form Field Example</div>
          </div>

          {/* Settings Example */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Enable Premium Animations
                </span>
                <TooltipDocsButton
                  title="Premium Animations"
                  content="Premium animations include smooth transitions, loading effects, and verified badge displays. These features are exclusive to Pro subscribers."
                  helpUrl="#"
                  variant="help"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <ProHelpCenter
                  topic="Premium Animations"
                  resources={helpResources}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Settings Panel Example</div>
          </div>

          {/* Warning Example */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-orange-800">
                Account Verification Required
              </span>
              <TooltipDocsButton
                title="Account Verification"
                content="Pro features require account verification for security. Please verify your email and phone number to access all Pro features."
                helpUrl="#"
                variant="warning"
              />
            </div>
            <div className="text-xs text-orange-600 mt-2">Warning Message Example</div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-2">Mini Popup Features</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Quick explanations without leaving page</li>
              <li>• Direct links to detailed help articles</li>
              <li>• Context-aware content</li>
              <li>• Keyboard accessible (Esc to close)</li>
            </ul>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h5 className="font-medium text-indigo-800 mb-2">Help Center Integration</h5>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Categorized help resources</li>
              <li>• Video tutorials and guides</li>
              <li>• Direct dashboard integration</li>
              <li>• Pro-specific documentation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};