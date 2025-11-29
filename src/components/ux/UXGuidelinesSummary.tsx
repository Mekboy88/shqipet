import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, RotateCcw, FileCheck } from 'lucide-react';

interface StatusItem {
  section: string;
  status: 'complete' | 'optional' | 'upgradeable';
  notes: string;
  icon: React.ReactNode;
}

export const UXGuidelinesSummary: React.FC = () => {
  const statusItems: StatusItem[] = [
    {
      section: 'Status Feedback',
      status: 'complete',
      notes: 'All visual indicators (badges, messages) working well',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      section: 'Verification & Switching',
      status: 'complete', 
      notes: 'Contact method switch + timer confirmed',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      section: 'Session Handling',
      status: 'optional',
      notes: 'Needs recovery logic for session loss & token expiry',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      section: 'Accessibility & Language',
      status: 'upgradeable',
      notes: 'Improve screen reader, RTL, and locale switching',
      icon: <RotateCcw className="h-4 w-4" />
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
      case 'optional':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            ⚠️ Optional
          </Badge>
        );
      case 'upgradeable':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            🔁 Upgradeable
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
      case 'optional':
        return 'text-yellow-600';
      case 'upgradeable':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-indigo-600" />
          Final Verdict for UX Guidelines Implementation
        </CardTitle>
        <CardDescription>
          Summary status of UX features across sections.
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          {statusItems.map((item, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
                item.status === 'complete' ? 'bg-green-100' :
                item.status === 'optional' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <span className={getStatusColor(item.status)}>
                  {item.icon}
                </span>
              </div>
              <h4 className="font-medium text-gray-800 text-sm mb-1">{item.section}</h4>
              {getStatusBadge(item.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};