import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LogIn, Key, Eye, EyeOff, User, Mail, Lock, UserPlus, RefreshCw, Chrome, Github, AlertCircle, CheckCircle, XCircle, Database, Activity, Zap, Clock, Shield, AlertTriangle, Wifi, WifiOff, Globe, Archive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRealComponentScanning } from './RealComponentScanner';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface RealTopologyViewProps {
  cardData: any;
  onBack: () => void;
}

// Action execution status window component
const ActionStatusWindow: React.FC<{ componentId: string; action: any }> = ({ componentId, action }) => {
  if (!action) return null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'start': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`absolute top-0 right-0 z-20 p-2 rounded-md border text-xs ${getStatusColor(action.status)} min-w-[120px] shadow-sm`}>
      <div className="font-medium flex items-center gap-1">
        {action.status === 'success' && <CheckCircle className="h-3 w-3" />}
        {action.status === 'error' && <AlertCircle className="h-3 w-3" />}
        {action.status === 'start' && <Activity className="h-3 w-3 animate-pulse" />}
        {action.lastAction}
      </div>
      <div className="text-xs opacity-70">
        Count: {action.count || 0}
      </div>
      <div className="text-xs opacity-70">
        {new Date(action.timestamp).toLocaleTimeString()}
      </div>
      {action.data?.responseTime && (
        <div className="text-xs opacity-70">
          {action.data.responseTime}ms
        </div>
      )}
    </div>
  );
};

