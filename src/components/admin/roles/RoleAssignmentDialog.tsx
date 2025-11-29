import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, UserPlus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import { Role } from '@/types/rbac';
import { toast } from 'sonner';
import supabase from '@/lib/relaxedSupabase';

interface RoleAssignmentDialogProps {
  role: Role;
}

export function RoleAssignmentDialog({ role }: RoleAssignmentDialogProps) {
  const { grantUserRole, loading } = useRoleManagement();
  const [open, setOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [scopeType, setScopeType] = useState<'global' | 'regional' | 'resource'>('global');
  const [scopeValue, setScopeValue] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearchUsers = async (email: string) => {
    if (!email || email.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_id
        `)
        .or(`user_id.in.(${email})`); // This would need a different approach in real implementation

      if (error) {
        console.error('Error searching users:', error);
        return;
      }

      // In a real implementation, you'd need to search by email through auth.users
      // For now, this is a placeholder showing the structure
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    const success = await grantUserRole(
      selectedUser.user_id,
      role.id,
      scopeType,
      scopeValue || undefined,
      resourceType || undefined,
      resourceId || undefined,
      expiryDate ? expiryDate.toISOString() : undefined
    );

    if (success) {
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSearchEmail('');
    setSelectedUser(null);
    setScopeType('global');
    setScopeValue('');
    setResourceType('');
    setResourceId('');
    setExpiryDate(undefined);
    setSearchResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          <UserPlus className="h-3 w-3 mr-1" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Role: {role.name}</DialogTitle>
          <DialogDescription>
            Grant this role to a user with optional scope and expiration settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Search */}
          <div className="space-y-2">
            <Label htmlFor="user-search">Search User by Email</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-search"
                placeholder="Enter user email..."
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  handleSearchUsers(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="border rounded-md divide-y max-h-32 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setSearchResults([]);
                      setSearchEmail(user.email || user.user_id);
                    }}
                  >
                    <div className="text-sm font-medium">{user.email || user.user_id}</div>
                    <div className="text-xs text-muted-foreground">ID: {user.user_id}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedUser && (
              <div className="p-2 bg-muted rounded-md">
                <div className="text-sm font-medium">Selected: {selectedUser.email || selectedUser.user_id}</div>
              </div>
            )}
          </div>

          {/* Scope Configuration */}
          <div className="space-y-2">
            <Label htmlFor="scope-type">Scope Type</Label>
            <Select value={scopeType} onValueChange={(value: any) => setScopeType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global Access</SelectItem>
                <SelectItem value="regional">Regional Access</SelectItem>
                <SelectItem value="resource">Resource-Specific</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scopeType === 'regional' && (
            <div className="space-y-2">
              <Label htmlFor="scope-value">Region/Locale</Label>
              <Input
                id="scope-value"
                placeholder="e.g., us-east, europe, albania"
                value={scopeValue}
                onChange={(e) => setScopeValue(e.target.value)}
              />
            </div>
          )}

          {scopeType === 'resource' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="resource-type">Resource Type</Label>
                <Select value={resourceType} onValueChange={setResourceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="listing">Listing</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="collection">Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-id">Resource ID</Label>
                <Input
                  id="resource-id"
                  placeholder="UUID or identifier"
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label>Expiration Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !expiryDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, 'PPP') : 'No expiration'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={loading || !selectedUser}
            >
              {loading ? 'Assigning...' : 'Assign Role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}