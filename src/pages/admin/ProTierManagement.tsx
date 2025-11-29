import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Star, 
  Crown, 
  Zap, 
  MoreHorizontal,
  UserCheck,
  UserX,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProLevel {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  pro_level: string;
  created_at: string;
  updated_at: string;
}

const ProTierManagement: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProLevel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProLevel | null>(null);
  const [updating, setUpdating] = useState(false);

  const proLevels = [
    { value: 'free', label: 'Free', icon: Users, color: 'gray' },
    { value: 'low_pro', label: 'Low Pro', icon: Star, color: 'purple' },
    { value: 'medium_pro', label: 'Medium Pro', icon: Crown, color: 'blue' },
    { value: 'super_pro', label: 'Super Pro', icon: Zap, color: 'gold' },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, pro_level, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProLevel = async (userId: string, newLevel: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase.rpc('update_user_pro_level', {
        target_user_uuid: userId,
        new_level: newLevel
      });

      if (error) throw error;

      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? { ...user, pro_level: newLevel, updated_at: new Date().toISOString() }
            : user
        )
      );

      toast({
        title: "Success",
        description: "User pro level updated successfully",
      });

      setSelectedUser(null);
      
    } catch (error) {
      console.error('Error updating user pro level:', error);
      toast({
        title: "Error",
        description: "Failed to update user pro level",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterLevel === 'all' || user.pro_level === filterLevel;
    
    return matchesSearch && matchesFilter;
  });

  const getProLevelConfig = (level: string) => {
    return proLevels.find(p => p.value === level) || proLevels[0];
  };

  const stats = {
    total: users.length,
    free: users.filter(u => u.pro_level === 'free').length,
    low_pro: users.filter(u => u.pro_level === 'low_pro').length,
    medium_pro: users.filter(u => u.pro_level === 'medium_pro').length,
    super_pro: users.filter(u => u.pro_level === 'super_pro').length,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center space-x-3">
        <Users className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pro Tier Management</h1>
          <p className="text-gray-600">Manage user pro levels and subscriptions</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </CardContent>
        </Card>
        {proLevels.map(level => {
          const IconComponent = level.icon;
          const count = stats[level.value as keyof typeof stats];
          
          return (
            <Card key={level.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-gray-500">{level.label}</div>
                  </div>
                  <IconComponent className="h-6 w-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Label>Filter by Pro Level</Label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {proLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage individual user pro levels and access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map(user => {
              const proConfig = getProLevelConfig(user.pro_level);
              const IconComponent = proConfig.icon;
              
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.first_name || user.last_name 
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : user.email
                        }
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">
                        Updated: {new Date(user.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <Badge 
                        variant={user.pro_level === 'free' ? 'secondary' : 'default'}
                        className="min-w-[80px] justify-center"
                      >
                        {proConfig.label}
                      </Badge>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Pro Level</DialogTitle>
                          <DialogDescription>
                            Change the pro level for {user.email}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <Label>Current Level</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <IconComponent className="h-5 w-5" />
                              <Badge>{proConfig.label}</Badge>
                            </div>
                          </div>
                          
                          <div>
                            <Label>New Level</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {proLevels.map(level => {
                                const LevelIcon = level.icon;
                                return (
                                  <Button
                                    key={level.value}
                                    variant={user.pro_level === level.value ? "default" : "outline"}
                                    onClick={() => updateUserProLevel(user.id, level.value)}
                                    disabled={updating || user.pro_level === level.value}
                                    className="justify-start"
                                  >
                                    <LevelIcon className="h-4 w-4 mr-2" />
                                    {level.label}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProTierManagement;