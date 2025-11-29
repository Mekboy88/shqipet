import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Activity, DollarSign, FileText, AlertTriangle, Target } from 'lucide-react';

const CloudMonitoring: React.FC = () => {
  const navigate = useNavigate();

  const monitoringSections = [
    {
      id: 'live-operations',
      title: 'Live Operation Counter',
      description: 'Real-time tracking of database queries and function calls',
      icon: Activity,
      href: '/admin/cloud/operations',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'cost-estimator',
      title: 'Cost Estimator Dashboard',
      description: 'Estimate and track your Cloud usage costs',
      icon: DollarSign,
      href: '/admin/cloud/costs',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'query-logs',
      title: 'Query Logs Viewer',
      description: 'View detailed logs of all database operations',
      icon: FileText,
      href: '/admin/cloud/logs',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'realtime-alerts',
      title: 'Real-Time Alerts',
      description: 'Get notified of expensive or problematic patterns',
      icon: AlertTriangle,
      href: '/admin/cloud/alerts',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'optimization-suggestions',
      title: 'Optimization Suggestions',
      description: 'Automatic recommendations to reduce costs',
      icon: Target,
      href: '/admin/cloud/optimizations',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Cloud Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor and optimize your Cloud usage in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitoringSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className="p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => navigate(section.href)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CloudMonitoring;
