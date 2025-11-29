import React, { useEffect, useState, useCallback } from 'react';
import { useS3HealthCheck } from '@/hooks/useS3HealthCheck';
import { supabase } from '@/integrations/supabase/client';
import { Globe, Database, Cloud } from 'lucide-react';

interface NodeStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  latency: number;
  position: { x: number; y: number };
  icon: React.ComponentType<any>;
}

interface ConnectionLine {
  from: string;
  to: string;
  status: 'healthy' | 'warning' | 'error';
  particles: Array<{
    id: string;
    progress: number;
    direction: 'forward' | 'reverse';
  }>;
}

const WasabiTopologyVisualization: React.FC = () => {
  const { healthData, isLoading, error, runHealthCheck } = useS3HealthCheck();
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  const [connections, setConnections] = useState<ConnectionLine[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Initialize nodes in pyramid formation
  const initializeNodes = useCallback(() => {
    const initialNodes: NodeStatus[] = [
      {
        id: 'website',
        name: 'Website',
        status: 'healthy',
        latency: 0,
        position: { x: 250, y: 50 }, // Top of pyramid
        icon: Globe
      },
      {
        id: 'supabase',
        name: 'Supabase DB',
        status: 'healthy',
        latency: 0,
        position: { x: 150, y: 200 }, // Bottom left
        icon: Database
      },
      {
        id: 'wasabi',
        name: 'Wasabi Cloud',
        status: 'healthy',
        latency: 0,
        position: { x: 350, y: 200 }, // Bottom right
        icon: Cloud
      }
    ];

    const initialConnections: ConnectionLine[] = [
      {
        from: 'website',
        to: 'supabase',
        status: 'healthy',
        particles: []
      },
      {
        from: 'website', 
        to: 'wasabi',
        status: 'healthy',
        particles: []
      },
      {
        from: 'supabase',
        to: 'wasabi',
        status: 'healthy',
        particles: []
      }
    ];

    setNodes(initialNodes);
    setConnections(initialConnections);
  }, []);

  // Update node statuses and connections when health data changes
  useEffect(() => {
    if (!healthData) return;

    // 1) Update nodes based on health data
    setNodes(prevNodes => {
      const nextNodes = prevNodes.map(node => {
        let status: 'healthy' | 'warning' | 'error' | 'offline' = 'healthy';
        let latency = 0;

        switch (node.id) {
          case 'website':
            status = healthData.website.online ? 'healthy' : 'offline';
            latency = healthData.website.latency_ms;
            break;
          case 'supabase':
            status = healthData.supabase.online ? 'healthy' : 'offline';
            latency = healthData.supabase.latency_ms;
            break;
          case 'wasabi':
            if (!healthData.s3.online) {
              status = 'offline';
            } else if (healthData.s3.latency_ms > 1000) {
              status = 'warning';
            } else if (!healthData.s3.permissions.get || !healthData.s3.permissions.put) {
              status = 'error';
            } else {
              status = 'healthy';
            }
            latency = healthData.s3.latency_ms;
            break;
        }

        return { ...node, status, latency };
      });

      // 2) Update connections using the new node statuses
      setConnections(prevConnections => prevConnections.map(conn => {
        const fromNode = nextNodes.find(n => n.id === conn.from);
        const toNode = nextNodes.find(n => n.id === conn.to);
        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        if (!fromNode || !toNode) return conn;
        if (fromNode.status === 'offline' || toNode.status === 'offline') status = 'error';
        else if (fromNode.status === 'error' || toNode.status === 'error') status = 'error';
        else if (fromNode.status === 'warning' || toNode.status === 'warning') status = 'warning';
        return { ...conn, status };
      }));

      return nextNodes;
    });
  }, [healthData]);

  // Animate particles along connection lines
  const animateParticles = useCallback(() => {
    setConnections(prevConnections => prevConnections.map(conn => {
      // Add new particles randomly
      const newParticles = [...conn.particles];
      
      if (Math.random() < 0.02 && conn.status === 'healthy') {
        newParticles.push({
          id: Math.random().toString(36).substring(7),
          progress: 0,
          direction: Math.random() > 0.5 ? 'forward' : 'reverse'
        });
      }

      // Update existing particles
      const updatedParticles = newParticles
        .map(particle => ({
          ...particle,
          progress: particle.progress + (conn.status === 'healthy' ? 0.02 : 0.01)
        }))
        .filter(particle => particle.progress <= 1);

      return { ...conn, particles: updatedParticles };
    }));
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      animateParticles();
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [animateParticles]);

  // Initialize nodes
  useEffect(() => {
    initializeNodes();
  }, [initializeNodes]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(runHealthCheck, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [runHealthCheck]);

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'stroke-green-500 fill-green-50';
      case 'warning': return 'stroke-yellow-500 fill-yellow-50';
      case 'error': return 'stroke-red-500 fill-red-50';
      case 'offline': return 'stroke-gray-400 fill-gray-50';
      default: return 'stroke-gray-400 fill-gray-50';
    }
  };

  const getConnectionColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'stroke-green-400';
      case 'warning': return 'stroke-yellow-400';
      case 'error': return 'stroke-red-400 stroke-dasharray-4-4';
      default: return 'stroke-gray-300';
    }
  };

  const calculateConnectionPath = (from: NodeStatus, to: NodeStatus) => {
    return `M ${from.position.x} ${from.position.y} L ${to.position.x} ${to.position.y}`;
  };

  const calculateParticlePosition = (from: NodeStatus, to: NodeStatus, progress: number) => {
    const x = from.position.x + (to.position.x - from.position.x) * progress;
    const y = from.position.y + (to.position.y - from.position.y) * progress;
    return { x, y };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading topology...</p>
        </div>
      </div>
    );
  }

  if (error && !healthData) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load topology</p>
          <button 
            onClick={runHealthCheck}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-gray-200">
      <svg width="100%" height="100%" viewBox="0 0 500 300" className="absolute inset-0">
        {/* Connection lines */}
        {connections.map(conn => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          
          if (!fromNode || !toNode) return null;

          return (
            <g key={`${conn.from}-${conn.to}`}>
              {/* Connection line */}
              <path
                d={calculateConnectionPath(fromNode, toNode)}
                className={`${getConnectionColor(conn.status)} stroke-2 transition-all duration-300`}
                fill="none"
              />
              
              {/* Animated particles */}
              {conn.particles.map(particle => {
                const pos = calculateParticlePosition(fromNode, toNode, 
                  particle.direction === 'forward' ? particle.progress : 1 - particle.progress
                );
                return (
                  <circle
                    key={particle.id}
                    cx={pos.x}
                    cy={pos.y}
                    r="3"
                    className="fill-current text-blue-400 opacity-75"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const IconComponent = node.icon;
          return (
            <g key={node.id}>
              {/* Node circle */}
              <circle
                cx={node.position.x}
                cy={node.position.y}
                r="30"
                className={`${getNodeColor(node.status)} stroke-2 transition-all duration-300 drop-shadow-sm`}
              />
              
              {/* Node icon */}
              <foreignObject
                x={node.position.x - 12}
                y={node.position.y - 12}
                width="24"
                height="24"
              >
                <IconComponent className="w-6 h-6 text-gray-700" />
              </foreignObject>
              
              {/* Node label */}
              <text
                x={node.position.x}
                y={node.position.y + 50}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-700"
              >
                {node.name}
              </text>
              
              {/* Latency indicator */}
              <text
                x={node.position.x}
                y={node.position.y + 65}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {node.latency}ms
              </text>
            </g>
          );
        })}
      </svg>

      {/* Status indicators */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-6 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-gray-600">Healthy</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-600">Warning</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-gray-600">Error</span>
        </div>
      </div>

      {/* Last updated */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WasabiTopologyVisualization;