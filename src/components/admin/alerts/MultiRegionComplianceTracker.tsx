import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Shield, 
  FileText, 
  Eye,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Upload,
  Calendar,
  BarChart3,
  Award
} from 'lucide-react';

interface ComplianceItem {
  region: string;
  fullName: string;
  description: string;
  requirements: string[];
  status: 'not-started' | 'planned' | 'partial' | 'complete';
  progress: number;
  icon: React.ReactNode;
  lastUpdated: string;
  nextDeadline?: string;
  documentation?: string[];
}

interface ComplianceMilestone {
  date: string;
  title: string;
  region: string;
  status: 'completed' | 'upcoming' | 'overdue';
  description: string;
}

export const MultiRegionComplianceTracker: React.FC = () => {
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceItem | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const complianceItems: ComplianceItem[] = [
    {
      region: 'GDPR',
      fullName: 'General Data Protection Regulation',
      description: 'EU data protection and privacy regulation',
      requirements: [
        'Cookie consent management',
        'Right to be forgotten implementation',
        'Data portability features',
        'Privacy policy updates',
        'Data breach notification system'
      ],
      status: 'partial',
      progress: 75,
      icon: <Shield className="h-4 w-4" />,
      lastUpdated: '2 days ago',
      nextDeadline: 'Q2 2024 - Data portability',
      documentation: ['privacy-policy.pdf', 'gdpr-assessment.pdf']
    },
    {
      region: 'CCPA',
      fullName: 'California Consumer Privacy Act',
      description: 'California state privacy law',
      requirements: [
        'Do Not Sell opt-out mechanism',
        'Consumer data disclosure',
        'Right to delete personal information',
        'Verified consumer requests',
        'Privacy notice requirements'
      ],
      status: 'planned',
      progress: 25,
      icon: <FileText className="h-4 w-4" />,
      lastUpdated: '1 week ago',
      nextDeadline: 'Q3 2024 - Implementation start',
      documentation: ['ccpa-requirements.pdf']
    },
    {
      region: 'ISO 27001',
      fullName: 'Information Security Management',
      description: 'International security standard',
      requirements: [
        'Information security policy',
        'Risk assessment procedures',
        'Audit trail implementation',
        'Security incident logging',
        'Employee security training'
      ],
      status: 'complete',
      progress: 100,
      icon: <Award className="h-4 w-4" />,
      lastUpdated: '1 month ago',
      documentation: ['iso27001-certificate.pdf', 'security-policy.pdf', 'audit-report.pdf']
    },
    {
      region: 'SOC 2',
      fullName: 'Service Organization Control 2',
      description: 'Security and availability controls',
      requirements: [
        'Security controls framework',
        'Availability monitoring',
        'Processing integrity checks',
        'Confidentiality measures',
        'Third-party audit completion'
      ],
      status: 'partial',
      progress: 60,
      icon: <BarChart3 className="h-4 w-4" />,
      lastUpdated: '3 days ago',
      nextDeadline: 'Q4 2024 - Annual audit',
      documentation: ['soc2-type1.pdf']
    },
    {
      region: 'PIPEDA',
      fullName: 'Personal Information Protection and Electronic Documents Act',
      description: 'Canadian federal privacy law',
      requirements: [
        'Privacy policy compliance',
        'Consent mechanisms',
        'Data breach notifications',
        'Individual access rights',
        'Accountability measures'
      ],
      status: 'not-started',
      progress: 0,
      icon: <Globe className="h-4 w-4" />,
      lastUpdated: 'Never',
      nextDeadline: 'Q1 2025 - Assessment needed'
    }
  ];

  const complianceMilestones: ComplianceMilestone[] = [
    {
      date: '2024-01-15',
      title: 'ISO 27001 Certification Completed',
      region: 'ISO 27001',
      status: 'completed',
      description: 'Successfully achieved ISO 27001 certification'
    },
    {
      date: '2024-03-30',
      title: 'GDPR Data Portability Implementation',
      region: 'GDPR',
      status: 'upcoming',
      description: 'Implement automated data export features'
    },
    {
      date: '2024-06-15',
      title: 'CCPA Implementation Launch',
      region: 'CCPA',
      status: 'upcoming',
      description: 'Full CCPA compliance features go live'
    },
    {
      date: '2024-12-01',
      title: 'SOC 2 Type II Audit',
      region: 'SOC 2',
      status: 'upcoming',
      description: 'Annual SOC 2 Type II compliance audit'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-600';
      case 'partial':
        return 'text-yellow-600';
      case 'planned':
        return 'text-blue-600';
      case 'not-started':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        );
      case 'planned':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="h-3 w-3 mr-1" />
            Planned
          </Badge>
        );
      case 'not-started':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Not Started
          </Badge>
        );
      default:
        return null;
    }
  };

  const overallProgress = Math.round(
    complianceItems.reduce((sum, item) => sum + item.progress, 0) / complianceItems.length
  );

  return (
    <div className="space-y-6">
      {/* Overview Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-600" />
            Compliance Overview
          </CardTitle>
          <CardDescription>
            Global regulatory compliance status and progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{overallProgress}%</div>
              <div className="text-sm text-orange-700">Overall Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">
                {complianceItems.filter(item => item.status === 'complete').length}
              </div>
              <div className="text-sm text-green-700">Complete</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">
                {complianceItems.filter(item => item.status === 'partial').length}
              </div>
              <div className="text-sm text-yellow-700">In Progress</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600">
                {complianceItems.filter(item => item.status === 'not-started').length}
              </div>
              <div className="text-sm text-red-700">Not Started</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Global Compliance Progress</h4>
              <p className="text-sm text-gray-600">Track progress across all regulatory frameworks</p>
            </div>
            <Button variant="outline" onClick={() => setShowTimeline(!showTimeline)}>
              <Calendar className="h-4 w-4 mr-2" />
              {showTimeline ? 'Hide' : 'Show'} Timeline
            </Button>
          </div>
          <Progress value={overallProgress} className="mt-3" />
        </CardContent>
      </Card>

      {/* Compliance Timeline (Pro Feature) */}
      {showTimeline && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Compliance Timeline
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">Pro</Badge>
            </CardTitle>
            <CardDescription>
              Milestone tracking and deadline management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceMilestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    milestone.status === 'completed' ? 'bg-green-600' :
                    milestone.status === 'upcoming' ? 'bg-blue-600' : 'bg-red-600'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {milestone.region}
                          </Badge>
                          <span className="text-xs text-gray-500">{milestone.date}</span>
                        </div>
                      </div>
                      <Badge className={
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                        milestone.status === 'upcoming' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        'bg-red-100 text-red-800 border-red-300'
                      }>
                        {milestone.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Tracker Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Regional Compliance Status
          </CardTitle>
          <CardDescription>
            Detailed tracking of compliance requirements by region and standard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Region/Standard</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Setup Compliance Needed</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Progress</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complianceItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.status === 'complete' ? 'bg-green-100' :
                          item.status === 'partial' ? 'bg-yellow-100' :
                          item.status === 'planned' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          <span className={getStatusColor(item.status)}>
                            {item.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{item.region}</h4>
                          <p className="text-sm text-gray-600">{item.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {item.requirements.slice(0, 2).map((req, idx) => (
                          <div key={idx} className="text-sm text-gray-600">• {req}</div>
                        ))}
                        {item.requirements.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{item.requirements.length - 2} more requirements
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(item.status)}
                      <div className="text-xs text-gray-500 mt-1">
                        Updated {item.lastUpdated}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <Progress value={item.progress} className="w-20" />
                        <div className="text-xs text-gray-600">{item.progress}%</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCompliance(item)}>
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {item.icon}
                                {item.region} Compliance Details
                              </DialogTitle>
                              <DialogDescription>
                                {item.fullName} - {item.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Requirements Checklist</h4>
                                <div className="space-y-2">
                                  {item.requirements.map((req, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      {req}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {item.documentation && item.documentation.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Documentation
                                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">Pro</Badge>
                                  </h4>
                                  <div className="space-y-2">
                                    {item.documentation.map((doc, idx) => (
                                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <FileText className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm">{doc}</span>
                                        <Button variant="ghost" size="sm" className="ml-auto">
                                          <ExternalLink className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Setup
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pro Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Pro Compliance Features
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">Pro Only</Badge>
          </CardTitle>
          <CardDescription>
            Advanced compliance management and documentation features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Upload className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">Document Upload</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Upload and manage compliance certificates, audit reports, and legal documentation
              </p>
              <Button variant="outline" size="sm" disabled>
                <Upload className="h-3 w-3 mr-1" />
                Upload Documents
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <ExternalLink className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">Third-Party Reports</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Link to external audit reports, security assessments, and compliance certifications
              </p>
              <Button variant="outline" size="sm" disabled>
                <ExternalLink className="h-3 w-3 mr-1" />
                Add Report Links
              </Button>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">Compliance Analytics</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Advanced reporting and analytics for compliance status and progress tracking
              </p>
              <Button variant="outline" size="sm" disabled>
                <BarChart3 className="h-3 w-3 mr-1" />
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};