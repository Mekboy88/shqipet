import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  ExternalLink,
  Activity,
  Zap
} from 'lucide-react';

// Import all menu items to get sections and buttons
import { coreMenuItems } from '@/components/admin/menu/coreMenuItems';
import { usersAccessMenuItems } from '@/components/admin/menu/usersAccessMenuItems';
import { contentMenuItems } from '@/components/admin/menu/contentMenuItems';
import { businessMenuItems } from '@/components/admin/menu/businessMenuItems';
import { securityLogsMenuItems } from '@/components/admin/menu/securityLogsMenuItems';
import { devToolsMenuItems } from '@/components/admin/menu/devToolsMenuItems';
import { aiSmartMenuItems } from '@/components/admin/menu/aiSmartMenuItems';
import { advancedMenuItems } from '@/components/admin/menu/advancedMenuItems';
import { revenueMenuItems } from '@/components/admin/menu/revenueMenuItems';

// Combine all menu items
const ALL_MENU_ITEMS = [
  ...coreMenuItems,
  ...usersAccessMenuItems,
  ...contentMenuItems,
  ...businessMenuItems,
  ...securityLogsMenuItems,
  ...devToolsMenuItems,
  ...aiSmartMenuItems,
  ...advancedMenuItems,
  ...revenueMenuItems
];

interface DetailedTopologyViewProps {
  cardData: {
    id: string;
    name: string;
    app: string;
    status: string;
    icon: any;
    uptime: number;
    latency: number;
    issues: number;
    lastTest: string;
    description: string;
    route: string;
    level: number;
    exists: boolean;
  };
  onBack: () => void;
}

// Custom Node Component for Sections
const SectionNode = ({ data }: { data: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'issues': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'issues': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg min-w-[300px] hover:shadow-xl transition-all duration-200">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {data.icon && <data.icon className="h-5 w-5 text-primary" />}
            <h3 className="font-semibold text-foreground">{data.label}</h3>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(data.status)}
            <div className={`w-2 h-2 rounded-full ${getStatusColor(data.status)}`}></div>
          </div>
        </div>
        
        {/* Hover Information */}
        <div className="text-xs text-muted-foreground mb-2">
          <div>Status: {data.status === 'connected' ? 'Connected' : data.status === 'issues' ? 'Has Issues' : 'Unknown'}</div>
          <div>Uptime: {data.uptime || 99.9}%</div>
          <div>Latency: {data.latency || 45}ms</div>
          <div>Issues: {data.issues || 0}</div>
          <div>Last Check: {data.lastCheck || '1 min ago'}</div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          Show Buttons ({data.buttons?.length || 0})
          <Activity className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && data.buttons && (
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground mb-3">AVAILABLE BUTTONS:</div>
          {data.buttons.map((button: any, index: number) => (
            <div
              key={`${button.id}-${index}`}
              className="group relative"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 h-9 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                onClick={() => {
                  if (button.href) {
                    window.open(button.href, '_blank');
                  }
                }}
              >
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium truncate">{button.label}</span>
                {button.href && <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
              </Button>
              
              {/* Hover tooltip with detailed info */}
              <div className="absolute left-full top-0 ml-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px] max-w-[300px]">
                  <div className="text-xs font-semibold text-foreground mb-1">{button.label}</div>
                  {button.description && (
                    <div className="text-xs text-muted-foreground mb-2">{button.description}</div>
                  )}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Path: {button.href || 'N/A'}</div>
                    <div>Status: {Math.random() > 0.3 ? 'Connected' : 'Issues'}</div>
                    <div>Response: {Math.floor(Math.random() * 100) + 20}ms</div>
                    <div>Health: {Math.floor(Math.random() * 20) + 80}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  section: SectionNode,
};

export const DetailedTopologyView: React.FC<DetailedTopologyViewProps> = ({ cardData, onBack }) => {
  // Get sections and buttons for this specific card/page
  const getPageSections = useCallback(() => {
    // Find relevant menu items based on card type/route
    const relevantMenuItems = ALL_MENU_ITEMS.filter(item => {
      // Match based on various criteria
      const nameMatch = item.label.toLowerCase().includes(cardData.name.toLowerCase().split(' ')[0]);
      const routeMatch = item.href?.includes(cardData.route?.replace('/', ''));
      const idMatch = item.id.includes(cardData.id);
      
      return nameMatch || routeMatch || idMatch;
    });

    // If no direct match, get related sections based on card category
    if (relevantMenuItems.length === 0) {
      if (cardData.route?.includes('/admin')) {
        return coreMenuItems.slice(0, 2); // Get first 2 core sections
      }
      if (cardData.name.toLowerCase().includes('user')) {
        return usersAccessMenuItems.slice(0, 2);
      }
      if (cardData.name.toLowerCase().includes('content') || cardData.name.toLowerCase().includes('post')) {
        return contentMenuItems;
      }
      // Default fallback - get some core items
      return coreMenuItems.slice(0, 1);
    }
    
    return relevantMenuItems;
  }, [cardData]);

  // Generate nodes for sections and their buttons
  const generateNodes = useCallback(() => {
    const sections = getPageSections();
    const nodes: Node[] = [];
    
    sections.forEach((section, sectionIndex) => {
      // Create section node
      const sectionNode: Node = {
        id: `section-${section.id}`,
        type: 'section',
        position: { 
          x: (sectionIndex % 3) * 400, 
          y: Math.floor(sectionIndex / 3) * 300 
        },
        data: {
          ...section,
          status: Math.random() > 0.2 ? 'connected' : Math.random() > 0.5 ? 'issues' : 'warning',
          uptime: Math.floor(Math.random() * 10) + 90,
          latency: Math.floor(Math.random() * 100) + 20,
          issues: Math.floor(Math.random() * 3),
          lastCheck: `${Math.floor(Math.random() * 5) + 1} min ago`,
          buttons: section.submenu || []
        },
      };
      
      nodes.push(sectionNode);
    });

    return nodes;
  }, [getPageSections]);

  // Generate edges between sections
  const generateEdges = useCallback(() => {
    const sections = getPageSections();
    const edges: Edge[] = [];
    
    sections.forEach((section, index) => {
      if (index > 0) {
        edges.push({
          id: `edge-${index}`,
          source: `section-${sections[index - 1].id}`,
          target: `section-${section.id}`,
          type: 'smoothstep',
          animated: Math.random() > 0.5,
          style: { 
            stroke: Math.random() > 0.3 ? '#22c55e' : '#ef4444',
            strokeWidth: 2
          },
        });
      }
    });

    return edges;
  }, [getPageSections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(generateNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'issues': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'issues': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
              
              <div className="flex items-center gap-3">
                {cardData.icon && <cardData.icon className="h-6 w-6 text-primary" />}
                <div>
                  <h1 className="text-xl font-bold text-foreground">{cardData.name}</h1>
                  <p className="text-sm text-muted-foreground">{cardData.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(cardData.status)}
                <span className={`text-sm font-medium ${getStatusColor(cardData.status)}`}>
                  {cardData.status === 'connected' ? 'Connected' : cardData.status === 'issues' ? 'Has Issues' : 'Unknown'}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {cardData.uptime}% uptime • {cardData.latency}ms latency
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Topology View */}
      <div style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          className="bg-background"
        >
          <Controls 
            position="top-right" 
            style={{
              top: '20px',
              right: '20px',
              zIndex: 1001,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.data?.status) {
                case 'connected': return '#22c55e';
                case 'issues': return '#ef4444';
                case 'warning': return '#eab308';
                default: return '#6b7280';
              }
            }}
            position="bottom-right"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default DetailedTopologyView;