import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Upload, Camera, FileText, Clock, Globe, Shield, Users, Eye, CheckCircle, XCircle, RotateCcw, Lock, Settings, Bell, Database, Fingerprint, Smartphone } from 'lucide-react';

const IdentityVerification: React.FC = () => {
  const [activeSection, setActiveSection] = useState('document-upload');

  const sections = [
    { id: 'document-upload', label: 'Document Upload', icon: Upload },
    { id: 'face-match', label: 'Face Match Selfie', icon: Camera },
    { id: 'document-types', label: 'Document Types', icon: FileText },
    { id: 'admin-interface', label: 'Admin Interface', icon: Settings },
    { id: 'verification-states', label: 'Verification States', icon: CheckCircle },
    { id: 'security-practices', label: 'Security', icon: Shield },
    { id: 'smart-addons', label: 'Smart Add-ons', icon: Smartphone },
    { id: 'ui-placement', label: 'UI Placement', icon: Eye }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'document-upload':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-blue-500" />
                  <div>
                    <CardTitle>Document Upload System</CardTitle>
                    <CardDescription>Government-issued ID verification interface</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>Upload Interface</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag & Drop or Click to Upload</p>
                      <p className="text-xs text-muted-foreground mt-1">Supports: JPG, PNG, PDF (Max 10MB)</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Mobile Camera Support</Label>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <Camera className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">Camera Capture</p>
                        <p className="text-xs text-muted-foreground">Direct photo capture on mobile devices</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-800">CONSEQUENCES:</p>
                      <p className="text-sm text-orange-700">
                        Failed document uploads may delay user verification and access to premium features. 
                        Poor image quality can lead to automatic rejection requiring re-submission.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">File Requirements</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Clear, high-resolution image</li>
                        <li>• All corners visible</li>
                        <li>• No glare or shadows</li>
                        <li>• Document not expired</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Security Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• End-to-end encryption</li>
                        <li>• Secure file transfer</li>
                        <li>• Auto-delete after review</li>
                        <li>• Hash-based verification</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Review Process</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 2-5 minute review time</li>
                        <li>• AI + manual verification</li>
                        <li>• Real-time status updates</li>
                        <li>• Instant notifications</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'face-match':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Camera className="h-6 w-6 text-green-500" />
                  <div>
                    <CardTitle>Face Match Selfie System</CardTitle>
                    <CardDescription>AI-powered facial recognition verification</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Selfie Capture Interface</h4>
                    <div className="border rounded-lg p-6 text-center">
                      <div className="w-32 h-32 mx-auto border-2 border-dashed border-muted-foreground rounded-full flex items-center justify-center mb-4">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm mb-2">Take a clear selfie photo</p>
                      <Button size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">AI Verification Process</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Face detection & alignment</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Liveness detection (anti-spoof)</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">ID photo comparison</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Match confidence score</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">CONSEQUENCES:</p>
                      <p className="text-sm text-red-700">
                        Failed face matching can permanently flag accounts as suspicious. Using fake photos, 
                        printed images, or replay attacks will result in immediate account restriction and 
                        potential legal action for identity fraud.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Anti-Spoof Detection</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Prevents printed photos</li>
                        <li>• Detects video replays</li>
                        <li>• 3D face mapping</li>
                        <li>• Eye movement tracking</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Match Requirements</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 85%+ similarity score</li>
                        <li>• Clear facial features</li>
                        <li>• Good lighting conditions</li>
                        <li>• No obstructions</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'document-types':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-purple-500" />
                  <div>
                    <CardTitle>Document Type Management</CardTitle>
                    <CardDescription>Supported ID types and validation rules</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">🛂 Passport</h4>
                      <div className="space-y-2">
                        <Badge variant="outline">Highest Trust</Badge>
                        <p className="text-sm text-muted-foreground">International travel document</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Machine readable zone</li>
                          <li>• Biometric chip support</li>
                          <li>• Global acceptance</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">🆔 National ID</h4>
                      <div className="space-y-2">
                        <Badge variant="outline">High Trust</Badge>
                        <p className="text-sm text-muted-foreground">Government-issued ID card</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Country-specific format</li>
                          <li>• Security features</li>
                          <li>• Digital verification</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">🚗 Driver's License</h4>
                      <div className="space-y-2">
                        <Badge variant="outline">Medium Trust</Badge>
                        <p className="text-sm text-muted-foreground">State/province driving permit</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Regional validation</li>
                          <li>• Address verification</li>
                          <li>• Age confirmation</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">CONSEQUENCES:</p>
                      <p className="text-sm text-blue-700">
                        Submitting invalid or fake documents will result in permanent account suspension. 
                        Document verification failures are logged and shared with fraud prevention services.
                      </p>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Document Validation Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Expiry Date Validation</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Check expiration date</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Allow 30-day grace period</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Auto-reject expired docs</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Country Restrictions</h4>
                        <div className="space-y-2">
                          <Label>Allowed Countries</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select countries..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Countries</SelectItem>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="eu">European Union</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        );

      case 'admin-interface':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-indigo-500" />
                  <div>
                    <CardTitle>Admin Review Interface</CardTitle>
                    <CardDescription>Manual review and approval system</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="submissions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="submissions">User Submissions</TabsTrigger>
                    <TabsTrigger value="review">Review Panel</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="submissions" className="space-y-4">
                    <div className="border rounded-lg">
                      <div className="p-4 border-b">
                        <h4 className="font-medium">Pending Verifications</h4>
                      </div>
                      <div className="divide-y">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">John Doe #{item}</p>
                                <p className="text-xs text-muted-foreground">Submitted 2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">Passport</Badge>
                              <Button size="sm">Review</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="review" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Document Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <Label>AI Risk Score</Label>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                              </div>
                              <span className="text-sm font-medium">25/100</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Face Match Confidence</Label>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                              </div>
                              <span className="text-sm font-medium">92%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Review Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button className="w-full" variant="default">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Verification
                          </Button>
                          <Button className="w-full" variant="destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Deny Verification
                          </Button>
                          <Button className="w-full" variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Request Re-upload
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">1,285</div>
                          <p className="text-xs text-muted-foreground">Verified Users</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">47</div>
                          <p className="text-xs text-muted-foreground">Pending Reviews</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">12</div>
                          <p className="text-xs text-muted-foreground">Denied Today</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">96.3%</div>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">CONSEQUENCES:</p>
                      <p className="text-sm text-yellow-700">
                        Manual review delays can impact user experience and platform trust. Incorrect 
                        approvals may lead to fraud, while false denials can cause legitimate user churn.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'verification-states':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-500" />
                  <div>
                    <CardTitle>Verification State Management</CardTitle>
                    <CardDescription>User verification status tracking</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <h4 className="font-medium">⚪ Not Started</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">User hasn't begun verification</p>
                      <Badge variant="secondary">Initial State</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <h4 className="font-medium">🟡 Pending</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Documents uploaded, under review</p>
                      <Badge variant="outline">In Progress</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h4 className="font-medium">🟢 Approved</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">User successfully verified</p>
                      <Badge variant="default">Complete</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <h4 className="font-medium">🔴 Denied</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Verification failed with reasons</p>
                      <Badge variant="destructive">Failed</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h4 className="font-medium">🔁 Correction Needed</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">User must re-upload documents</p>
                      <Badge variant="outline">Action Required</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <h4 className="font-medium">🔐 Locked</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Temporarily blocked for suspicious activity</p>
                      <Badge variant="destructive">Restricted</Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">CONSEQUENCES:</p>
                      <p className="text-sm text-purple-700">
                        Verification state changes affect user access to premium features, payment processing, 
                        and content creation tools. Locked accounts require admin intervention to restore access.
                      </p>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">State Transition Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium">Automatic Transitions</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Auto-approve low risk scores</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Auto-deny high risk scores</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Lock on fraud detection</span>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium">Manual Review Triggers</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Medium risk scores</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Multiple attempts</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">VPN detection</span>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        );

      case 'security-practices':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-red-500" />
                  <div>
                    <CardTitle>Security Best Practices</CardTitle>
                    <CardDescription>Enterprise-grade security implementation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">🧊 End-to-End Encryption</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• AES-256 encryption at rest</li>
                        <li>• TLS 1.3 for data in transit</li>
                        <li>• Encrypted file storage</li>
                        <li>• Zero-knowledge architecture</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">🔒 Time-Based Expiry</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Auto-delete after 30-90 days</li>
                        <li>• GDPR compliance</li>
                        <li>• Audit trail retention</li>
                        <li>• Secure data purging</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">⛔ Anti-Reuse Protection</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Block duplicate submissions</li>
                        <li>• Cross-account verification</li>
                        <li>• Unique document tracking</li>
                        <li>• Fraud prevention</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">🛡️ File Fingerprinting</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• SHA-256 hash verification</li>
                        <li>• Tamper detection</li>
                        <li>• File integrity checks</li>
                        <li>• Duplicate prevention</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">🎭 Anti-Spoofing</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Liveness detection</li>
                        <li>• 3D face mapping</li>
                        <li>• Motion analysis</li>
                        <li>• Print attack prevention</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">🕵️ Anomaly Detection</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Geo-location analysis</li>
                        <li>• Device fingerprinting</li>
                        <li>• Behavioral patterns</li>
                        <li>• Risk scoring</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">CONSEQUENCES:</p>
                      <p className="text-sm text-red-700">
                        Security breaches in identity verification can lead to massive data leaks, identity theft, 
                        regulatory fines, and complete loss of user trust. Inadequate security measures may result 
                        in legal liability and platform shutdown by authorities.
                      </p>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label>Data Retention Period</Label>
                          <Select defaultValue="90">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Encryption Level</Label>
                          <Select defaultValue="aes256">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aes128">AES-128</SelectItem>
                              <SelectItem value="aes256">AES-256</SelectItem>
                              <SelectItem value="rsa2048">RSA-2048</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Enable anti-spoofing detection</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Block duplicate document reuse</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Geo-location anomaly alerts</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Auto-delete expired documents</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        );

      case 'smart-addons':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-6 w-6 text-emerald-500" />
                  <div>
                    <CardTitle>Smart AI Add-ons</CardTitle>
                    <CardDescription>Advanced features for enhanced verification</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="ai-ocr" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="ai-ocr">AI OCR</TabsTrigger>
                    <TabsTrigger value="global-api">Global API</TabsTrigger>
                    <TabsTrigger value="badges">Verified Badges</TabsTrigger>
                    <TabsTrigger value="conditional">Conditional Access</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ai-ocr" className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">🧬 AI-Powered OCR</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Extract and validate information directly from ID documents
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-2">Extracted Data</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Full legal name</li>
                              <li>• Date of birth</li>
                              <li>• ID number</li>
                              <li>• Expiration date</li>
                              <li>• Address</li>
                              <li>• Document type</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Validation Features</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Format verification</li>
                              <li>• Checksum validation</li>
                              <li>• Age calculation</li>
                              <li>• Name matching</li>
                              <li>• Address verification</li>
                              <li>• Fraud detection</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="global-api" className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">🌐 Global Verification API</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Integrate with leading verification services
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 border rounded">
                            <h5 className="font-medium mb-2">Veriff</h5>
                            <p className="text-xs text-muted-foreground">Global ID verification with 190+ countries</p>
                          </div>
                          <div className="p-3 border rounded">
                            <h5 className="font-medium mb-2">Stripe Identity</h5>
                            <p className="text-xs text-muted-foreground">Payment-integrated verification</p>
                          </div>
                          <div className="p-3 border rounded">
                            <h5 className="font-medium mb-2">Onfido</h5>
                            <p className="text-xs text-muted-foreground">AI-powered identity verification</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="badges" className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">🎓 Verified Badge Levels</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Different verification tiers for user trust levels
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 border rounded">
                            <Badge variant="outline">Email ✉️</Badge>
                            <span className="text-sm">Email verified only</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 border rounded">
                            <Badge variant="secondary">Phone 📱</Badge>
                            <span className="text-sm">Email + phone verified</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 border rounded">
                            <Badge variant="default">ID Verified 🪪</Badge>
                            <span className="text-sm">Full identity verification</span>
                          </div>
                          <div className="flex items-center space-x-3 p-3 border rounded">
                            <Badge className="bg-gold text-black">Premium ⭐</Badge>
                            <span className="text-sm">ID + address + income verified</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="conditional" className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">📦 Conditional Access Control</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Unlock features based on verification level
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Storefront creation requires ID verification</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Payment processing requires verification</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">High-value transactions require premium verification</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Age-restricted content requires DOB verification</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">CONSEQUENCES:</p>
                      <p className="text-sm text-green-700">
                        Advanced verification features increase user trust and regulatory compliance but may 
                        create friction for legitimate users. Balance security with user experience to avoid 
                        abandonment during the verification process.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'ui-placement':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-orange-500" />
                  <div>
                    <CardTitle>UI Placement Strategy</CardTitle>
                    <CardDescription>Optimal user interface positioning</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">User-Facing Elements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <h5 className="font-medium mb-1">🪪 "Verify Identity" Button</h5>
                          <p className="text-sm text-muted-foreground">Profile settings, Pro dashboard, Storefront setup</p>
                        </div>
                        <div className="p-3 border rounded">
                          <h5 className="font-medium mb-1">📁 Upload Zone</h5>
                          <p className="text-sm text-muted-foreground">Modal after "Start ID Verification" click</p>
                        </div>
                        <div className="p-3 border rounded">
                          <h5 className="font-medium mb-1">🟢 Status Badge</h5>
                          <p className="text-sm text-muted-foreground">Next to username or in profile header</p>
                        </div>
                        <div className="p-3 border rounded">
                          <h5 className="font-medium mb-1">❓ "Why ID?" Info Box</h5>
                          <p className="text-sm text-muted-foreground">Brief legal explanation to build trust</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Admin Interface</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <h5 className="font-medium mb-1">📂 Submissions Table</h5>
                          <p className="text-sm text-muted-foreground">Admin dashboard with filtering and sorting</p>
                        </div>
                        <div className="p-3 border rounded">
                          <h5 className="font-medium mb-1">📊 Analytics Panel</h5>
                          <p className="text-sm text-muted-foreground">Verification metrics and success rates</p>
                        </div>
                        <div className="p-3 border rounded">
                          <h5 className="font-medium mb-1">🔎 Review Interface</h5>
                          <p className="text-sm text-muted-foreground">Side-by-side document and selfie comparison</p>
                        </div>
                        <div className="p-3 border rounded">
                          <h5 className="font-medium mb-1">🔔 Alert Center</h5>
                          <p className="text-sm text-muted-foreground">Fraud alerts and manual review notifications</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Verification Flow UX</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 border rounded">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                          <h5 className="font-medium text-sm">Document Type</h5>
                          <p className="text-xs text-muted-foreground">Select ID type</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                          <h5 className="font-medium text-sm">Upload Front</h5>
                          <p className="text-xs text-muted-foreground">Document front side</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                          <h5 className="font-medium text-sm">Upload Back</h5>
                          <p className="text-xs text-muted-foreground">Document back side</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">4</div>
                          <h5 className="font-medium text-sm">Take Selfie</h5>
                          <p className="text-xs text-muted-foreground">Face verification</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-lg">
                        <h5 className="font-medium mb-2">Estimated Timeline</h5>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>📤 Upload: 2-3 min</span>
                          <span>⏳ Review: 2-5 min</span>
                          <span>✅ Approval: Instant</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-800">CONSEQUENCES:</p>
                      <p className="text-sm text-orange-700">
                        Poor UI placement can lead to low verification completion rates, user confusion, and 
                        increased support requests. Hidden or confusing verification flows may result in 
                        users abandoning the process entirely.
                      </p>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Mobile Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium">Camera Integration</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Auto-focus on document</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Guide overlay for alignment</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Flash control for low light</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-medium">User Experience</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Progress indicator</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Retake photo option</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Voice guidance</span>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <FileText className="h-8 w-8" />
          Identity Verification (ID Uploads)
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          KYC-compliant identity verification system with document upload, AI-powered face matching, 
          and fraud detection capabilities for secure user authentication.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {sections.map((section, index) => {
          const Icon = section.icon;
          
          // Define different color schemes for each button
          const colorSchemes = [
            'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200',
            'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200',
            'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
            'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200',
            'bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border-rose-200',
            'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200',
            'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200',
            'bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 border-teal-200'
          ];
          
          const activeColorSchemes = [
            'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
            'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
            'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
            'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
            'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300',
            'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300',
            'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300',
            'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-300'
          ];

          const colorScheme = colorSchemes[index % colorSchemes.length];
          const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];

          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 ${
                activeSection === section.id
                  ? `${activeColorScheme} border-2`
                  : colorScheme
              }`}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      {renderSection()}
    </div>
  );
};

export default IdentityVerification;