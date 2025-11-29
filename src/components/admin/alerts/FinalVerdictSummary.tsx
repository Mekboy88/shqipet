import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Award, 
  TrendingUp, 
  Crown,
  FileCheck,
  Target,
  Users,
  Shield,
  Zap,
  Star
} from 'lucide-react';

interface VerdictArea {
  area: string;
  status: 'excellent' | 'optional' | 'upgradeable' | 'pro-only';
  notes: string;
  description: string;
  icon: React.ReactNode;
  implementationDetails: string[];
}

export const FinalVerdictSummary: React.FC = () => {
  const verdictAreas: VerdictArea[] = [
    {
      area: 'Core Placement Mapping',
      status: 'excellent',
      notes: "You've covered all 3 essential anchors: system, admin, and user placement visibility.",
      description: 'System requirements, health monitoring, and integration placement',
      icon: <Target className="h-4 w-4" />,
      implementationDetails: [
        'System Requirements & Status monitoring',
        'Real-time health checks for auth providers',
        'Database connectivity status',
        'Clear system integration placement guides'
      ]
    },
    {
      area: 'Developer Traceability Tools',
      status: 'excellent',
      notes: "Comprehensive session mapping and login chain visualization will help debug authentication issues quickly.",
      description: 'Session service mapping, login flow audit, and AI risk routing',
      icon: <Zap className="h-4 w-4" />,
      implementationDetails: [
        'Session-to-lifecycle mapping for debug',
        'Visual login chain flow tracking',
        'AI risk rule decision routing',
        'Live session monitoring capabilities'
      ]
    },
    {
      area: 'API/System Connection Indicators',
      status: 'excellent',
      notes: "Real-time connectivity monitoring across all critical services provides excellent operational visibility.",
      description: 'Third-party service monitoring, database linkages, and external API health',
      icon: <Shield className="h-4 w-4" />,
      implementationDetails: [
        'SendGrid/Twilio service monitoring',
        'Supabase table synchronization status',
        'External API health checks',
        'Connection error tracking and alerts'
      ]
    },
    {
      area: 'Setup Checklists',
      status: 'optional',
      notes: "Could help future scale-up and admin observability by providing clear configuration status.",
      description: 'Module completion tracking, sync status, and configuration alerts',
      icon: <CheckCircle className="h-4 w-4" />,
      implementationDetails: [
        'Color-coded module completion badges',
        'Component sync timestamp tracking',
        'Setup alerts for misconfigured modules',
        'Overall system health dashboard'
      ]
    },
    {
      area: 'Global Compliance Markers',
      status: 'pro-only',
      notes: "Required for investor readiness or enterprise audits. Essential for global market expansion.",
      description: 'GDPR, CCPA, ISO compliance tracking with documentation management',
      icon: <Crown className="h-4 w-4" />,
      implementationDetails: [
        'Multi-region compliance tracking',
        'Progress monitoring for each standard',
        'Milestone timeline management',
        'Audit documentation upload system'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'optional':
        return 'text-yellow-600';
      case 'upgradeable':
        return 'text-blue-600';
      case 'pro-only':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <Star className="h-3 w-3 mr-1" />
            Excellent
          </Badge>
        );
      case 'optional':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Optional
          </Badge>
        );
      case 'upgradeable':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <TrendingUp className="h-3 w-3 mr-1" />
            Upgradeable
          </Badge>
        );
      case 'pro-only':
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            <Crown className="h-3 w-3 mr-1" />
            Pro Only
          </Badge>
        );
      default:
        return null;
    }
  };

  const excellentCount = verdictAreas.filter(area => area.status === 'excellent').length;
  const totalAreas = verdictAreas.length;
  const implementationScore = Math.round((excellentCount / totalAreas) * 100);

  return (
    <div className="space-y-6">
      {/* Implementation Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gray-600" />
            Implementation Assessment
          </CardTitle>
          <CardDescription>
            Overall evaluation of authentication admin panel completeness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-gray-600">{implementationScore}%</div>
              <div className="text-sm text-gray-700">Implementation Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{excellentCount}</div>
              <div className="text-sm text-green-700">Excellent Areas</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">
                {verdictAreas.filter(area => area.status === 'optional').length}
              </div>
              <div className="text-sm text-yellow-700">Optional Features</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">
                {verdictAreas.filter(area => area.status === 'pro-only').length}
              </div>
              <div className="text-sm text-purple-700">Pro Features</div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Strong Foundation Achieved</h4>
                <p className="text-sm text-gray-600">
                  Your authentication system has comprehensive monitoring, traceability, and system integration visibility.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Verdict Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-gray-600" />
            Final Verdict Summary
          </CardTitle>
          <CardDescription>
            Page-level implementation completeness for developers, auditors, and administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Area</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Notes</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Implementation</th>
                </tr>
              </thead>
              <tbody>
                {verdictAreas.map((area, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          area.status === 'excellent' ? 'bg-green-100' :
                          area.status === 'optional' ? 'bg-yellow-100' :
                          area.status === 'upgradeable' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          <span className={getStatusColor(area.status)}>
                            {area.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{area.area}</h4>
                          <p className="text-sm text-gray-600">{area.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(area.status)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {area.notes}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {area.implementationDetails.slice(0, 2).map((detail, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {detail}
                          </div>
                        ))}
                        {area.implementationDetails.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{area.implementationDetails.length - 2} more features
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Next Steps Recommendations
          </CardTitle>
          <CardDescription>
            Suggested actions based on your current implementation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Immediate Priorities
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <div className="font-medium text-green-800 text-sm">Monitor & Maintain</div>
                  <div className="text-green-700 text-xs">Your core systems are well-implemented. Focus on monitoring and maintenance.</div>
                </div>
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <div className="font-medium text-blue-800 text-sm">Test Edge Cases</div>
                  <div className="text-blue-700 text-xs">Test session handling, device switching, and multi-region scenarios.</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <Crown className="h-4 w-4 text-purple-600" />
                Future Enhancements
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <div className="font-medium text-yellow-800 text-sm">Setup Automation</div>
                  <div className="text-yellow-700 text-xs">Consider implementing the setup checklist for easier onboarding.</div>
                </div>
                <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                  <div className="font-medium text-purple-800 text-sm">Enterprise Features</div>
                  <div className="text-purple-700 text-xs">Add compliance tracking for enterprise clients and global expansion.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button className="bg-gray-600 hover:bg-gray-700">
              <Award className="h-4 w-4 mr-2" />
              Export Implementation Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};