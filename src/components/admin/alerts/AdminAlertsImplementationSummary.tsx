import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info, Shield } from 'lucide-react';

interface StatusItem {
  section: string;
  status: 'complete' | 'upgradeable' | 'optional';
  notes: string;
  icon: React.ReactNode;
}

export const AdminAlertsImplementationSummary: React.FC = () => {
  const statusItems: StatusItem[] = [
    {
      section: 'Security Triggers',
      status: 'complete',
      notes: 'Covers session, verification, and role-based alerts well.',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      section: 'Smart Behavior Detection',
      status: 'upgradeable',
      notes: 'Needs ghost login and token anomaly detection added.',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      section: 'Audit/Event Hooks',
      status: 'upgradeable',
      notes: 'Suggest adding triggers for moderator and admin settings edits.',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      section: 'Alert Severity & Filters',
      status: 'optional',
      notes: 'Recommended for large teams to organize alert priorities.',
      icon: <Info className="h-4 w-4" />
    },
    {
      section: 'Delivery System',
      status: 'optional',
      notes: 'Add webhook/email if you want alerts off-platform.',
      icon: <Info className="h-4 w-4" />
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            ✅ Complete
          </Badge>
        );
      case 'upgradeable':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            ⚠️ Upgradeable
          </Badge>
        );
      case 'optional':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            🟢 Optional
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-600';
      case 'upgradeable':
        return 'text-yellow-600';
      case 'optional':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="bg-white border-l-4 border-green-500 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Final Verdict for Admin Alerts Implementation
        </CardTitle>
        <CardDescription>
          Summary section to indicate current implementation status, what's complete, and what can be upgraded for full coverage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Section</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Notes</th>
              </tr>
            </thead>
            <tbody>
              {statusItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(item.status)}>
                        {item.icon}
                      </span>
                      <span className="font-medium text-gray-800">{item.section}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {item.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-800 text-sm mb-1">Complete</h4>
            <p className="text-2xl font-bold text-green-600">
              {statusItems.filter(item => item.status === 'complete').length}
            </p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-800 text-sm mb-1">Upgradeable</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {statusItems.filter(item => item.status === 'upgradeable').length}
            </p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800 text-sm mb-1">Optional</h4>
            <p className="text-2xl font-bold text-blue-600">
              {statusItems.filter(item => item.status === 'optional').length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};