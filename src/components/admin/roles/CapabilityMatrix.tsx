import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Shield, Database, Users, FileText, CreditCard, Cog } from 'lucide-react';
import supabase from '@/lib/relaxedSupabase';
import { Capability, CapabilityCategory } from '@/types/rbac';

export function CapabilityMatrix() {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [filteredCapabilities, setFilteredCapabilities] = useState<CapabilityCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCapabilities();
  }, []);

  useEffect(() => {
    filterCapabilities();
  }, [capabilities, searchTerm, selectedCategory]);

  const fetchCapabilities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('capabilities')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        throw error;
      }

      setCapabilities(data || []);
    } catch (error) {
      console.error('Error fetching capabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCapabilities = () => {
    let filtered = capabilities;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cap =>
        cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cap => cap.category === selectedCategory);
    }

    // Group by category
    const grouped = filtered.reduce((acc, capability) => {
      const category = capability.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(capability);
      return acc;
    }, {} as Record<string, Capability[]>);

    const categories: CapabilityCategory[] = Object.entries(grouped).map(([name, caps]) => ({
      name,
      capabilities: caps.sort((a, b) => a.name.localeCompare(b.name))
    }));

    setFilteredCapabilities(categories.sort((a, b) => a.name.localeCompare(b.name)));
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'system': return <Cog className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'users': return <Users className="h-4 w-4" />;
      case 'content': return <FileText className="h-4 w-4" />;
      case 'commerce': return <CreditCard className="h-4 w-4" />;
      case 'technical': return <Database className="h-4 w-4" />;
      default: return <Cog className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'system': return 'border-red-200 bg-red-50';
      case 'security': return 'border-orange-200 bg-orange-50';
      case 'users': return 'border-blue-200 bg-blue-50';
      case 'content': return 'border-green-200 bg-green-50';
      case 'commerce': return 'border-purple-200 bg-purple-50';
      case 'technical': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const uniqueCategories = [...new Set(capabilities.map(cap => cap.category))].sort();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading capability matrix...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Capability Matrix</CardTitle>
          <CardDescription>
            Granular permissions that can be assigned to roles and users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search capabilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredCapabilities.map((category) => (
          <Card key={category.name} className={`${getCategoryColor(category.name)} border-2`}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                {getCategoryIcon(category.name)}
                <div>
                  <CardTitle className="text-lg capitalize">
                    {category.name} Capabilities
                  </CardTitle>
                  <CardDescription>
                    {category.capabilities.length} permission{category.capabilities.length !== 1 ? 's' : ''} in this category
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {category.capabilities.map((capability) => (
                  <div
                    key={capability.id}
                    className="p-4 bg-white rounded-md border shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{capability.name}</h4>
                      <Badge variant="outline" className="text-xs ml-2">
                        {capability.category}
                      </Badge>
                    </div>
                    {capability.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {capability.description}
                      </p>
                    )}
                    <div className="text-xs font-mono text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                      {capability.code}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCapabilities.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-muted-foreground">
              No capabilities found matching your search criteria.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capability System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Capability System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">How Capabilities Work</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Capabilities define specific permissions</li>
                <li>• Roles are collections of capabilities</li>
                <li>• Users inherit capabilities through their roles</li>
                <li>• Scope determines where capabilities apply</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Scope Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <span className="font-medium">Global:</span> Platform-wide access</li>
                <li>• <span className="font-medium">Regional:</span> Limited to specific regions</li>
                <li>• <span className="font-medium">Resource:</span> Limited to specific items</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}