// Database connectivity indicator
const DatabaseConnectivityBadge: React.FC<{ status: string; componentId: string }> = ({ status, componentId }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return { icon: Wifi, color: 'text-green-600 bg-green-50', label: 'Connected' };
      case 'disconnected':
        return { icon: WifiOff, color: 'text-red-600 bg-red-50', label: 'Disconnected' };
      case 'error':
        return { icon: AlertTriangle, color: 'text-orange-600 bg-orange-50', label: 'Error' };
      default:
        return { icon: Clock, color: 'text-gray-600 bg-gray-50', label: 'Unknown' };
    }
  };

  const { icon: Icon, color, label } = getStatusInfo();

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${color}`}>
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
};

// Custom Connection Line Component
const CustomConnectionLine: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getConnectionStyle = () => {
    const status = data?.status || 'stable';
    
    switch (status) {
      case 'stable':
        return {
          stroke: '#10b981',
          strokeWidth: 3,
          strokeDasharray: '10,5',
          opacity: 0.8,
          animation: 'dash-move 2s linear infinite',
        };
      case 'latency':
        return {
          stroke: '#f59e0b',
          strokeWidth: 2,
          strokeDasharray: '8,8',
          opacity: 0.7,
          animation: 'dash-move 3s linear infinite',
        };
      case 'down':
        return {
          stroke: '#ef4444',
          strokeWidth: 2,
          strokeDasharray: '6,6',
          opacity: 0.9,
        };
      default:
        return {
          stroke: '#6b7280',
          strokeWidth: 1,
          strokeDasharray: '4,4',
          opacity: 0.5,
        };
    }
  };

  const style = getConnectionStyle();

  return (
    <>
      <defs>
        <style>
          {`
            @keyframes dash-move {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 30; }
            }
          `}
        </style>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
      
      <circle
        cx={(sourceX + targetX) / 2}
        cy={(sourceY + targetY) / 2}
        r="4"
        fill={style.stroke as string}
        className={`${data?.status === 'down' ? 'animate-pulse' : ''}`}
      >
        <title>
          {`Connection Status: ${data?.status || 'stable'}${data?.issues ? `\nIssues: ${String(data.issues)}` : ''}`}
        </title>
      </circle>
    </>
  );
};

// Real Component Tree Node
const RealTreeNode = ({ data }: { data: any }) => {
  const { realComponents, dbConnections, errors } = useRealComponentScanning();
  
  const statusColors = {
    has_db_connection: 'bg-green-100 border-green-500',
    no_db_connection: 'bg-orange-100 border-orange-500',
    has_errors: 'bg-red-100 border-red-500',
    not_created: 'bg-gray-100 border-gray-400'
  };

  // Get real component data - ONLY what actually exists
  const realComponent = realComponents.find(comp => comp.id === data.id);

  // Determine ACTUAL status based on real component data
  const getActualStatus = () => {
    if (!realComponent && data.id !== 'supabase-database' && data.id !== 'current-route') {
      return 'not_created';
    }

    if (data.id === 'supabase-database') {
      const failedConnections = Object.values(dbConnections).filter((conn: any) => conn.status !== 'connected').length;
      const totalConnections = Object.keys(dbConnections).length;
      
      if (failedConnections > 0) return 'has_errors';
      if (totalConnections === 0) return 'has_errors';
      return 'has_db_connection';
    }

    if (data.id === 'current-route') {
      const routeErrors = data.issues || [];
      if (routeErrors.length > 0) return 'has_errors';
      return 'has_db_connection';
    }

    if (realComponent) {
      // Check for actual errors first
      if (realComponent.actualErrors.length > 0) return 'has_errors';
      
      // Check if has any database connections that work
      if (realComponent.dbConnectionSuccess > 0) return 'has_db_connection';
      
      // Check if has event handlers or functionality but no DB connection
      if (realComponent.hasClickHandler || realComponent.hasFormHandler || realComponent.hasEventListeners.length > 0) {
        return 'no_db_connection';
      }
      
      // Static element with no functionality
      return 'no_db_connection';
    }

    return 'not_created';
  };

  const actualStatus = getActualStatus();

  // If component doesn't exist in real scan, show as not created
  if (!realComponent && data.id !== 'supabase-database' && data.id !== 'current-route') {
    return (
      <div style={{ cursor: 'pointer' }} className="relative">
        <Card className="min-w-[280px] bg-gray-100 border-gray-400 opacity-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              COMPONENT NOT FOUND
              <XCircle className="h-4 w-4 ml-auto text-gray-500" />
            </CardTitle>
            <CardDescription className="text-xs">This component does not exist on the current page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const statusIcons = {
    has_db_connection: CheckCircle,
    no_db_connection: AlertTriangle,
    has_errors: XCircle,
    not_created: AlertCircle
  };

  const Icon = data.icon;
  const StatusIcon = statusIcons[actualStatus as keyof typeof statusIcons];
  const componentNetworkCalls = [];
  
  // Determine database connectivity status based on REAL behavior
  const getDbConnectivityStatus = () => {
    if (data.id === 'supabase-database') {
      const failedConnections = Object.values(dbConnections).filter((conn: any) => conn.status !== 'connected').length;
      const totalConnections = Object.keys(dbConnections).length;
      
      if (totalConnections === 0) return 'error';
      if (failedConnections > 0) return 'error';
      return 'connected';
    }
    
    if (realComponent) {
      if (realComponent.actualErrors.length > 0) {
        return 'error';
      }
      if (realComponent.dbConnectionSuccess > 0) {
        return 'connected';
      }
      return 'disconnected';
    }
    
    return 'disconnected';
  };

  const dbConnectivityStatus = getDbConnectivityStatus();
  return (
    <div style={{ cursor: 'pointer' }} className="relative">
      <Card className={`min-w-[280px] ${statusColors[actualStatus as keyof typeof statusColors]} ${data.background || ''} mb-4 relative`}>
        <Handle
          type="target"
          position={Position.Top}
          id={`${data.id}-top`}
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        />
        
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {realComponent ? realComponent.text : data.label}
            <StatusIcon className={`h-4 w-4 ml-auto ${
              actualStatus === 'has_db_connection' ? 'text-green-600' : 
              actualStatus === 'no_db_connection' ? 'text-orange-600' : 
              actualStatus === 'has_errors' ? 'text-red-600' : 'text-gray-500'
            }`} />
          </CardTitle>
          <CardDescription className="text-xs">
            {realComponent ? `REAL ${realComponent.type} - Found on DOM` : data.description}
          </CardDescription>
          
          <div className="mt-2">
            <DatabaseConnectivityBadge status={dbConnectivityStatus} componentId={data.id} />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>App:</span>
              <Badge variant="outline" className="text-xs">Current Page</Badge>
            </div>
            
            {/* REAL Component Information - ONLY what actually exists */}
            {realComponent && (
              <>
                <div className="flex justify-between text-xs">
                  <span>Type:</span>
                  <span className="text-blue-600">{realComponent.type}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Visible:</span>
                  <span className={realComponent.isVisible ? 'text-green-600' : 'text-red-600'}>
                    {realComponent.isVisible ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Event Handlers:</span>
                  <span className="text-purple-600">
                    {realComponent.hasEventListeners.length > 0 ? 
                      realComponent.hasEventListeners.join(', ') : 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Click Handler:</span>
                  <span className={realComponent.hasClickHandler ? 'text-green-600' : 'text-gray-600'}>
                    {realComponent.hasClickHandler ? 'Yes' : 'No'}
                  </span>
                </div>
                {realComponent.hasFormHandler && (
                  <div className="flex justify-between text-xs">
                    <span>Form Handler:</span>
                    <span className="text-green-600">Yes</span>
                  </div>
                )}
                {realComponent.placeholder && (
                  <div className="flex justify-between text-xs">
                    <span>Placeholder:</span>
                    <span className="text-gray-600 italic">"{realComponent.placeholder}"</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span>DB Calls:</span>
                  <span className="text-blue-600">
                    {realComponent.dbConnectionAttempts} attempts, {realComponent.dbConnectionSuccess} successful
                  </span>
                </div>
              </>
            )}
            
            {/* Database Connection Info - REAL data only */}
            {data.id !== 'supabase-database' && realComponent && (
              <>
                <div className="flex justify-between text-xs">
                  <span>DB Connected:</span>
                  <span className={realComponent.dbConnectionSuccess > 0 ? 'text-green-600' : 'text-red-600'}>
                    {realComponent.dbConnectionSuccess > 0 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Network Status:</span>
                  <span className={dbConnectivityStatus === 'connected' ? 'text-green-600' : 
                                  dbConnectivityStatus === 'error' ? 'text-orange-600' : 'text-red-600'}>
                    {dbConnectivityStatus === 'connected' ? 'Active' : 
                     dbConnectivityStatus === 'error' ? 'Issues' : 'Down'}
                  </span>
                </div>
              </>
            )}
            
            {/* Database-specific Information - REAL status only */}
            {data.id === 'supabase-database' && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <div className="text-xs font-medium text-blue-600 mb-1">REAL Database Health:</div>
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <Database className="h-3 w-3 flex-shrink-0" />
                  <span>PostgreSQL Connection Test</span>
                </div>
                <div className="text-xs text-gray-600">
                  Tables Tested: {Object.keys(dbConnections).length}
                </div>
                {Object.entries(dbConnections).map(([table, connection]: [string, any]) => (
                  <div key={table} className="text-xs text-gray-600 flex justify-between">
                    <span>{table}:</span>
                    <span className={connection.status === 'connected' ? 'text-green-600' : 'text-red-600'}>
                      {connection.status} ({connection.responseTime}ms)
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Network Calls Section - REAL intercepted calls */}
            {componentNetworkCalls.length > 0 && (
              <div className="mt-2 pt-2 border-t border-purple-200">
                <div className="text-xs font-medium text-purple-600 mb-1">Network Calls Intercepted:</div>
                {componentNetworkCalls.slice(-3).map((call: any, index: number) => (
                  <div key={index} className="text-xs text-gray-600 flex justify-between">
                    <span>{call.method}:</span>
                    <span className={call.success ? 'text-green-600' : 'text-red-600'}>
                      {call.success ? call.status : 'Failed'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {/* REAL Issues Section - ONLY actual errors */}
            {realComponent && realComponent.actualErrors.length > 0 && (
              <div className="mt-2 pt-2 border-t border-red-200">
                <div className="text-xs font-medium text-red-600 mb-1">ACTUAL Issues Found:</div>
                {realComponent.actualErrors.map((issue: string, index: number) => (
                  <div key={index} className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="h-3 w-3 flex-shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Functionality List */}
            {realComponent && realComponent.functionality.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Functionality:</div>
                {realComponent.functionality.map((func: string, index: number) => (
                  <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                    <Activity className="h-3 w-3 flex-shrink-0" />
                    <span>{func}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${data.id}-bottom`}
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        />
      </Card>
    </div>
  );
};

