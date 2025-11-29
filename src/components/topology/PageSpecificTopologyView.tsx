import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertTriangle, 
         Type, Square, MousePointer, Link as LinkIcon, FileText, 
         Eye, Database, Wifi, WifiOff } from 'lucide-react';
import { usePageSpecificScanning } from './PageSpecificScanner';

interface PageSpecificTopologyViewProps {
  onBack: () => void;
}

const PageSpecificTopologyView: React.FC<PageSpecificTopologyViewProps> = ({ onBack }) => {
  const { sections, isScanning, rescan } = usePageSpecificScanning();

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'heading': return Type;
      case 'input': return Square;
      case 'button': return MousePointer;
      case 'link': return LinkIcon;
      case 'form': return FileText;
      default: return Eye;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'error': return XCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Page Elements Topology</h1>
            <p className="text-gray-600">Real elements currently visible on this page</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={rescan}
          disabled={isScanning}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Rescan Page'}
        </Button>
      </div>

      {/* Page Info */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Current Page: {window.location.pathname}
            </CardTitle>
            <CardDescription>
              Found {sections.reduce((total, section) => total + section.elements.length, 0)} visible elements 
              in {sections.length} sections
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <Card key={section.id} className="bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                  {sectionIndex + 1}
                </div>
                {section.name}
              </CardTitle>
              <CardDescription>
                {section.elements.length} elements | Position: {Math.round(section.position.top)}px from top
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.elements.map((element) => {
                  const Icon = getElementIcon(element.type);
                  const StatusIcon = getStatusIcon(element.status);
                  
                  return (
                    <Card key={element.id} className={`border-2 ${getStatusColor(element.status)}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {element.text.length > 30 ? element.text.substring(0, 30) + '...' : element.text}
                          <StatusIcon className="h-4 w-4 ml-auto" />
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {element.tagName.toUpperCase()} element
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {/* Element Type */}
                          <div className="flex justify-between text-xs">
                            <span>Type:</span>
                            <Badge variant="outline" className="text-xs">
                              {element.type}
                            </Badge>
                          </div>
                          
                          {/* Position */}
                          <div className="flex justify-between text-xs">
                            <span>Position:</span>
                            <span className="text-gray-600">
                              {Math.round(element.position.x)}, {Math.round(element.position.y)}
                            </span>
                          </div>
                          
                          {/* Events */}
                          <div className="flex justify-between text-xs">
                            <span>Events:</span>
                            <span className={element.hasEvents ? 'text-green-600' : 'text-gray-600'}>
                              {element.hasEvents ? 'Yes' : 'No'}
                            </span>
                          </div>
                          
                          {/* Database Connection */}
                          <div className="flex justify-between text-xs">
                            <span>DB Status:</span>
                            <div className="flex items-center gap-1">
                              {element.dbConnected ? 
                                <Wifi className="h-3 w-3 text-green-600" /> : 
                                <WifiOff className="h-3 w-3 text-red-600" />
                              }
                              <span className={element.dbConnected ? 'text-green-600' : 'text-red-600'}>
                                {element.dbConnected ? 'Connected' : 'Not Connected'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Functionality */}
                          {element.functionality.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="text-xs font-medium text-gray-600 mb-1">Functionality:</div>
                              {element.functionality.slice(0, 2).map((func, index) => (
                                <div key={index} className="text-xs text-gray-600">
                                  • {func}
                                </div>
                              ))}
                              {element.functionality.length > 2 && (
                                <div className="text-xs text-gray-500 italic">
                                  +{element.functionality.length - 2} more...
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Errors */}
                          {element.errors.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-red-200">
                              <div className="text-xs font-medium text-red-600 mb-1">Issues:</div>
                              {element.errors.map((error, index) => (
                                <div key={index} className="text-xs text-red-600 flex items-center gap-1">
                                  <XCircle className="h-3 w-3 flex-shrink-0" />
                                  <span>{error}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No sections found */}
      {sections.length === 0 && !isScanning && (
        <Card>
          <CardContent className="py-12 text-center">
            <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No elements found</h3>
            <p className="text-gray-600 mb-4">
              No visible interactive elements were detected on this page.
            </p>
            <Button onClick={rescan} variant="outline">
              Try scanning again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PageSpecificTopologyView;