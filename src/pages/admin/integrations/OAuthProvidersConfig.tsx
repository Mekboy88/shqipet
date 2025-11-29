import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, X, Eye, EyeOff, RotateCcw, Edit, Power, Plus } from 'lucide-react';

interface OAuthProvider {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'expiring';
  lastUsed: string;
  expiryDate: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUris: string[];
  usageCount?: number;
}

const OAuthProvidersConfig: React.FC = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<OAuthProvider[]>([
    {
      id: 'google',
      name: 'Google',
      status: 'active',
      lastUsed: '2h ago',
      expiryDate: '2025-08-21',
      clientId: 'AIx7...9sd',
      clientSecret: 'GOCSPX-hidden-secret-key',
      scopes: ['openid', 'profile', 'email'],
      redirectUris: ['https://yourapp.com/auth/callback'],
      usageCount: 1247
    },
    {
      id: 'apple',
      name: 'Apple',
      status: 'expiring',
      lastUsed: '5 days ago',
      expiryDate: '2025-07-30',
      clientId: 'apple-client-id',
      clientSecret: 'apple-secret-key',
      scopes: ['name', 'email'],
      redirectUris: ['https://yourapp.com/auth/apple/callback'],
      usageCount: 389
    },
    {
      id: 'facebook',
      name: 'Facebook',
      status: 'inactive',
      lastUsed: '—',
      expiryDate: '—',
      clientId: '—',
      clientSecret: '—',
      scopes: [],
      redirectUris: [],
      usageCount: 0
    }
  ]);

  const [editingProvider, setEditingProvider] = useState<OAuthProvider | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRotateModalOpen, setIsRotateModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>;
      case 'expiring':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Expiring Soon
        </span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <X className="w-3 h-3 mr-1" />
          Inactive
        </span>;
    }
  };

  const handleEdit = (provider: OAuthProvider) => {
    setEditingProvider({ ...provider });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingProvider) return;
    
    setProviders(prev => prev.map(p => 
      p.id === editingProvider.id ? editingProvider : p
    ));
    
    // Log the change
    console.log({
      event: "oauth_provider_update",
      provider: editingProvider.name,
      user: "admin@example.com",
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: "✅ OAuth Configuration Updated",
      description: `${editingProvider.name} OAuth config updated successfully.`,
    });
    
    setIsEditModalOpen(false);
    setEditingProvider(null);
  };

  const handleRotateSecret = (provider: OAuthProvider) => {
    setSelectedProvider(provider.id);
    setIsRotateModalOpen(true);
  };

  const confirmRotateSecret = () => {
    const providerName = providers.find(p => p.id === selectedProvider)?.name;
    
    // Simulate secret rotation
    setProviders(prev => prev.map(p => 
      p.id === selectedProvider 
        ? { ...p, clientSecret: `NEW-${Math.random().toString(36).substring(7)}-SECRET` }
        : p
    ));
    
    toast({
      title: "🔁 Secret Rotated",
      description: `${providerName} OAuth secret has been rotated successfully.`,
      variant: "default",
    });
    
    setIsRotateModalOpen(false);
    setSelectedProvider('');
  };

  const handleDisable = (provider: OAuthProvider) => {
    setSelectedProvider(provider.id);
    setIsDisableModalOpen(true);
  };

  const confirmDisable = () => {
    const providerName = providers.find(p => p.id === selectedProvider)?.name;
    
    setProviders(prev => prev.map(p => 
      p.id === selectedProvider 
        ? { ...p, status: 'inactive' as const, lastUsed: '—', expiryDate: '—' }
        : p
    ));
    
    toast({
      title: "❌ Provider Disabled",
      description: `${providerName} OAuth login has been disabled.`,
      variant: "destructive",
    });
    
    setIsDisableModalOpen(false);
    setSelectedProvider('');
  };

  const toggleSecretVisibility = (providerId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (expiryDate === '—') return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7;
  };

  const hasExpiringProviders = providers.some(p => isExpiringSoon(p.expiryDate));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OAuth Provider Configuration</h1>
            <p className="text-gray-600 mt-1">Manage external authentication providers and their settings</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Provider
          </Button>
        </div>

        {/* Expiration Alert */}
        {hasExpiringProviders && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">⚠️ One or more OAuth secrets need updating soon</span>
            </div>
          </div>
        )}

        {/* Provider Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage (30d)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {provider.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                          <div className="text-sm text-gray-500">{provider.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(provider.status)}
                      {isExpiringSoon(provider.expiryDate) && (
                        <div className="text-xs text-orange-600 mt-1">
                          Expires in {Math.ceil((new Date(provider.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.lastUsed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.expiryDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{provider.clientId}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSecretVisibility(provider.id)}
                          className="ml-2 h-6 w-6 p-0"
                        >
                          {showSecrets[provider.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                      {showSecrets[provider.id] && (
                        <code className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded mt-1 block">
                          {provider.clientSecret}
                        </code>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.usageCount?.toLocaleString() || '0'} logins
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(provider)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRotateSecret(provider)}
                          className="text-green-600 hover:text-green-900"
                          disabled={provider.status === 'inactive'}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisable(provider)}
                          className="text-red-600 hover:text-red-900"
                          disabled={provider.status === 'inactive'}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Provider Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit OAuth Provider: {editingProvider?.name}</DialogTitle>
            </DialogHeader>
            {editingProvider && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={editingProvider.clientId}
                    onChange={(e) => setEditingProvider({...editingProvider, clientId: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    value={editingProvider.clientSecret}
                    onChange={(e) => setEditingProvider({...editingProvider, clientSecret: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="scopes">Scopes (comma-separated)</Label>
                  <Input
                    id="scopes"
                    value={editingProvider.scopes.join(', ')}
                    onChange={(e) => setEditingProvider({
                      ...editingProvider, 
                      scopes: e.target.value.split(',').map(s => s.trim())
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="redirectUris">Redirect URIs (one per line)</Label>
                  <Textarea
                    id="redirectUris"
                    value={editingProvider.redirectUris.join('\n')}
                    onChange={(e) => setEditingProvider({
                      ...editingProvider, 
                      redirectUris: e.target.value.split('\n').filter(uri => uri.trim())
                    })}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rotate Secret Modal */}
        <Dialog open={isRotateModalOpen} onOpenChange={setIsRotateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rotate OAuth Secret</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-orange-800 font-medium">Warning</span>
                </div>
                <p className="text-orange-700 mt-1">
                  Rotating this key will log users out unless synchronized in your OAuth provider console.
                  Make sure to update the secret in your provider's dashboard as well.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRotateModalOpen(false)}>Cancel</Button>
              <Button onClick={confirmRotateSecret} variant="destructive">Rotate Secret</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Disable Provider Modal */}
        <Dialog open={isDisableModalOpen} onOpenChange={setIsDisableModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disable OAuth Provider</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Are you sure you want to disable {providers.find(p => p.id === selectedProvider)?.name} login?</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">
                  This will prevent users from logging in using this provider until re-enabled.
                  Existing sessions will remain active.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDisableModalOpen(false)}>Cancel</Button>
              <Button onClick={confirmDisable} variant="destructive">Disable Provider</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default OAuthProvidersConfig;