const RealTopologyView: React.FC<RealTopologyViewProps> = ({ cardData, onBack }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { realComponents, dbConnections, errors, routes, dbHealth, overallStatus } = useRealComponentScanning();

  useEffect(() => {
    const generateRealComponentStructure = () => {
      const baseComponents = [];
      const baseEdges = [];
      
      // Show ONLY real database health with actual status
      const failedDbConnections = Object.values(dbConnections).filter((conn: any) => conn.status !== 'connected').length;
      const totalDbConnections = Object.keys(dbConnections).length;
      const dbHealthPercentage = totalDbConnections > 0 ? ((totalDbConnections - failedDbConnections) / totalDbConnections * 100).toFixed(1) : '0';
      
      // Database card is GREEN only if ALL connections work and no errors
      const dbCardStatus = totalDbConnections === 0 ? 'has_errors' :
                          failedDbConnections > 0 ? 'has_errors' :
                          'has_db_connection';
      
      baseComponents.push({
        id: 'supabase-database',
        type: 'realTreeNode',
        position: { x: 800, y: 200 },
        data: {
          id: 'supabase-database',
          label: 'Supabase Database',
          description: `PostgreSQL - ${dbHealthPercentage}% healthy (${totalDbConnections} connections tested)`,
          icon: Database,
          type: 'Database',
          functional: dbCardStatus === 'has_db_connection',
          // Card background reflects ACTUAL database status
          background: dbCardStatus === 'has_errors' ? 'bg-red-50 border-red-200' : 
                     'bg-green-50 border-green-200',
          issues: Object.entries(dbConnections)
                    .filter(([_, conn]: [string, any]) => conn.status !== 'connected')
                    .map(([table, conn]: [string, any]) => `${table}: ${conn.error || 'Connection failed'}`),
          metadata: {
            totalConnections: totalDbConnections,
            failedConnections: failedDbConnections,
            dbCardStatus
          }
        }
      });

      // Show current route information - REAL route only
      const currentPath = window.location.pathname;
      const currentRoute = routes.find(r => r.path === currentPath || currentPath.startsWith(r.path + '/'));
      if (currentRoute) {
        const routeHasErrors = currentRoute.errors && currentRoute.errors.length > 0;
        const routeStatus = routeHasErrors ? 'has_errors' : 'has_db_connection';
        
        baseComponents.push({
          id: 'current-route',
          type: 'realTreeNode',
          position: { x: 400, y: 50 },
          data: {
            id: 'current-route',
            label: `Current Route: ${currentRoute.path}`,
            description: `REAL route - ${currentRoute.component} - ${currentRoute.isProtected ? 'Protected' : 'Public'}`,
            icon: currentRoute.isAdmin ? Shield : currentRoute.isProtected ? Lock : Globe,
            type: 'Route',
            functional: !routeHasErrors,
            issues: currentRoute.errors || [],
            // Route card reflects actual status
            background: routeStatus === 'has_errors' ? 'bg-red-50 border-red-200' : 
                       'bg-blue-50 border-blue-200'
          }
        });
      }

      // Create components from REAL page scanning results ONLY - positioned by actual layout
      const groupedComponents = realComponents.reduce((acc, comp) => {
        const rowKey = Math.floor(comp.position.y / 80) * 80; // Group by 80px rows
        if (!acc[rowKey]) acc[rowKey] = [];
        acc[rowKey].push(comp);
        return acc;
      }, {} as Record<number, typeof realComponents>);
      
      const sortedRows = Object.keys(groupedComponents).map(Number).sort((a, b) => a - b);
      let flowYOffset = 300; // Start below database and route
      
      sortedRows.forEach((rowY, rowIndex) => {
        const rowComponents = groupedComponents[rowY];
        rowComponents
          .sort((a, b) => a.position.x - b.position.x)
          .forEach((realComp, colIndex) => {
            const componentNetworkCalls = [];
            
            // Determine accurate status for this component
            const componentStatus = realComp.actualErrors.length > 0 ? 'has_errors' :
                                   realComp.dbConnectionSuccess > 0 ? 'has_db_connection' :
                                   'no_db_connection';

            // Position components based on their actual page position
            const flowXPosition = 50 + (colIndex * 320); // Spread horizontally
            const flowYPosition = flowYOffset + (rowIndex * 250); // Stack rows vertically

            baseComponents.push({
              id: realComp.id,
              type: 'realTreeNode',
              position: { x: flowXPosition, y: flowYPosition },
              data: {
                id: realComp.id,
                label: realComp.text,
                description: `REAL ${realComp.type} - Found on DOM - ${realComp.isVisible ? 'Visible' : 'Hidden'}`,
                icon: realComp.type === 'button' ? Key : 
                      realComp.type === 'input' ? User : 
                      realComp.type === 'form' ? Mail : 
                      realComp.type === 'link' ? ArrowLeft : Activity,
                type: realComp.type,
                functional: realComp.actualErrors.length === 0,
                issues: realComp.actualErrors,
                // Card background matches ACTUAL status
                background: componentStatus === 'has_errors' ? 'bg-red-50 border-red-200' : 
                           componentStatus === 'has_db_connection' ? 'bg-green-50 border-green-200' :
                           'bg-orange-50 border-orange-200',
                metadata: {
                  hasClickHandler: realComp.hasClickHandler,
                  hasFormHandler: realComp.hasFormHandler,
                  eventListeners: realComp.hasEventListeners,
                  networkCalls: componentNetworkCalls.length,
                  isVisible: realComp.isVisible,
                  functionality: realComp.functionality,
                  actualStatus: componentStatus,
                  originalPosition: realComp.position // Keep original page position for reference
                }
              }
            });

            // Add connection to database if component has DB interaction
            if (realComp.dbConnectionSuccess > 0) {
              baseEdges.push({
                id: `${realComp.id}-to-db`,
                source: realComp.id,
                target: 'supabase-database',
                type: 'customConnection',
                data: {
                  status: realComp.actualErrors.length > 0 ? 'down' : 'stable',
                  issues: realComp.actualErrors.length > 0 ? realComp.actualErrors.join(', ') : null,
                  networkCalls: componentNetworkCalls.length,
                  successRate: realComp.dbConnectionAttempts > 0 ? 
                              (realComp.dbConnectionSuccess / realComp.dbConnectionAttempts * 100).toFixed(1) + '%' : 
                              '0%'
                }
              });
            }
          });
      });

      // Add connection from current route to database
      if (currentRoute && Object.keys(dbConnections).length > 0) {
        baseEdges.push({
          id: 'route-to-db',
          source: 'current-route',
          target: 'supabase-database',
          type: 'customConnection',
          data: {
            status: failedDbConnections > 0 ? 'down' : 'stable',
            issues: failedDbConnections > 0 ? 'Database has connection issues' : null
          }
        });
      }

      return { nodes: baseComponents, edges: baseEdges };
    };

    const { nodes: newNodes, edges: newEdges } = generateRealComponentStructure();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [realComponents, dbConnections, errors, routes, dbHealth, overallStatus, setNodes, setEdges]);

  const nodeTypes = {
    realTreeNode: RealTreeNode,
  };

  const edgeTypes = {
    customConnection: CustomConnectionLine,
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Topology
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                100% REAL System Analysis: {cardData.title}
              </h1>
              <p className="text-sm text-gray-600">
                Live scanning: {realComponents.length} DOM components, {routes.length} routes, {dbHealth.length} DB services - {overallStatus.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
              {realComponents.filter(c => c.dbConnectionSuccess > 0 && c.actualErrors.length === 0).length} Connected
            </Badge>
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
              {realComponents.filter(c => c.dbConnectionSuccess === 0 && c.actualErrors.length === 0).length} Created Not Connected
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600 border-red-300">
              {Object.keys(errors).length} Errors
            </Badge>
            <Badge variant="outline" className="text-xs">
              {realComponents.length} Total Components
            </Badge>
          </div>
        </div>
      </div>

      {/* Real-time Component Visualization */}
      <div className="flex-1 h-[calc(100vh-80px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-gray-50"
          defaultEdgeOptions={{
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: '#666',
            },
          }}
        >
          <Controls />
          <Background color="#e5e7eb" gap={20} />
        </ReactFlow>
      </div>

      {/* Live Status Panel */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
        <h3 className="font-medium text-sm mb-2">Live Monitoring Status</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Connected Components:</span>
            <span className="text-green-600">{realComponents.filter(c => c.dbConnectionSuccess > 0 && c.actualErrors.length === 0).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Created Not Connected:</span>
            <span className="text-orange-600">{realComponents.filter(c => c.dbConnectionSuccess === 0 && c.actualErrors.length === 0).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Error Components:</span>
            <span className="text-red-600">{realComponents.filter(c => c.actualErrors.length > 0).length}</span>
          </div>
          <div className="flex justify-between">
            <span>DB Tables Tested:</span>
            <span className="text-blue-600">{Object.keys(dbConnections).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Scan:</span>
            <span className="text-gray-600">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTopologyView;